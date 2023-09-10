import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { v4 as uuidv4 } from "uuid";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { getFavicon } from "./dataRetrieval.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, `db/${process.env.DB_NAME || "db.json"}`);

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

  getFeedById: async (id) => {
    const index = db.data.feeds.findIndex((feed) => feed.id === id);
    if (index !== -1) {
      return db.data.feeds[index];
    } else {
      throw new Error(`Feed with id ${id} not found`);
    }
  },

  createFeed: async (newFeedData) => {
    const keys = Object.keys(newFeedData);
    if (keys.length !== 2 || !newFeedData.name || !newFeedData.url) {
      throw new Error(
        `Invalid feed data. Expected only "name" and "url" fields.`
      );
    }
    const feedIcon = await getFavicon(newFeedData.url);
    const feedFull = { ...newFeedData, id: uuidv4(), icon: feedIcon };

    db.data.feeds.push(feedFull);
    db.write();
    return feedFull;
  },

  updateFeedById: async (id, newFeedData) => {
    const index = db.data.feeds.findIndex((feed) => feed.id === id);
    const keys = Object.keys(newFeedData);
    if (keys.length !== 2 || !newFeedData.name || !newFeedData.url) {
      throw new Error(
        `Invalid feed data. Expected only "name" and "url" fields.`
      );
    }

    if (index !== -1) {
      db.data.feeds[index] = { ...db.data.feeds[index], ...newFeedData };
      db.write();
      return db.data.feeds[index];
    } else {
      throw new Error(`Feed with id ${id} not found`);
    }
  },

  deleteFeedById: async (id) => {
    const index = db.data.feeds.findIndex((feed) => feed.id === id);
    if (index !== -1) {
      const deletedFeed = db.data.feeds[index];
      db.data.feeds.splice(index, 1);
      db.write();
      return deletedFeed;
    } else {
      throw new Error(`Feed with id ${id} not found`);
    }
  },

  getFeedUrls: async () => {
    return db.data.feeds.map((feed) => feed.url);
  },
};

export { FeedDAO, ArticleDAO };
