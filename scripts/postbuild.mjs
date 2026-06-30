import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const source = resolve(root, "data", "app-data.js");
const target = resolve(root, "dist", "data", "app-data.js");

mkdirSync(dirname(target), { recursive: true });
copyFileSync(source, target);

console.log(`Copied ${source} -> ${target}`);
