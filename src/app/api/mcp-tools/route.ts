import {
  convertToModelMessages,
  streamText,
  UIMessage,
  InferUITools,
  UIDataTypes,
  tool,
  stepCountIs,
  experimental_createMCPClient as createMCPClient,
} from "ai";
import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

//special fxn given to an ai to address its limitation of its training data
const tools = {
  getWeather: tool({
    description: "Get the weather for a location",
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

const mcpUrl = "https://app.mockmcp.com/servers/x4j52Hx3LP6Z/mcp";

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    const httpTransport = new StreamableHTTPClientTransport(new URL(mcpUrl), {
      requestInit: {
        headers: { Authorization: `Bearer ${process.env.MCP_API_KEY}` },
      },
    });

    const mcpClient = await createMCPClient({
      transport: httpTransport,
    });

    const mcpTools = await mcpClient.tools();

    const results = streamText({
      // recommend to use gpt-5-mini for tools
      model: openai("gpt-4.1-nano"),
      messages: convertToModelMessages(messages),
      tools: {
        ...mcpTools,
        ...tools,
      },
      stopWhen: stepCountIs(2),
      onFinish: async () => {
        await mcpClient.close();
      },
      onError: async (error) => {
        await mcpClient.close();
        console.error("Error streaming chat completion", error);
      },
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
