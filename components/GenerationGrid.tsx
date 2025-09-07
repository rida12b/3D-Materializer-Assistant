import React from 'react';
import type { GenerationStep } from '../types';
import GenerationStepCard from './GenerationStepCard';

interface GenerationGridProps {
  steps: GenerationStep[];
}

const GenerationGrid: React.FC<GenerationGridProps> = ({ steps }) => {
  const hasStarted = steps.some(step => step.status !== 'pending');
  
  if (!hasStarted) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {steps.map((step) => (
        <GenerationStepCard key={step.id} step={step} />
      ))}
    </div>
  );
};

export default GenerationGrid;
