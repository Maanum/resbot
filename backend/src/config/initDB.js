import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(
  __dirname,
  `../../data/${process.env.DB_NAME || "../../data/db.json"}`
);

const adapter = new JSONFile(file);
const defaultData = { articles: [], feeds: [] };
let db;

const getDb = async () => {
  if (!db) {
    db = new Low(adapter, defaultData);
    await db.read();
  }
  return db;
};

export { getDb };
