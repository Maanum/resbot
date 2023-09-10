import { CronJob } from "cron";
import {
  fetchRSSData,
  getArticleContent,
  getArticleAnalysis,
} from "./dataRetrieval.js";
import {
  filterOutKnownArticles,
  processRSSEntryData,
} from "./dataProcessing.js";
import { sendDigestMessage } from "./notification.js";
import { ArticleDAO, FeedDAO } from "./utils.js";
import cronstrue from "cronstrue";
import app from "./api.js";

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

const jobRetrieveArticles = new CronJob(
  "0 */6 * * *",
  retrieveNewArticles,
  null,
  false,
  "America/North_Dakota/Center"
);

const jobSendDigest = new CronJob(
  "0 6 * * *",
  sendDigestMessage,
  null,
  false,
  "America/North_Dakota/Center"
);

async function main() {
  jobRetrieveArticles.start();
  jobSendDigest.start();
  console.log("RSS reader jobs started!");
  console.log(
    `Digest Sending: ${cronstrue.toString(jobSendDigest.cronTime.source)}`
  );
  console.log(
    `Fetching Articles: ${cronstrue.toString(
      jobRetrieveArticles.cronTime.source
    )}`
  );
}

// main().catch((error) => {
//   console.error("An error occurred:", error);
// });

// sendDigestMessage();
// retrieveNewArticles();

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
