export type GenerationStatus = 'pending' | 'generating' | 'completed' | 'error';

export interface GenerationStep {
  id: number;
  title: string;
  prompt: string;
  status: GenerationStatus;
  imageUrl: string | null;
  error?: string;
}

// FIX: Add missing MaterializationStatus type.
export type MaterializationStatus = 'idle' | 'processing' | 'completed';
