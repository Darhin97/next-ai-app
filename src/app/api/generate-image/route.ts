import { experimental_generateImage as generateImage } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const { image } = await generateImage({
      model: openai.imageModel("dall-e-3"),
      prompt: prompt,
      size: "1024x1024",
      providerOptions: {
        openai: {
          style: "vivid",
          quality: "hd",
        },
      },
    });

    return Response.json(image.base64);
  } catch (err) {
    console.error("Error generating image", err);
    return Response.json(
      { error: "Failed to generate image" },
      { status: 500 },
    );
  }
}
