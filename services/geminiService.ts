import { GoogleGenAI, Modality } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateImageView(prompt: string, base64Image: string, mimeType: string): Promise<string> {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    // Find the first image part in the response
    const imagePart = response.candidates?.[0]?.content?.parts?.find(
      (part) => part.inlineData
    );

    if (imagePart && imagePart.inlineData) {
      return imagePart.inlineData.data;
    } else {
      // If no image is returned, provide a more detailed error.
      const safetyReason = response.promptFeedback?.blockReason;
      if (safetyReason) {
         throw new Error(`Image generation blocked due to: ${safetyReason}`);
      }
      
      const textResponse = response.text?.trim();
      if (textResponse) {
          throw new Error(`API returned a text response instead of an image: "${textResponse}"`);
      }

      // If there's no specific reason, the model likely failed to generate.
      let detailedError = "No image data found in the API response.";
      if (!response.candidates || response.candidates.length === 0) {
        detailedError += " The response contained no candidates.";
      } else if (!response.candidates[0].content) {
        detailedError += " The response candidate had no content.";
      }
      
      const finishReason = response.candidates?.[0]?.finishReason;
      if(finishReason && finishReason !== 'STOP'){
          detailedError += ` Generation stopped due to: ${finishReason}.`;
      }

      throw new Error(detailedError);
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while calling the Gemini API.");
  }
}