import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { existsSync, writeFileSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(
  __dirname,
  `./../../data/${process.env.DB_NAME || "./../../data/db.json"}`
);
if (!existsSync(file)) {
  throw new Error(`File ${file} not found`);
}

// check if file exists, if not create it
const defaultData = { articles: [], feeds: [], jobs: [] };

const adapter = new JSONFile(file);
let db;

const getDb = async () => {
  if (!db) {
    db = new Low(adapter, defaultData);
    await db.read();
  }
  return db;
};

export { getDb };
