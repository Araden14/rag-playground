import { Box, Text } from "ink";
import { LogEvent } from "pino";
import React from "react";
export const LogBox = ({ logs }: { logs: LogEvent[] }) => {
  return (
    <Box borderStyle="round" width="50%" flexDirection="column">
      {logs.map((log) => {
        // turn this into a list
        return <Text key={log.time}>{JSON.stringify(log.msg)}</Text>;
      })}
    </Box>
  );
};
