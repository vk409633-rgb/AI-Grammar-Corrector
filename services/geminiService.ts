
import { GoogleGenAI, Type } from "@google/genai";
import { StyleOption } from '../types';

const proResponseSchema = {
    type: Type.OBJECT,
    properties: {
        correctedText: {
            type: Type.STRING,
            description: "The fully corrected and revised text.",
        },
        explanation: {
            type: Type.STRING,
            description: "A brief, bulleted list markdown explaining the most significant changes made and why."
        }
    },
    required: ["correctedText", "explanation"],
};


export const correctGrammar = async (
    text: string, 
    isPro: boolean, 
    style: StyleOption
): Promise<{ correctedText: string; explanation: string | null }> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    if (!text.trim()) {
        return { correctedText: '', explanation: null };
    }

    try {
        if (isPro) {
            const prompt = `You are an expert editor. Please correct the grammar and spelling of the following text. Additionally, refine the text to adopt a more "${style}" tone, improving clarity, flow, and impact.
            
            Provide your response as a single JSON object with two keys: "correctedText" and "explanation". The explanation should be a brief, markdown-formatted bulleted list.

            Original Text:
            "${text}"`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: proResponseSchema,
                }
            });

            const jsonResponse = JSON.parse(response.text);
            return {
                correctedText: jsonResponse.correctedText,
                explanation: jsonResponse.explanation
            };
        } else {
            const prompt = `Correct all grammar and spelling mistakes in the following text. Only provide the corrected text, without any explanations or introductions.

            Original Text:
            "${text}"

            Corrected Text:`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt
            });

            return { correctedText: response.text, explanation: null };
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get corrections from the AI. Please try again.");
    }
};
