import { experimental_transcribe as transcribe } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return Response.json(
        { error: "No audio file provided" },
        { status: 400 },
      );
    }

    // transcribe fxn need the audio file as uint8array
    const audioBuffer = await audioFile.arrayBuffer();
    const audioUint8Array = new Uint8Array(audioBuffer);

    const transcript = await transcribe({
      model: openai.transcription("whisper-1"),
      audio: audioUint8Array,
    });

    return Response.json(transcript);
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return Response.json(
      { error: "Failed to transcribe audio" },
      { status: 500 },
    );
  }
}
