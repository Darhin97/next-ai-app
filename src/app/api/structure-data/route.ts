import { streamObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { recipeSchema } from "@/app/api/structure-data/schema";

export async function POST(requets: Request) {
  try {
    const { dish } = await requets.json();

    const results = streamObject({
      model: openai("gpt-4.1-nano"),
      schema: recipeSchema,
      prompt: `Generate a recipe for ${dish}`,
    });

    return results.toTextStreamResponse();
  } catch (err) {
    console.error("Error generating recipe", err);
    return Response.json(
      { error: "Failed to generate recipe" },
      { status: 500 },
    );
  }
}
