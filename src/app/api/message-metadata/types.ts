import { z } from "zod";
import { UIMessage } from "ai";

export const messageMetadataSchema = z.object({
  createdAt: z.number().optional(),
  totalTokens: z.number().optional(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;
export type MyUIMessage = UIMessage<MessageMetadata>;
