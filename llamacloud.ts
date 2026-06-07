import type { AppContext } from "./config";
import { readdirSync } from "fs";

interface FileEntry {
  id: string;
  name: string;
  external_file_id: string;
  file_type: string;
  project_id: string;
  last_modified_at: string | null;
  expires_at: string | null;
  purpose: string;
  download_url: string | null;
}

export async function InitializeLlamaCloud(
  ctx: AppContext,
): Promise<FileEntry[]> {
  // get list of files
  const files = await ctx.llama.files.list();
  ctx.logger.info("LLAMA CLOUD \x1b[32mOK\x1b[0m ");
  ctx.logger.info(files.items.length + " file entries written to files.json");
  Bun.write("files.json", JSON.stringify(files.items, null, 2));
  return files.items.map((file) => ({
    id: file.id,
    name: file.name,
    external_file_id: file.external_file_id,
    file_type: file.file_type,
    project_id: file.project_id,
    last_modified_at: file.last_modified_at,
    expires_at: file.expires_at,
    purpose: file.purpose,
    download_url: file.download_url,
  }));
}

async function UploadtoCloud(file: File, ctx: AppContext) {
  const fileObj = await ctx.llama.files.create({
    file: file,
    purpose: "parse",
  });
  return fileObj;
}

async function ParseDocument(_file_id: string, ctx: AppContext) {
  const result = await ctx.llama.parsing.parse({
    file_id: _file_id,
    tier: "agentic",
    version: "latest",
    expand: ["markdown_full"],
  });
  return result;
}

export async function CompareFiles(files: FileEntry[], ctx: AppContext) {
  const dir = readdirSync(ctx.DATA_DIRS.original_documents);
  // dir.map((item) => {
  //   console.log(item);
  // });
}
