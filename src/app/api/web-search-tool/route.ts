import {
  convertToModelMessages,
  streamText,
  UIMessage,
  InferUITools,
  UIDataTypes,
  stepCountIs,
} from "ai";
import { openai } from "@ai-sdk/openai";
// import { anthropic } from "@ai-sdk/anthropic";

//special fxn given to an ai to address its limitation of its training data
const tools = {
  web_search_preview: openai.tools.webSearch({}),

  // anthropic
  // web_search: anthropic.tools.webSearch_20250305({
  //   maxUses: 1,
  // }),
};

export type WebSearchSource = {
  title: string;
  url: string;
  snippet: string;
};

export type WebSearchResult = {
  sources?: WebSearchSource[];
  query?: string;
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    const results = streamText({
      // recommend to use gpt-5-mini for tools
      model: openai.responses("gpt-4.1-mini"),
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
