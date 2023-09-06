import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, `db/${process.env.DB_NAME || "db.json"}`);
console.log(file);

const adapter = new JSONFile(file);
const defaultData = { articles: [], feeds: [] };
const db = new Low(adapter, defaultData);
await db.read();

const ArticleDAO = {
  // Utility function to get seen URLs
  getSeenArticleURLs: async () => {
    const seenUrls = new Set(
      db.data.articles.map((article) => article.articleUrl)
    );
    return seenUrls;
  },

  getUnsentArticles: () => {
    return db.data.articles.filter((article) => article.sentInDigest === false);
  },

  markArticleAsSent: (article) => {
    const index = db.data.articles.findIndex(
      (dbArticle) => dbArticle === article
    );
    if (index !== -1) {
      db.data.articles[index].sentInDigest = true;
      db.write();
    }
  },

  // Utility function to append seen URLs
  addArticles: async (newArticles) => {
    db.data.articles = [...db.data.articles, ...newArticles];
    db.write();
  },
};

const FeedDAO = {
  getFeeds: async () => {
    return db.data.feeds;
  },

  updateFeeds: async (newFeeds) => {
    db.data.feeds = newFeeds;
    db.write();
  },

  getFeedUrls: async () => {
    return db.data.feeds.map((feed) => feed.url);
  },
};

export { FeedDAO, ArticleDAO };
