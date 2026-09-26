import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

// Pass actual filenames to Node: shell glob quoting differs on Windows and CI.
const directory = resolve(process.argv[2] ?? ".test-build/tests");
const files = readdirSync(directory, { recursive: true, withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".test.js"))
  .map((entry) => resolve(entry.parentPath ?? entry.path, entry.name))
  .sort();
if (files.length === 0) {
  console.error(`No compiled tests found in ${directory}`);
  process.exit(1);
}
const result = spawnSync(process.execPath, ["--test", ...files], { stdio: "inherit" });
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
