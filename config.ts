import { config } from "dotenv";
import { LlamaCloud } from "@llamaindex/llama-cloud";
import { ChromaClient } from "chromadb";
import { OpenRouter } from "@openrouter/sdk";
import type { DestinationStream, Logger } from "pino";
import EventEmitter from "events";
import pino from "pino";
const dotenv = config();

const LLAMA_API_KEY = dotenv.parsed?.LLAMA_CLOUD_API_KEY;
const OPENROUTER_API_KEY = dotenv.parsed?.OPENROUTER_API_KEY;
const CHROMA_HOST = dotenv.parsed?.CHROMA_HOST;
const CHROMA_PORT = Number(dotenv.parsed?.CHROMA_PORT);
const EMBEDDING_MODEL = dotenv.parsed?.EMBEDDING_MODEL;
const LLAMA_CLOUD_ENDPOINT = dotenv.parsed?.LLAMA_CLOUD_ENDPOINT;

const DATA_DIRS = {
  original_documents: dotenv.parsed?.DATA_DIRS_ORIGINAL_DOCUMENTS,
  parsed_documents: dotenv.parsed?.DATA_DIRS_PARSED_DOCUMENTS,
};

const missing_variables = [
  !LLAMA_API_KEY && "LLAMA_API_KEY", // Llama Cloud API key
  !OPENROUTER_API_KEY && "OPENROUTER_API_KEY", // OpenRouter API key
  !CHROMA_HOST && "CHROMA_HOST", // Chroma host
  !CHROMA_PORT && "CHROMA_PORT", // Chroma port
  !EMBEDDING_MODEL && "EMBEDDING_MODEL", // Embedding model
  !LLAMA_CLOUD_ENDPOINT && "LLAMA_CLOUD_ENDPOINT", // Llama Cloud endpoint
  !DATA_DIRS.original_documents && "DATA_DIRS_ORIGINAL_DOCUMENTS", // Dir for original documents
  !DATA_DIRS.parsed_documents && "DATA_DIRS_PARSED_DOCUMENTS", // Dir for parsed documents
].filter(Boolean);

if (missing_variables.length > 0) {
  throw new Error(
    "Missing environment variables: " + missing_variables.join(", "),
  );
}
interface DataDirs {
  original_documents: string;
  parsed_documents: string;
}

/**
 * Shape of a single pino log record after `JSON.parse`-ing one NDJSON line.
 * Matches pino's default serializer output, e.g.
 *   {"level":30,"time":1531257112193,"msg":"hello world","pid":55956,"hostname":"x"}
 * `level` is numeric (30=info, 50=error) unless a `formatters.level` is set, and
 * `time` is epoch milliseconds. Extra merged fields land as arbitrary top-level keys.
 */
export interface PinoLogLine {
  level: number;
  time: number;
  msg?: string;
  pid?: number;
  hostname?: string;
  [key: string]: unknown;
}

const events = new EventEmitter();

// In-process destination stream: pino hands `write` one serialized NDJSON line
// (a string) per log call. We parse it back to a typed record and fan it out on
// the emitter so the Ink UI can subscribe and render.
const stream: DestinationStream = {
  write(line: string) {
    try {
      const log: PinoLogLine = JSON.parse(line);
      events.emit("log", log);
    } catch {
      // Not JSON (shouldn't happen without a transform) — forward the raw line.
      events.emit("log", line);
    }
  },
};

const logger = pino({}, stream);

export interface AppContext {
  DATA_DIRS: DataDirs;
  LLAMA_API_KEY: string;
  OPENROUTER_API_KEY: string;
  CHROMA_HOST: string;
  CHROMA_PORT: number;
  EMBEDDING_MODEL: string;
  llama: LlamaCloud;
  chroma: ChromaClient;
  openrouter: OpenRouter;
  logger: Logger;
  events: EventEmitter;
}

const appContext: AppContext = {
  DATA_DIRS,
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
  events,
};

export { appContext };
