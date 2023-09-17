// services/feedService.js
import { v4 as uuidv4 } from "uuid";
import { getFavicon } from "../utils/dataRetrieval.js";
import { FeedDAO } from "../dao/feedDAO.js";
import { feedSchema } from "common";

const DAO_ERROR = {
  error: {
    code: "DAO_ERROR",
    message: "An error occurred while processing the data.",
  },
};

const NOT_FOUND = {
  error: {
    code: "NOT_FOUND",
    message: "The requested resource was not found.",
  },
};

const getFeeds = async () => {
  try {
    const result = await FeedDAO.getFeeds();
    return { data: result };
  } catch (daoError) {
    return DAO_ERROR;
  }
};

const createFeed = async (newFeedData) => {
  const { error, value } = feedSchema.validate(newFeedData);

  if (error) {
    console.log(error);
    return {
      error: {
        code: "INVALID_DATA",
        message: error.details[0].message,
      },
    };
  }

  const feedIcon = await getFavicon(value.url);
  const feedFull = { ...value, id: uuidv4(), icon: feedIcon };
  try {
    const result = await FeedDAO.createFeed(feedFull);
    return { data: result };
  } catch (daoError) {
    console.log(daoError);
    return DAO_ERROR;
  }
};

const updateFeed = async (id, newFeedData) => {
  const { error, value } = feedSchema.validate(newFeedData);
  if (error) {
    return {
      error: {
        code: "INVALID_DATA",
        message: error.details[0].message,
      },
    };
  }

  try {
    await FeedDAO.getFeed(id);
    const result = await FeedDAO.updateFeed(id, value);
    return { data: result };
  } catch (error) {
    console.log(error);
    if (error.code === "NOT_FOUND") {
      return NOT_FOUND;
    }
    return DAO_ERROR;
  }
};

const getFeedUrls = async () => {
  const feeds = await FeedDAO.getFeeds();
  return feeds.map((feed) => feed.url);
};

const deleteFeed = async (feedId) => {
  try {
    await FeedDAO.deleteFeed(feedId);
    return;
  } catch (error) {
    console.log(error);
    if (error.code === "NOT_FOUND") {
      return NOT_FOUND;
    }
    return DAO_ERROR;
  }
};

export { getFeeds, getFeedUrls, createFeed, updateFeed, deleteFeed };
