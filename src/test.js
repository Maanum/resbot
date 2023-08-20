import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "/db/db.json");

const adapter = new JSONFile(file);
const defaultData = [];
const db = new Low(adapter, defaultData);

// await db.read();
// db.data = [{ this: "firstarticle" }];
// await db.write();
// console.log(db.data);

export { db };
