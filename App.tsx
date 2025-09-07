import React from 'react';
import { useState } from 'react';
// FIX: Add MaterializationStatus to types import
import type { GenerationStep, GenerationStatus, MaterializationStatus } from './types';
import { INITIAL_GENERATION_STEPS } from './constants';
import { generateImageView } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import GenerationGrid from './components/GenerationGrid';
import { fileToBase64 } from './utils/fileUtils';
// FIX: Remove DownloadIcon as it's no longer used in this component, and import Materializer
import { ArrowPathIcon, SparklesIcon } from './components/Icons';
import Materializer from './components/Materializer';

// Make JSZip available from the global scope (loaded via CDN)
declare var JSZip: any;

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>(INITIAL_GENERATION_STEPS);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // FIX: Add state for materialization process
  const [materializationStatus, setMaterializationStatus] = useState<MaterializationStatus>('idle');

  const handleImageUpload = (file: File) => {
    setOriginalImage(file);
    setOriginalImageUrl(URL.createObjectURL(file));
    handleReset();
  };

  const updateStepStatus = (id: number, status: GenerationStatus, data?: Partial<GenerationStep>) => {
    setGenerationSteps(prevSteps =>
      prevSteps.map(step =>
        step.id === id ? { ...step, status, ...data } : step
      )
    );
  };

  const handleGenerate = async () => {
    if (!originalImage) {
      setError('Please upload an image first.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGenerationSteps(INITIAL_GENERATION_STEPS);
    // FIX: Also reset materialization status when generating again
    setMaterializationStatus('idle');

    const base64Image = await fileToBase64(originalImage);
    const mimeType = originalImage.type;

    for (const step of INITIAL_GENERATION_STEPS) {
      try {
        updateStepStatus(step.id, 'generating');
        const resultBase64 = await generateImageView(step.prompt, base64Image, mimeType);
        const resultImageUrl = `data:image/png;base64,${resultBase64}`;
        updateStepStatus(step.id, 'completed', { imageUrl: resultImageUrl });
      } catch (e) {
        console.error(`Error in generation step ${step.id}:`, e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        updateStepStatus(step.id, 'error', { error: errorMessage });
        setError(`Failed at step: ${step.title}. ${errorMessage}`);
        setIsGenerating(false);
        return; // Stop the process on failure
      }
    }

    setIsGenerating(false);
  };

  const handleReset = () => {
    setGenerationSteps(INITIAL_GENERATION_STEPS);
    setError(null);
    setIsGenerating(false);
    // FIX: reset materialization status
    setMaterializationStatus('idle');
  };
  
  // FIX: Add handler for materialization process
  const handleMaterialize = () => {
    setMaterializationStatus('processing');
    // Simulate photogrammetry processing time
    setTimeout(() => {
      setMaterializationStatus('completed');
    }, 7500); 
  };

  const allStepsCompleted = generationSteps.every(step => step.status === 'completed');

  return (
    <div className="min-h-screen font-sans text-[#e1e1e1]">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-2">
            <SparklesIcon className="w-8 h-8 text-[#00ffff] mr-3 cyan-glow" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              3D Materializer Assistant
            </h1>
          </div>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            From 2D sketch to a 3D-ready reference sheet. Upload your art and let AI build the perspectives.
          </p>
        </header>
        
        <div className="max-w-xl mx-auto bg-black/30 rounded-lg p-6 border border-[#00ffff]/30 shadow-2xl shadow-[#00ffff]/10 mb-12">
          <ImageUploader onImageUpload={handleImageUpload} />
          {originalImageUrl && (
            <div className="mt-6 flex flex-col items-center gap-4">
               <div className="relative group w-full max-w-sm">
                 <img src={originalImageUrl} alt="Original Upload" className="rounded-lg w-full object-contain border border-gray-700" />
                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                    <p className="text-white font-semibold text-lg font-mono-tech tracking-widest">{`> CREATIVE SEED LOADED`}</p>
                 </div>
               </div>
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="font-mono-tech flex items-center justify-center px-6 py-3 bg-transparent text-[#00ffff] font-semibold border border-[#00ffff] hover:bg-[#00ffff] hover:text-black disabled:bg-cyan-900/50 disabled:text-cyan-400/50 disabled:border-cyan-800 disabled:cursor-not-allowed transition-all"
                >
                  {isGenerating ? (
                    <>
                      <ArrowPathIcon className="animate-spin w-5 h-5 mr-2" />
                      {`// GENERATING...`}
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5 mr-2" />
                      {`> GENERATE VIEWS`}
                    </>
                  )}
                </button>
                 <button
                  onClick={handleReset}
                  disabled={isGenerating}
                  className="font-mono-tech px-6 py-3 bg-transparent text-gray-400 font-semibold border border-gray-600 hover:bg-gray-600 hover:text-white disabled:bg-gray-800/50 disabled:cursor-not-allowed transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="text-center my-4 p-4 bg-[#ff0055]/10 border border-[#ff0055]/50 text-red-200 rounded-lg max-w-4xl mx-auto font-mono-tech">
            <p><span className="font-bold">{`> ERROR:`}</span> {error}</p>
          </div>
        )}

        <GenerationGrid steps={generationSteps} />
        
        {/* FIX: Replaced the old download section with the new Materializer component flow */}
        {allStepsCompleted && (
          <Materializer
            status={materializationStatus}
            onMaterialize={handleMaterialize}
            steps={generationSteps}
            originalImageUrl={originalImageUrl}
          />
        )}


        <footer className="text-center mt-16 text-gray-600">
            <p className="text-sm font-mono-tech">
                {`// Powered by Gemini. Built for creative workflows.`}
            </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
