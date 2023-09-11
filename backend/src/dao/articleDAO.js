import { getDb } from "../config/initDB.js";

const ArticleDAO = {
  getArticles: async () => {
    const db = await getDb();
    return db.data.articles;
  },

  createArticles: async (newArticles) => {
    const db = await getDb();
    db.data.articles = [...db.data.articles, ...newArticles];
    db.write();
  },

  updateArticle: async (articleOld, articleNew) => {
    const db = await getDb();
    const index = db.data.articles.findIndex(
      (dbArticle) => dbArticle === articleOld
    );
    if (index !== -1) {
      db.data.articles[index] = articleNew;
      db.write();
    }
  },
};

export { ArticleDAO };
