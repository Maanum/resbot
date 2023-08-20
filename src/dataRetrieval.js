import axios from "axios";
import xml2js from "xml2js";
import { extract } from "@extractus/article-extractor";
import { stripHtml } from "string-strip-html";
import { CHATGPT_PROMPT_TEMPLATE } from "./config.js";
import { openai } from "./config.js";

// Function to fetch RSS data from provided feed URLs
const fetchRSSData = async (feedUrls) => {
  const allFeedData = [];

  for (const feed of feedUrls) {
    try {
      const response = await axios.get(feed);
      const result = await xml2js.parseStringPromise(response.data);
      allFeedData.push(result);
    } catch (error) {
      console.error(`Failed to fetch RSS data from ${feed}:`, error.message);
    }
  }

  return allFeedData;
};

const getArticleContent = async (articles) => {
  const articlesWithContent = [];

  for (const article of articles) {
    const articleExtractObject = await extract(article.articleUrl);
    const articleText = stripHtml(articleExtractObject.content).result;
    articlesWithContent.push({ ...article, articleText });
  }
  return articlesWithContent;
};

const getArticleAnalysis = async (articles) => {
  const articlesWithAnalysis = [];

  for (const article of articles) {
    try {
      const messages = [
        {
          role: "user",
          content: `
              ${CHATGPT_PROMPT_TEMPLATE}
              ---
              Article Title: ${article.articleTitle}
              Article Retrieved from: ${article.feedTitle}
              Article Content: ${article.articleText}
            `,
        },
      ];
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages,
      });

      const articleAnalysis = response.data["choices"][0]["message"]["content"];

      articlesWithAnalysis.push({ ...article, articleAnalysis });
    } catch (error) {
      console.error("Failed to clean article:", article.articleUrl);
    }
  }
  return articlesWithAnalysis;
};

export { fetchRSSData, getArticleContent, getArticleAnalysis };
