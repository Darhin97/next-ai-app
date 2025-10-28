import {
  convertToModelMessages,
  streamText,
  UIMessage,
  InferUITools,
  UIDataTypes,
  tool,
  stepCountIs,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

//special fxn given to an ai to address its limitation of its training data
const tools = {
  getWeather: tool({
    description: "Get the weather fro a location",
    inputSchema: z.object({
      city: z.string().describe("The city to get the weather for"),
    }),
    execute: async ({ city }) => {
      if (city === "Gotham city ") {
        return "70F and cloudy";
      } else if (city === "Metropolis") {
        return "80F and sunny";
      } else {
        return "Unknown";
      }
    },
  }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    const results = streamText({
      // recommend to use gpt-5-mini for tools
      model: openai("gpt-4.1-nano"),
      messages: convertToModelMessages(messages),
      tools: tools,
      stopWhen: stepCountIs(2),
    });

    return results.toUIMessageStreamResponse();
  } catch (err) {
    console.error("Error streaming chat completion", err);
    return Response.json(
      { error: "Failed to stream chat completion" },
      { status: 500 },
    );
  }
}
