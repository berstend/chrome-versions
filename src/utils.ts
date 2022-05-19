import * as fs from "fs/promises";
import * as path from "path";

export async function writeJSONFile(
  filePath: string,
  data: any,
  opts = { createFolder: true }
) {
  if (!data || !filePath) {
    return;
  }
  try {
    if (opts?.createFolder) {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
    }
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.warn(err);
    return false;
  }
}

export const getSimpleDate = (ts: any) => {
  const d = new Date(ts);
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
};
