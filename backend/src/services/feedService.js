// services/feedService.js
import { v4 as uuidv4 } from "uuid";
import { getFavicon } from "../utils/dataRetrieval.js";
import { FeedDAO } from "../dao/feedDAO.js";

const getFeeds = async () => await FeedDAO.getFeeds();

const createFeed = async (newFeedData) => {
  const keys = Object.keys(newFeedData);
  if (keys.length !== 2 || !newFeedData.name || !newFeedData.url) {
    throw new Error(
      `Invalid feed data. Expected "name" and "url" fields only.`
    );
  }

  const feedIcon = await getFavicon(newFeedData.url);
  const feedFull = { ...newFeedData, id: uuidv4(), icon: feedIcon };

  return await FeedDAO.createFeed(feedFull);
};

const updateFeed = async (id, newFeedData) => {
  const keys = Object.keys(newFeedData);
  if (keys.length !== 2 || !newFeedData.name || !newFeedData.url) {
    throw new Error(
      `Invalid feed data. Expected only "name" and "url" fields.`
    );
  }

  return await FeedDAO.updateFeed(id, newFeedData);
};

const getFeedUrls = async () => {
  const feeds = await FeedDAO.getFeeds();
  return feeds.map((feed) => feed.url);
};

const deleteFeed = async (feedId) => {
  FeedDAO.deleteFeed(feedId);
  return;
};

export { getFeeds, getFeedUrls, createFeed, updateFeed, deleteFeed };
