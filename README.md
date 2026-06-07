# rag_playground

A TUI tool to experiment with RAG (Retrieval-Augmented Generation).

Connect to LlamaCloud to parse your files, vectorize them in chunks, and query
your documents from a local Chroma instance — all from the terminal.

## Stack

- **[Ink](https://github.com/vadimdemedes/ink)** — React-based terminal UI
- **[Chroma](https://www.trychroma.com/)** — vector database, running locally
- **[LlamaCloud](https://www.llamaindex.ai/)** — parses files into text/chunks
- **[OpenRouter](https://openrouter.ai/)** — runs the embedding models and LLMs
- **[Bun](https://bun.sh/)** + TypeScript — runtime

## Getting started

```bash
bun install
bun run main.tsx
```

Set the required environment variables in a `.env` file (see `config.ts` for
what's expected).
