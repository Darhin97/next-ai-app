import { openai as originalOpenAI } from "@ai-sdk/openai";
import {
  createProviderRegistry,
  customProvider,
  defaultSettingsMiddleware,
  wrapLanguageModel,
} from "ai";
import { anthropic } from "@ai-sdk/anthropic";

// can access openai with openai:fast
const customOpenAI = customProvider({
  languageModels: {
    fast: originalOpenAI("gpt-5-nano"),
    smart: originalOpenAI("gpt-5-mini"),
    slow: originalOpenAI("gpt-4.1-mini"),
    reasoning: wrapLanguageModel({
      model: originalOpenAI("gpt-4.1-nano"),
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openai: {
              reasoningSummary: "auto",
              reasoningEffort: "low",
            },
          },
        },
      }),
    }),
  },
  fallbackProvider: originalOpenAI,
});

// can access anthropic with anthropic:fast
const customAnthropic = customProvider({
  languageModels: {
    fast: anthropic("claude-3-5-sonnet-20240620"),
    smart: anthropic("claude-3-haiku-20240620"),
    slow: anthropic("claude-3-opus-20240229"),
  },
});

export const registry = createProviderRegistry({
  openai: customOpenAI,
  anthropic: customAnthropic,
});
