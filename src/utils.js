import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "/db/db.json");

const adapter = new JSONFile(file);
const defaultData = [];
const db = new Low(adapter, defaultData);
await db.read();

// Utility function to get seen URLs
const getSeenArticleURLs = async () => {
  const seenUrls = new Set(db.data.map((art) => art.articleUrl));
  return seenUrls;
};

// Utility function to append seen URLs
const appendArticles = async (newArticles) => {
  db.data = [...db.data, ...newArticles];
  db.write();
  db.read();
};

export { db, getSeenArticleURLs, appendArticles };
