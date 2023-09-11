import {
  fetchRSSData,
  getArticleContent,
  getArticleAnalysis,
} from "./utils/dataRetrieval.js";
import {
  filterOutKnownArticles,
  processRSSEntryData,
} from "./utils/rssProcessor.js";
import { sendDigestMessage } from "./notification.js";
import { ArticleDAO } from "./dao/articleDAO.js";
import { FeedDAO } from "./dao/feedDAO.js";
import { JobDAO } from "./dao/jobDAO.js";
import { initDB } from "./config/initDB.js";

import cronstrue from "cronstrue";
import app from "./api/serverRoutes.js";
import { CronJob } from "cron";

const port = process.env.PORT || 3001;

const retrieveNewArticles = async () => {
  console.log("Fetching new articles...");
  const rssUrls = await FeedDAO.getFeedUrls();
  const rssFeedData = await fetchRSSData(rssUrls);
  const articles = await processRSSEntryData(rssFeedData);
  const newArticles = await filterOutKnownArticles(articles);
  const articlesWithContent = await getArticleContent(newArticles);
  const fullArticles = await getArticleAnalysis(articlesWithContent);
  ArticleDAO.addArticles(fullArticles);
};

const jobFunctions = {
  SEND: sendDigestMessage,
  RETRIEVE: retrieveNewArticles,
};

const jobHandler = async (job) => {
  const cronJobObject = new CronJob(
    job.cronTime,
    jobFunctions[job.type],
    null,
    false,
    job.timezone
  );
  cronJobObject.start();
  console.log(
    `Job started! ${job.type}: ${cronstrue.toString(
      cronJobObject.cronTime.source
    )}`
  );
};

const main = async () => {
  const jobList = await JobDAO.getJobs();
  jobList.forEach((job) => {
    jobHandler(job);
  });
};

// main().catch((error) => {
//   console.error("An error occurred:", error);
// });

initDB()
  .then(() => {
    // Once the database is initialized, start the server
    const port = 3001;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize the database:", err);
  });

// sendDigestMessage();
// retrieveNewArticles();
