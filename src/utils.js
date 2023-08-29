import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, process.env.DB_FILE || "db.json");

const adapter = new JSONFile(file);
const defaultData = { articles: [], feeds: [] };
const db = new Low(adapter, defaultData);
await db.read();

const getFeedUrls = async () => {
  return db.data.feeds.map((feed) => feed.url);
};

// Utility function to get seen URLs
const getSeenArticleURLs = async () => {
  const seenUrls = new Set(
    db.data.articles.map((article) => article.articleUrl)
  );
  return seenUrls;
};

const getUnsentArticles = () => {
  return db.data.articles.filter((article) => article.sentInDigest === false);
};

const markArticleAsSent = (article) => {
  const index = db.data.articles.findIndex(
    (dbArticle) => dbArticle === article
  );
  if (index !== -1) {
    db.data.articles[index].sentInDigest = true;
    db.write();
  }
};

// Utility function to append seen URLs
const addArticles = async (newArticles) => {
  db.data.articles = [...db.data.articles, ...newArticles];
  db.write();
};

export {
  getFeedUrls,
  getSeenArticleURLs,
  addArticles,
  getUnsentArticles,
  markArticleAsSent,
};
