import { getDb } from "../config/initDB.js";

const findFeedIndexById = async (id) => {
  const db = await getDb();
  const index = db.data.feeds.findIndex((feed) => feed.id === id);

  if (index === -1) {
    throw {
      code: "NOT_FOUND",
      message: `Feed with id ${id} not found`,
    };
  }

  return { db, index };
};

const FeedDAO = {
  getFeeds: async () => {
    const db = await getDb();
    return db.data.feeds;
  },

  getFeed: async (id) => {
    try {
      const { db, index } = await findFeedIndexById(id);
      return db.data.feeds[index];
    } catch (error) {
      if (error.code === "NOT_FOUND") {
        throw error; // Rethrow the "NOT_FOUND" error
      }
      throw {
        code: "DAO_ERROR",
        message: "An error occurred in the DAO layer.",
        originalError: error,
      };
    }
  },

  createFeed: async (feed) => {
    const db = await getDb();
    db.data.feeds.push(feed);
    db.write();
    return feed;
  },

  updateFeed: async (id, newFeedData) => {
    try {
      const { db, index } = await findFeedIndexById(id);
      db.data.feeds[index] = { ...db.data.feeds[index], ...newFeedData };
      db.write();
      return db.data.feeds[index];
    } catch (error) {
      throw {
        code: "DAO_ERROR",
        message: "An error occurred in the DAO layer.",
        originalError: error,
      };
    }
  },

  deleteFeed: async (id) => {
    try {
      const { db, index } = await findFeedIndexById(id);
      db.data.feeds.splice(index, 1);
      db.write();
      return true;
    } catch (error) {
      if (error.code === "NOT_FOUND") {
        throw error; // Rethrow the "NOT_FOUND" error
      }
      throw {
        code: "DAO_ERROR",
        message: "An error occurred in the DAO layer.",
        originalError: error,
      };
    }
  },
};

export { FeedDAO };
