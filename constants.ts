import type { GenerationStep } from './types';

export const INITIAL_GENERATION_STEPS: GenerationStep[] = [
  {
    id: 1,
    title: 'Opposite View',
    prompt: `CONTEXT: You are an AI assistant creating an orthographic character turnaround sheet for 3D modeling.
SOURCE IMAGE: The user has provided a profile (side) view of a character.
TASK: Generate the opposite profile view of the character, showing them looking in the reverse direction.
CRITICAL RULES:
1. **Style Consistency:** Maintain 100% stylistic consistency with the source image. This includes line art, color palette, shading style, and all character features.
2. **No Changes:** DO NOT add, remove, or alter any details of the character's design. The output must be the exact same character from a different angle.
3. **Background:** The background must be a solid, neutral color.`,
    status: 'pending',
    imageUrl: null,
  },
  {
    id: 2,
    title: 'Front View',
    prompt: `CONTEXT: You are an AI assistant creating an orthographic character turnaround sheet for 3D modeling.
SOURCE IMAGE: The user has provided a single image of a character.
TASK: Generate a perfectly symmetrical, front-on orthographic view of the character, as if they are looking directly at the camera.
CRITICAL RULES:
1. **Style Consistency:** Maintain 100% stylistic consistency with the source image. This includes line art, color palette, shading style, and all character features.
2. **No Changes:** DO NOT add, remove, or alter any details of the character's design. The output must be the exact same character from a different angle.
3. **Background:** The background must be a solid, neutral color.`,
    status: 'pending',
    imageUrl: null,
  },
  {
    id: 3,
    title: 'Back View',
    prompt: `CONTEXT: You are an AI assistant creating an orthographic character turnaround sheet for 3D modeling.
SOURCE IMAGE: The user has provided a single image of a character.
TASK: Generate a perfectly symmetrical, rear orthographic view of the character's head and shoulders from directly behind.
CRITICAL RULES:
1. **Style Consistency:** Maintain 100% stylistic consistency with the source image. This includes line art, color palette, shading style, and all character features.
2. **No Changes:** DO NOT add, remove, or alter any details of the character's design. The output must be the exact same character from a different angle.
3. **Background:** The background must be a solid, neutral color.`,
    status: 'pending',
    imageUrl: null,
  },
  {
    id: 4,
    title: '3/4 View',
    prompt: `CONTEXT: You are an AI assistant creating an orthographic character turnaround sheet for 3D modeling.
SOURCE IMAGE: The user has provided a single image of a character.
TASK: Generate a three-quarters (3/4) view. The character's head should be turned to face partially towards the viewer, midway between a front and side view.
CRITICAL RULES:
1. **Style Consistency:** Maintain 100% stylistic consistency with the source image. This includes line art, color palette, shading style, and all character features.
2. **No Changes:** DO NOT add, remove, or alter any details of the character's design. The output must be the exact same character from a different angle.
3. **Background:** The background must be a solid, neutral color.`,
    status: 'pending',
    imageUrl: null,
  },
  {
    id: 5,
    title: 'Top-Down View',
    prompt: `CONTEXT: You are an AI assistant creating an orthographic character turnaround sheet for 3D modeling.
SOURCE IMAGE: The user has provided a single image of a character.
TASK: Generate an orthographic top-down view, looking directly down at the top of the character's head.
CRITICAL RULES:
1. **Style Consistency:** Maintain 100% stylistic consistency with the source image. This includes line art, color palette, shading style, and all character features.
2. **No Changes:** DO NOT add, remove, or alter any details of the character's design. The output must be the exact same character from a different angle.
3. **Background:** The background must be a solid, neutral color.`,
    status: 'pending',
    imageUrl: null,
  },
  {
    id: 6,
    title: 'Bottom-Up View',
    prompt: `CONTEXT: You are an AI assistant creating a character reference sheet for 3D modeling.
SOURCE IMAGE: The user has provided an image of a character.
TASK: Generate a "worm's-eye view" of the character. This is an orthographic bottom-up view, looking directly up from underneath the character's chin.
CRITICAL RULES:
1. **Upright Orientation:** The character MUST remain upright. DO NOT rotate or flip the character upside down. The perspective is from below, looking up at the character.
2. **Style Consistency:** Maintain 100% stylistic consistency with the source image. This includes line art, color palette, shading style, and all character features.
3. **No Changes:** DO NOT add, remove, or alter any details of the character's design. The output must be the exact same character from a different angle.
4. **Background:** The background must be a solid, neutral color.`,
    status: 'pending',
    imageUrl: null,
  },
];