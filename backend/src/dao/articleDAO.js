import { getDb } from "../config/initDB.js";

const ArticleDAO = {
  // Utility function to get seen URLs
  getSeenArticleURLs: async () => {
    const db = await getDb();
    const seenUrls = new Set(
      db.data.articles.map((article) => article.articleUrl)
    );
    return seenUrls;
  },

  getUnsentArticles: async () => {
    const db = await getDb();
    return db.data.articles.filter((article) => article.sentInDigest === false);
  },

  markArticleAsSent: async (article) => {
    const db = await getDb();
    const index = db.data.articles.findIndex(
      (dbArticle) => dbArticle === article
    );
    if (index !== -1) {
      db.data.articles[index].sentInDigest = true;
      db.write();
    }
  },

  // Utility function to append seen URLs
  addArticles: async (newArticles) => {
    const db = await getDb();
    db.data.articles = [...db.data.articles, ...newArticles];
    db.write();
  },
};

export { ArticleDAO };
