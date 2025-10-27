import { experimental_generateSpeech as generateSpeech } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    // Validate input
    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({ error: "Text is required and must be a string" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const { audio } = await generateSpeech({
      model: openai.speech("tts-1"),
      voice: "alloy", // Add a voice parameter (required by OpenAI)
      text: text,
    });

    // Check if audio data exists
    if (!audio) {
      return new Response(
        JSON.stringify({ error: "Failed to generate audio" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    // @ts-ignore
    return new Response(audio.uint8Array, {
      headers: {
        "Content-Type": audio.mediaType || "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("Error generating speech:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate speech",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
