import {
  fetchRSSData,
  getArticleContent,
  getArticleAnalysis,
} from "../utils/dataRetrieval.js";
import {
  filterOutKnownArticles,
  processRSSEntryData,
} from "../utils/rssProcessor.js";
import { ArticleDAO } from "../dao/articleDAO.js";
import { FeedDAO } from "../dao/feedDAO.js";

const retrieveNewArticles = async () => {
  const rssUrls = await FeedDAO.getFeedUrls();
  const rssFeedData = await fetchRSSData(rssUrls);
  const articles = await processRSSEntryData(rssFeedData);
  const newArticles = await filterOutKnownArticles(articles);
  const articlesWithContent = await getArticleContent(newArticles);
  const fullArticles = await getArticleAnalysis(articlesWithContent);
  ArticleDAO.addArticles(fullArticles);
};

export { retrieveNewArticles };
