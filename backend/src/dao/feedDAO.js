import { getDb } from "../config/initDB.js";
import { v4 as uuidv4 } from "uuid";
import { getFavicon } from "../utils/dataRetrieval.js";

const FeedDAO = {
  getFeeds: async () => {
    const db = await getDb();
    return db.data.feeds;
  },

  getFeedById: async (id) => {
    const db = await getDb();
    const index = db.data.feeds.findIndex((feed) => feed.id === id);
    if (index !== -1) {
      return db.data.feeds[index];
    } else {
      throw new Error(`Feed with id ${id} not found`);
    }
  },

  createFeed: async (newFeedData) => {
    const db = await getDb();
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
    const db = await getDb();
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
    const db = await getDb();
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
    const db = await getDb();
    return db.data.feeds.map((feed) => feed.url);
  },
};

export { FeedDAO };
