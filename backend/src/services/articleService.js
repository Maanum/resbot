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
import { getFeedUrls } from "./feedService.js";
import { articleListSchema } from "common";

const retrieveNewArticles = async () => {
  const rssUrls = await getFeedUrls();
  const rssFeedData = await fetchRSSData(rssUrls);
  const articles = await processRSSEntryData(rssFeedData);
  const newArticles = await filterOutKnownArticles(articles);
  const articlesWithContent = await getArticleContent(newArticles);
  const fullArticles = await getArticleAnalysis(articlesWithContent);
  const { error, value } = articleListSchema.validate(fullArticles);
  if (error) {
    return {
      error: {
        code: "INVALID_DATA",
        message: error.details[0].message,
      },
    };
  }
  ArticleDAO.createArticles(value);
};

// Utility function to get seen URLs
const getSeenArticleURLs = async () => {
  const articles = await ArticleDAO.getArticles();
  const seenUrls = new Set(articles.map((article) => article.articleUrl));
  return seenUrls;
};

const getUnsentArticles = async () => {
  const articles = await ArticleDAO.getArticles();
  const unsentArticles = articles.filter((article) => !article.sentInDigest);
  return unsentArticles;
};

const markArticleAsSent = async (article) => {
  const articles = await ArticleDAO.getArticles();
  const index = articles.findIndex((dbArticle) => dbArticle === article);
  if (index !== -1) {
    const newArticle = { ...article, sentInDigest: true };
    ArticleDAO.updateArticle(article, newArticle);
  }
};

export {
  retrieveNewArticles,
  getSeenArticleURLs,
  getUnsentArticles,
  markArticleAsSent,
};
