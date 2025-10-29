import { convertToModelMessages, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { MyUIMessage } from "@/app/api/message-metadata/types";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: MyUIMessage[] } = await req.json();

    const results = streamText({
      model: openai("gpt-4.1-mini-2025-04-14"),
      messages: convertToModelMessages(messages),
    });

    return results.toUIMessageStreamResponse({
      messageMetadata: ({ part }) => {
        if (part.type === "start") {
          return {
            createdAt: Date.now(),
          };
        }
        if (part.type === "finish") {
          console.log("part.totalUsage", part.totalUsage);
          return {
            totalTokens: part.totalUsage.totalTokens,
          };
        }
      },
    });
  } catch (err) {
    console.error("Error streaming chat completion", err);
    return Response.json(
      { error: "Failed to stream chat completion" },
      { status: 500 },
    );
  }
}
