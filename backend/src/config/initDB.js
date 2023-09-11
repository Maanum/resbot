import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, `db/${process.env.DB_NAME || "db.json"}`);

const adapter = new JSONFile(file);
const defaultData = { articles: [], feeds: [] };

// Initialize the database
const initDB = async () => {
  const db = new Low(adapter, defaultData);
  await db.read();
};

export { initDB };
