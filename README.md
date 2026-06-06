# rag_playground

A small project to get familiar with RAG (Retrieval-Augmented Generation).

## Stack

- **[Chroma](https://www.trychroma.com/)** — vector database, running locally
- **[LlamaIndex](https://www.llamaindex.ai/)** — parses PDFs into text/chunks
- **[OpenRouter](https://openrouter.ai/)** — runs the embedding models and LLMs
- **[Bun](https://bun.sh/)** + TypeScript — runtime

## Getting started

```bash
bun install
bun run main.ts
```

Set the required API keys in a `.env` file (see `config.ts` for what's expected).
