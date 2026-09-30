import { readFile, writeFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";

const source = await readFile(new URL("../frontend/kbc-mobile.ts", import.meta.url), "utf8");
const javascript = stripTypeScriptTypes(source, { mode: "strip" });
await writeFile(new URL("../frontend/kbc-mobile.js", import.meta.url), `// Generated from frontend/kbc-mobile.ts. Run: node scripts/build-frontend.mjs\n${javascript}`);
console.log("Built frontend/kbc-mobile.js from TypeScript.");
