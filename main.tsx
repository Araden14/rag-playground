import { appContext } from "./config";
import type { AppContext } from "./config";
import { mkdir } from "fs/promises";
import React, { useEffect, useState } from "react";
import { TUI } from "./TUI/main";
import { render } from "ink";
import { InitializeChroma } from "./chroma";
import type { LogEvent } from "pino";

async function initializeDirs(ctx: AppContext) {
  const dirs = ctx.DATA_DIRS;
  await mkdir(dirs.original_documents, { recursive: true });
  await mkdir(dirs.parsed_documents, { recursive: true });
}

function App() {
  const [stdout, setStdout] = useState<LogEvent[]>([]);

  appContext.events.on("log", (e: LogEvent) => {
    setStdout((prev) => [prev, e]);
  });

  useEffect(() => {
    InitializeChroma(appContext);
  }, []);
  return <TUI ctx={appContext} stdout={stdout} />;
}

function main() {
  return <App />;
}

const { waitUntilExit } = render(React.createElement(main));
await waitUntilExit();
