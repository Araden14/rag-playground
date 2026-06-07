import React, { useState } from "react";
import { Box, Text, useApp, useInput, useWindowSize } from "ink";
import { type AppContext } from "../config";
import { LogBox } from "./logs";
import { LogEvent } from "pino";
export const TUI = ({
  ctx,
  stdout,
}: {
  ctx: AppContext;
  stdout: LogEvent[];
}) => {
  // useWindowSize gives terminal dimensions in *cells* and re-renders on resize.
  const { columns, rows } = useWindowSize();
  const { exit } = useApp();

  const [input, setInput] = useState("");

  // Root Box sized to the whole terminal = full screen.
  return (
    <Box flexDirection="column" width={columns} height={rows}>
      {/* Header */}
      <Box borderStyle="round" paddingX={1}>
        <Text bold color="cyan">
          RAG Playground
        </Text>
      </Box>

      {/* Body — flexGrow fills the remaining vertical space */}
      <Box flexGrow={1} flexDirection="row" paddingX={1} paddingY={1}>
        <LogBox logs={stdout} />
      </Box>
    </Box>
  );
};
