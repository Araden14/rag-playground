import { OpenRouter } from "@openrouter/sdk";
import type { AppContext } from "./config";

async function vectorize(file: File, ctx: AppContext) {
  const embedding = ctx.openrouter.embeddings.generate({
    requestBody: {
      input: file.toString(),
      model: ctx.EMBEDDING_MODEL,
    },
  });
  return embedding;
}
