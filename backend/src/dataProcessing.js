import { URL } from "url";
import { ArticleDAO } from "./utils.js";
import moment from "moment";

const processRSSEntryData = async (rssFeeds) => {
  console.log("Cleaning RSS data...");
  const articles = [];
  for (const rssFeed of rssFeeds) {
    if (rssFeed.feed && rssFeed.feed.entry) {
      for (const articleEntry of rssFeed.feed.entry) {
        let articleUrl = articleEntry.link[0].$.href;
        if (articleUrl.includes("&url=")) {
          const articleUrlObject = new URL(articleUrl);
          articleUrl = articleUrlObject.searchParams.get("url");
        }
        try {
          articles.push({
            feedTitle: rssFeed.feed.title[0],
            feedUrl: rssFeed.feed.link[0].$.href,
            articleUrl,
            articleText: "",
            articleFeedSummary: articleEntry.content[0]._,
            articleTitle: articleEntry.title[0]._,
            articleAnalysis: "",
            articleUpdatedDate: moment(articleEntry.updated[0]).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            sentInDigest: false,
          });
        } catch (error) {
          console.log(error);
          console.log(articleEntry);
        }
      }
    } else if (
      rssFeed.rss &&
      rssFeed.rss.channel &&
      rssFeed.rss.channel[0] &&
      rssFeed.rss.channel[0].item
    ) {
      for (const articleEntry of rssFeed.rss.channel[0].item) {
        try {
          articles.push({
            feedTitle: rssFeed.rss.channel[0].title[0],
            feedUrl: rssFeed.rss.channel[0]["atom:link"][0].$.href,
            articleUrl: articleEntry.link[0],
            articleText: "",
            articleFeedSummary: articleEntry.description[0],
            articleTitle: articleEntry.title[0],
            articleAnalysis: "",
            articleUpdatedDate: moment(articleEntry.pubDate[0]).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            sentInDigest: false,
          });
        } catch (error) {
          console.log(`Error in processing article: ${error}\n`);
        }
      }
    }
  }

  return articles;
};

const filterOutKnownArticles = async (articles) => {
  const seenUrls = await ArticleDAO.getSeenArticleURLs();
  return articles.filter((article) => {
    return !seenUrls.has(article.articleUrl);
  });
};

export { filterOutKnownArticles, processRSSEntryData };
