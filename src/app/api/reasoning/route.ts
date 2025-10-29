import { convertToModelMessages, streamText, UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const results = streamText({
      //recommend to use gpt-5-mini for reasoning
      model: openai("gpt-4.1-mini"),
      messages: convertToModelMessages(messages),
      providerOptions: {
        openai: {
          reasoningSummary: "auto", //tells the model to generate a summary of its reasoning process
          reasoningEffort: "low",
        },
      },
    });

    return results.toUIMessageStreamResponse({ sendReasoning: true });
  } catch (err) {
    console.error("Error streaming chat completion", err);
    return Response.json(
      { error: "Failed to stream chat completion" },
      { status: 500 },
    );
  }
}
