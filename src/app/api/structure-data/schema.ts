import { z } from "zod";

export const recipeSchema = z.object({
  recipe: z.object({
    name: z.string(),
    ingredients: z.array(
      z.object({
        name: z.string(),
        quantity: z.string(),
      }),
    ),
    instructions: z.array(z.string()),
  }),
});
