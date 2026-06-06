import { ChromaClient } from "chromadb";
import type { AppContext } from "./config";

export async function InitializeChroma(ctx: AppContext) {
  // timeout after 10 seconds
  const heartbeat = await Promise.race([
    ctx.chroma.heartbeat(),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Chroma not reachable")), 3000),
    ),
  ]);
  // add color to the ok in stdout
  ctx.logger.info("CHROMA \x1b[32mOK\x1b[0m ");
  const docs = await ctx.chroma
    .getOrCreateCollection({
      name: "docs",
    })
    .then(async (docs) => {
      ctx.logger.info("Collection docs exists");
      const peek = await docs.peek({ limit: 2 });
      ctx.logger.info("peek at docs: " + JSON.stringify(peek));
    });
}
