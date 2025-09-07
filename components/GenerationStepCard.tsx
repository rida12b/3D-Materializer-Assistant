import React from 'react';
import type { GenerationStep } from '../types';
import { ArrowPathIcon, CheckIcon, ClockIcon, ExclamationIcon } from './Icons';
import Spinner from './Spinner';

interface GenerationStepCardProps {
  step: GenerationStep;
}

const GenerationStepCard: React.FC<GenerationStepCardProps> = ({ step }) => {
  const getStatusContent = () => {
    switch (step.status) {
      case 'pending':
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-600">
            <ClockIcon className="w-12 h-12 mb-2" />
            <span className="font-medium font-mono-tech">PENDING</span>
          </div>
        );
      case 'generating':
        return (
          <div className="flex flex-col items-center justify-center h-full text-[#00ffff]">
            <Spinner />
            <span className="mt-4 font-medium font-mono-tech tracking-widest">{`// GENERATING...`}</span>
          </div>
        );
      case 'completed':
        return (
          step.imageUrl && (
            <img
              src={step.imageUrl}
              alt={step.title}
              className="w-full h-full object-cover rounded-lg"
            />
          )
        );
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center h-full text-red-400 p-4 text-center">
            <ExclamationIcon className="w-12 h-12 mb-2"/>
            <span className="font-semibold font-mono-tech">ERROR</span>
            <p className="text-xs text-red-500 mt-1">{step.error}</p>
          </div>
        );
      default:
        return null;
    }
  };
  
  // FIX: Corrected a typo `()_` to `()` which was causing a syntax error.
  const getStatusIcon = () => {
    switch (step.status) {
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-gray-600" />;
      case 'generating':
        return <ArrowPathIcon className="w-5 h-5 text-[#00ffff] animate-spin" />;
      case 'completed':
        return <CheckIcon className="w-5 h-5 text-green-400" />;
      case 'error':
        return <ExclamationIcon className="w-5 h-5 text-red-400" />;
    }
  };

  return (
    <div className="bg-black/30 border border-[#00ffff]/20 rounded-xl shadow-lg flex flex-col transition-all duration-300 transform hover:scale-105 hover:border-[#00ffff]/80">
      <div className="p-4 border-b border-[#00ffff]/20 flex justify-between items-center">
        <h3 className="font-semibold text-white font-mono-tech">{`> ${step.title}`}</h3>
        {getStatusIcon()}
      </div>
      <div className="aspect-square flex-grow flex items-center justify-center p-2">
        {getStatusContent()}
      </div>
    </div>
  );
};

export default GenerationStepCard;