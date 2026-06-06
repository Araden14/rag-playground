import { config } from "dotenv";
import { LlamaCloud } from "@llamaindex/llama-cloud";
import { ChromaClient } from "chromadb";
import { OpenRouter } from "@openrouter/sdk";
import type { Logger } from "pino";
import pino from "pino";
const dotenv = config();

const LLAMA_API_KEY = dotenv.parsed?.LLAMA_CLOUD_API_KEY;
const OPENROUTER_API_KEY = dotenv.parsed?.OPENROUTER_API_KEY;
const CHROMA_HOST = dotenv.parsed?.CHROMA_HOST;
const CHROMA_PORT = Number(dotenv.parsed?.CHROMA_PORT);
const EMBEDDING_MODEL = dotenv.parsed?.EMBEDDING_MODEL;

const missing_variables = [
  !LLAMA_API_KEY && "LLAMA_API_KEY",
  !OPENROUTER_API_KEY && "OPENROUTER_API_KEY",
  !CHROMA_HOST && "CHROMA_HOST",
  !CHROMA_PORT && "CHROMA_PORT",
  !EMBEDDING_MODEL && "EMBEDDING_MODEL",
].filter(Boolean);

if (missing_variables.length > 0) {
  throw new Error(
    "Missing environment variables: " + missing_variables.join(", "),
  );
}

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: { colorize: true },
  },
});

export interface AppContext {
  LLAMA_API_KEY: string;
  OPENROUTER_API_KEY: string;
  CHROMA_HOST: string;
  CHROMA_PORT: number;
  EMBEDDING_MODEL: string;
  llama: LlamaCloud;
  chroma: ChromaClient;
  openrouter: OpenRouter;
  logger: Logger;
}

const appContext: AppContext = {
  LLAMA_API_KEY,
  OPENROUTER_API_KEY,
  CHROMA_HOST,
  CHROMA_PORT,
  EMBEDDING_MODEL,
  llama: new LlamaCloud({
    baseURL: dotenv.parsed?.LLAMA_CLOUD_ENDPOINT,
    apiKey: dotenv.parsed?.LLAMA_CLOUD_API_KEY,
  }),
  chroma: new ChromaClient({
    host: CHROMA_HOST,
    port: CHROMA_PORT,
  }),
  openrouter: new OpenRouter({
    apiKey: dotenv.parsed?.OPENROUTER_API_KEY,
  }),
  logger,
};

export { appContext };
