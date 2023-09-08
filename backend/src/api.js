import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ArticleDAO, FeedDAO } from "./utils.js";

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// CRUD API Endpoints

app.get("/api/feeds", async (req, res) => {
  const data = await FeedDAO.getFeeds();
  res.json({ data });
});

// // Read all articles
// app.get('/api/articles', (res) => {
//   res.json({ articles });
// });

// // Read a single article by ID
// app.get('/api/articles/:id', (req, res) => {
//   const article = articles.find(a => a.id === parseInt(req.params.id));
//   if (!article) return res.status(404).send('Article not found');
//   res.json({ article });
// });

// // Create a new article
// app.post('/api/articles', (req, res) => {
//   const newArticle = {
//     id: articles.length + 1,
//     title: req.body.title,
//     content: req.body.content,
//   };
//   articles.push(newArticle);
//   res.status(201).json({ article: newArticle });
// });

// // Update an existing article
// app.put('/api/articles/:id', (req, res) => {
//   const article = articles.find(a => a.id === parseInt(req.params.id));
//   if (!article) return res.status(404).send('Article not found');

//   article.title = req.body.title;
//   article.content = req.body.content;

//   res.json({ article });
// });

export default app;
