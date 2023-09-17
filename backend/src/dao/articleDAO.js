import { getDb } from "../config/initDB.js";

const findArticleIndexById = async (articleOld) => {
  const db = await getDb();
  const index = db.data.articles.findIndex((article) => article === articleOld);

  if (index === -1) {
    throw {
      code: "NOT_FOUND",
      message: `Article with id ${id} not found`,
    };
  }

  return { db, index };
};

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
    try {
      const { db, index } = await findArticleIndexById(articleOld);
      db.data.articles[index] = { ...db.data.articles[index], ...articleNew };
      db.write();
      return db.data.articles[index];
    } catch (error) {
      throw {
        code: "DAO_ERROR",
        message: "An error occurred in the DAO layer.",
        originalError: error,
      };
    }
  },
};

export { ArticleDAO };
