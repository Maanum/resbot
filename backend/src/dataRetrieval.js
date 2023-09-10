import axios from "axios";
import xml2js from "xml2js";
import { extractFromHtml } from "@extractus/article-extractor";
import { stripHtml } from "string-strip-html";
import { openai, CHATGPT_PROMPT_TEMPLATE } from "./config.js";
import getFavicons from "get-website-favicon";

// Function to fetch RSS data from provided feed URLs
const fetchRSSData = async (feedUrls) => {
  const allFeedData = [];

  for (const feed of feedUrls) {
    console.log(`Fetching RSS data from ${feed}...`);
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
  console.log("Extracting article content...");
  const articlesWithContent = [];

  for (const article of articles) {
    let articleText = "";
    try {
      const response = await axios.get(article.articleUrl);
      const htmlContent = response.data;
      const articleExtractObject = await extractFromHtml(htmlContent);
      if (articleExtractObject) {
        articleText = stripHtml(articleExtractObject.content).result;
      }
    } catch (error) {
      console.error(
        `Failed to extract article content: ${article.articleUrl}\n${error.message}`
      );
    }

    articlesWithContent.push({ ...article, articleText });
  }
  return articlesWithContent;
};

const getArticleAnalysis = async (articles) => {
  const articlesWithAnalysis = [];
  console.log("Analyzing articles...");

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

const getFavicon = async (url) => {
  const parsedUrl = new URL(url);
  const coreURL = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
  const data = await getFavicons(coreURL);
  if (data && data.icons && data.icons.length > 0) {
    return data.icons[0].src;
  } else {
    return null;
  }
};

export { fetchRSSData, getArticleContent, getArticleAnalysis, getFavicon };
