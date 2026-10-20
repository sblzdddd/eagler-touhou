import { copyFile, mkdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { THSSS_MUSIC_FILES } from "../lib/thsss-content-layout.mjs";

function argument(name, fallback = "") {
  const inline = process.argv.find(value => value.startsWith(`${name}=`));
  if (inline) return inline.slice(name.length + 1);
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] ?? fallback : fallback;
}

const originalArgument = argument("--original");
if (!originalArgument) {
  throw new Error("Usage: node scripts/prepare-thsss-content.mjs --original=DIR --output=DIR");
}

const original = resolve(originalArgument);
const output = resolve(argument("--output", resolve("assets-thsss")));
await mkdir(join(output, "BGM"), { recursive: true });
await copyFile(join(original, "thsss.dat"), join(output, "thsss.dat"));
for (const name of THSSS_MUSIC_FILES) {
  await copyFile(join(original, "BGM", name), join(output, "BGM", name));
}
