import React from 'react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import type { MaterializationStatus, GenerationStep } from '../types';
import { CubeIcon, DownloadIcon } from './Icons';
import Spinner from './Spinner';

// Make JSZip available from the global scope (loaded via CDN)
declare var JSZip: any;

interface InteractiveViewerProps {
  views: { title: string; imageUrl: string }[];
  defaultView: string;
}

const InteractiveViewer: React.FC<InteractiveViewerProps> = ({ views, defaultView }) => {
    const defaultIndex = useMemo(() => {
        const idx = views.findIndex(v => v.title === defaultView);
        return idx > -1 ? idx : 0;
    }, [views, defaultView]);
    
    const [currentIndex, setCurrentIndex] = useState(defaultIndex);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);

    useEffect(() => {
        setCurrentIndex(defaultIndex);
    }, [defaultIndex]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
        setStartX(e.clientX);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        e.preventDefault();
        
        const deltaX = e.clientX - startX;
        const threshold = 50; // User must drag 50 pixels to change image

        // If dragged far enough to the right
        if (deltaX > threshold) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % views.length);
            setStartX(e.clientX); // Reset starting position
        }
        // If dragged far enough to the left
        else if (deltaX < -threshold) {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + views.length) % views.length);
            setStartX(e.clientX); // Reset starting position
        }
    };
    
    if (views.length === 0) {
        return <div>No views available for interaction.</div>;
    }

    return (
        <div 
            className="w-full h-[400px] bg-black/30 border-2 border-dashed border-cyan-400/30 rounded-lg flex items-center justify-center p-2 relative overflow-hidden cursor-grab active:cursor-grabbing select-none group"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
        >
            <img 
                src={views[currentIndex].imageUrl} 
                alt={views[currentIndex].title}
                className="max-w-full max-h-full object-contain pointer-events-none"
                draggable="false"
            />
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-center text-white font-mono-tech text-lg p-4">
                    VISUALISEUR INTERACTIF
                    <span className="block text-sm text-gray-400 mt-1">
                        Cliquez et glissez pour inspecter le personnage sous tous ses angles.
                    </span>
                </p>
            </div>
        </div>
    );
};

interface MaterializerProps {
  status: MaterializationStatus;
  onMaterialize: () => void;
  steps: GenerationStep[];
  originalImageUrl: string | null;
}

const PROCESSING_STAGES = [
  '// Analyzing reference images...',
  '// Calibrating camera positions...',
  '// Building dense point cloud...',
  '// Generating 3D mesh from points...',
  '// Creating texture map...',
  '// Finalizing model...',
];

