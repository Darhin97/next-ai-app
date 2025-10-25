import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    console.log(prompt);
    const { text } = await generateText({
      model: openai("gpt-4.1-nano"),
      prompt: prompt,
    });

    return Response.json({ text });
  } catch (err) {
    console.error("Error generating text", err);
    return Response.json({ error: "Failed to generate text" }, { status: 500 });
  }
}
