import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { pokemonSchema } from "@/app/api/structured-array/scchema";

export async function POST(requets: Request) {
  try {
    const { type } = await requets.json();

    const results = streamObject({
      model: openai("gpt-4.1-nano"),
      output: "array",
      schema: pokemonSchema,
      prompt: `Generate a list of 5 ${type} type pokemon`,
    });

    return results.toTextStreamResponse();
  } catch (err) {
    console.error("Error generating Pokemon", err);
    return Response.json(
      { error: "Failed to generate Pokemon" },
      { status: 500 },
    );
  }
}
