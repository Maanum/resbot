import { getDb } from "../config/initDB.js";
import { v4 as uuidv4 } from "uuid";
import { getFavicon } from "../utils/dataRetrieval.js";

const FeedDAO = {
  getFeeds: async () => {
    const db = await getDb();
    return db.data.feeds;
  },

  getFeed: async (id) => {
    const db = await getDb();
    const index = db.data.feeds.findIndex((feed) => feed.id === id);
    if (index !== -1) {
      return db.data.feeds[index];
    } else {
      throw new Error(`Feed with id ${id} not found`);
    }
  },

  createFeed: async (feed) => {
    const db = await getDb();
    db.data.feeds.push(feed);
    db.write();
    return feed;
  },

  updateFeed: async (id, newFeedData) => {
    const db = await getDb();
    const index = db.data.feeds.findIndex((feed) => feed.id === id);

    if (index !== -1) {
      db.data.feeds[index] = { ...db.data.feeds[index], ...newFeedData };
      db.write();
      return db.data.feeds[index];
    } else {
      throw new Error(`Feed with id ${id} not found`);
    }
  },

  deleteFeed: async (id) => {
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
};

export { FeedDAO };