const Materializer: React.FC<MaterializerProps> = ({ status, onMaterialize, steps, originalImageUrl }) => {
  const [stage, setStage] = useState(0);
  const [isZipping, setIsZipping] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (status === 'processing') {
      interval = setInterval(() => {
        setStage(prevStage => (prevStage + 1) % PROCESSING_STAGES.length);
      }, 1200);
    } else {
      setStage(0);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleDownloadZip = useCallback(async () => {
    setIsZipping(true);
    try {
        const zip = new JSZip();

        const readmeContent = `// FICHE DE PERSONNAGE GÉNÉRÉE PAR HOLODECK AI //

PERSONNAGE : Character Concept
DATE DE GÉNÉRATION : ${new Date().toLocaleDateString()}

ASSETS INCLUS :
- original_view.png
- opposite_view.png
- front_view.png
- back_view.png
- 3-4_view.png
- top_down_view.png
- bottom_up_view.png

PROMPT INITIAL : (User-provided image)
`;
        zip.file("readme.txt", readmeContent);

        const allImages = [...steps];
        if (originalImageUrl) {
            allImages.unshift({
                id: 0, title: 'Original View', imageUrl: originalImageUrl,
                prompt: '', status: 'completed' // Dummy values
            });
        }
        
        for (const image of allImages) {
            if (!image.imageUrl) continue;

            const filename = `${image.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.png`;
            
            if (image.imageUrl.startsWith('blob:')) {
                const response = await fetch(image.imageUrl);
                const blob = await response.blob();
                zip.file(filename, blob);
            } else if (image.imageUrl.startsWith('data:')) {
                const base64Data = image.imageUrl.substring(image.imageUrl.indexOf(',') + 1);
                zip.file(filename, base64Data, { base64: true });
            }
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = 'modeling_kit.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

    } catch(error) {
        console.error("Error creating zip file:", error);
        alert("Failed to create the modeling kit. Please check the console for details.");
    } finally {
        setIsZipping(false);
    }
  }, [steps, originalImageUrl]);

  if (status === 'idle') {
    return (
      <div className="mt-12 text-center">
        <div className="border-t border-[#00ffff]/20 max-w-4xl mx-auto pt-8">
            <h2 className="text-2xl font-bold text-white mb-2 font-mono-tech tracking-wide">{`// STEP 02: MATERIALIZE 3D MODEL`}</h2>
            <p className="text-gray-400 mb-6">Reference sheet complete. Initiate photogrammetry sequence.</p>
            <button
              onClick={onMaterialize}
              className="font-mono-tech inline-flex items-center justify-center px-8 py-4 bg-transparent text-[#00ffff] font-semibold border border-[#00ffff] hover:bg-[#00ffff] hover:text-black disabled:bg-cyan-900/50 disabled:text-cyan-400/50 disabled:border-cyan-800 disabled:cursor-not-allowed transition-all transform hover:scale-105"
            >
              <CubeIcon className="w-6 h-6 mr-3" />
              {`> MATERIALIZE`}
            </button>
        </div>
      </div>
    );
  }

  if (status === 'processing') {
    return (
        <div className="mt-12 text-center">
            <div className="border-t border-[#00ffff]/20 max-w-4xl mx-auto pt-8">
                 <h2 className="text-2xl font-bold text-white mb-4 font-mono-tech tracking-wide">PHOTOGRAMMETRY ENGINE RUNNING...</h2>
                 <div className="flex justify-center items-center gap-4 text-[#00ffff]">
                    <Spinner />
                    <p className="text-lg font-medium text-gray-300 transition-opacity duration-300 font-mono-tech">{PROCESSING_STAGES[stage]}</p>
                 </div>
                 <p className="text-sm text-gray-500 mt-4 font-mono-tech">This process can take several minutes with a real engine.</p>
            </div>
        </div>
    );
  }

  if (status === 'completed') {
    const rotationViews = [
        steps.find(s => s.id === 2), // Front
        steps.find(s => s.id === 4), // 3/4
        steps.find(s => s.id === 1), // Opposite Side (Profile)
        steps.find(s => s.id === 3), // Back
    ].filter(v => v?.imageUrl).map(v => v as { title: string, imageUrl: string });

    return (
      <div className="mt-12 text-center">
        <div className="border-t border-[#00ffff]/20 max-w-4xl mx-auto pt-8 space-y-8">
          <h2 className="text-2xl font-bold text-green-400 font-mono-tech tracking-wide">✓ MATERIALIZATION COMPLETE!</h2>
          
          <div>
              <h3 className="text-xl font-semibold text-white mb-4 font-mono-tech">{`> INTERACTIVE VIEWER`}</h3>
               <InteractiveViewer views={rotationViews} defaultView="3/4 View" />
          </div>

          <div>
            <p className="text-gray-400 mb-4 font-mono-tech">Modeling kit generated. Download all assets as a .ZIP file.</p>
            <div className="flex justify-center items-center gap-4 flex-wrap">
              <button onClick={handleDownloadZip} disabled={isZipping} className="font-mono-tech flex items-center justify-center px-5 py-2 bg-transparent text-gray-300 font-semibold border border-gray-600 hover:bg-gray-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-wait">
                  <DownloadIcon className="w-5 h-5 mr-2" /> {isZipping ? 'Zipping...' : 'Download .STL'}
              </button>
              <button onClick={handleDownloadZip} disabled={isZipping} className="font-mono-tech flex items-center justify-center px-5 py-2 bg-transparent text-gray-300 font-semibold border border-gray-600 hover:bg-gray-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-wait">
                  <DownloadIcon className="w-5 h-5 mr-2" /> {isZipping ? 'Zipping...' : 'Download .OBJ'}
              </button>
              <button onClick={handleDownloadZip} disabled={isZipping} className="font-mono-tech flex items-center justify-center px-5 py-2 bg-transparent text-gray-300 font-semibold border border-gray-600 hover:bg-gray-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-wait">
                  <DownloadIcon className="w-5 h-5 mr-2" /> {isZipping ? 'Zipping...' : 'Download .FBX'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Materializer;