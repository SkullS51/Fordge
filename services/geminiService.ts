
import { GoogleGenAI, Type } from "@google/genai";
import { CodeForgeOutput } from "../types"; // Import the new interface

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLyrics = async (theme: string, style: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write professional song lyrics based on:
    THEME: ${theme}
    STYLE: ${style}
    
    The output should be a single JSON object with title, lyrics (formatted with line breaks), and genre.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          lyrics: { type: Type.STRING },
          genre: { type: Type.STRING }
        },
        required: ["title", "lyrics", "genre"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const applyAIEffect = async (base64Image: string, prompt: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/png' } },
        { text: `Edit this image based on the prompt: ${prompt}. Return only the edited image.` },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  return null;
};

export const generateCode = async (prompt: string, language: string, outputType: 'code' | 'ui'): Promise<CodeForgeOutput> => {
  const isUI = outputType === 'ui';

  const properties: Record<string, any> = {
    code: { type: Type.STRING, description: `The generated code in ${language}.` },
    explanation: { type: Type.STRING, description: 'A brief technical explanation of the generated code, focusing on priorities.' }
  };

  if (isUI) {
    properties.htmlPreview = { type: Type.STRING, description: 'An HTML snippet representing the UI, for live preview.' };
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview', // Use a capable model for coding and UI
    contents: `You are an Elite coding assistant. Your priorities are:
    - Modern best practices
    - Type safety
    - Clean architecture
    - Strict adherence to ${language}
    
    ${isUI ? 'In addition to the code, also provide an HTML snippet that can be directly rendered in a browser for a live preview of the UI.' : ''}
    
    Based on the following request, generate the code and a brief technical explanation.
    
    REQUEST: ${prompt}
    
    Provide the output as a single JSON object with 'code', 'explanation'${isUI ? ", and 'htmlPreview'" : ''} fields.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: properties,
        required: ["code", "explanation"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};
