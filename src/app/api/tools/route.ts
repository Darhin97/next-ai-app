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

// tool with actual weather api
// Use a real weather API (OpenWeatherMap is a popular free option)
// const tools = {
//   getWeather: tool({
//     description: "Get the current weather for a location",
//     inputSchema: z.object({
//       city: z.string().describe("The city to get the weather for"),
//       country: z.string().optional().describe("The country code (e.g., US, UK)"),
//     }),
//     execute: async ({ city, country }) => {
//       try {
//         // You'll need to sign up for a free API key at openweathermap.org
//         const apiKey = process.env.OPENWEATHER_API_KEY;
//
//         if (!apiKey) {
//           return "Weather API key not configured";
//         }
//
//         const location = country ? `${city},${country}` : city;
//         const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${apiKey}&units=imperial`;
//
//         const response = await fetch(url);
//
//         if (!response.ok) {
//           return `Unable to fetch weather for ${city}`;
//         }
//
//         const data = await response.json();
//
//         const temp = Math.round(data.main.temp);
//         const description = data.weather[0].description;
//         const humidity = data.main.humidity;
//         const feelsLike = Math.round(data.main.feels_like);
//
//         return `${temp}°F and ${description}. Feels like ${feelsLike}°F with ${humidity}% humidity.`;
//       } catch (error) {
//         console.error("Weather API error:", error);
//         return `Unable to fetch weather data for ${city}`;
//       }
//     },
//   }),
// };

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
