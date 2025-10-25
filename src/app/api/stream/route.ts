import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const result = streamText({
      model: openai("gpt-4.1-nano"),
      prompt: prompt,
    });

    result.usage.then((usage) => {
      console.log({
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
      });
    });

    // creates an http response that streams the data in the formate that the ui expects
    return result.toUIMessageStreamResponse();
  } catch (err) {
    console.error("Error generating text", err);
    return Response.json({ error: "Failed to generate text" }, { status: 500 });
  }
}
