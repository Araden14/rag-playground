import { InitializeChroma } from "./chroma";
import { appContext } from "./config";
import { CompareFiles, InitializeLlamaCloud } from "./llamacloud";

async function main() {
  try {
    await InitializeChroma(appContext);
    const files = await InitializeLlamaCloud(appContext);
    await CompareFiles(files, appContext);
  } catch (e) {
    console.error(e);
  }
}

await main();
