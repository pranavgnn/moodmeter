import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

const MoodAnalysisSchema = z.object({
    title: z.string().max(30).describe("A very concise title (4-5 words max) for the prompt"),
    description: z
        .string()
        .describe("A short description summarizing the prompt"),
    moods: z
        .array(
            z.object({
                mood: z.string(),
                intensity: z.number().min(0).max(10),
            })
        )
        .describe("List of moods with their intensities"),
    suggestions: z
        .array(z.string())
        .describe("List of practical suggestions to improve mood"),
});

export type MoodAnalysis = z.infer<typeof MoodAnalysisSchema>;

export async function analyzeMoodPrompt(prompt: string): Promise<MoodAnalysis> {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

    if (!apiKey) {
        throw new Error("Google API key not found. Please set VITE_GOOGLE_API_KEY in your environment variables.");
    }

    const model = new ChatGoogleGenerativeAI({
        model: "gemini-2.0-flash-exp",
        apiKey,
        temperature: 0.7,
    });

    const structuredLlm = model.withStructuredOutput(MoodAnalysisSchema, {
        name: "mood_analysis",
    });

    try {
        const result = await structuredLlm.invoke(`
      Analyze the following text for emotional content and provide a structured analysis:

      "${prompt}"

      Please provide:
      1. A very concise title (4-5 words maximum) that captures the essence of the person's emotional state
      2. A brief description in second person (using "you") summarizing your overall mood and situation
      3. A list of specific moods detected with intensity levels (0-10)
      4. Practical, actionable suggestions to help improve their emotional well-being

      Focus on being empathetic, accurate, and helpful in your analysis.
    `);

        return result;
    } catch (error) {
        console.error("Error analyzing mood:", error);
        throw new Error("Failed to analyze mood. Please try again.");
    }
}