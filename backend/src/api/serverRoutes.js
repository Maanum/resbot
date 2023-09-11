import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { FeedDAO } from "../dao/feedDAO.js";

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

// Update an existing article
app.put("/api/feeds/:id", async (req, res) => {
  try {
    const daoResponse = await FeedDAO.updateFeedById(req.params.id, req.body);

    // Successfully updated the feed.
    res.json({ data: daoResponse });
  } catch (error) {
    // Based on the error message, determine the error code.
    if (error.message.includes("not found")) {
      res.status(404).send({
        error: { message: error.message },
      });
    } else if (error.message.includes("Invalid feed data")) {
      res.status(400).send({
        error: { message: error.message },
      });
    } else {
      // For other unexpected errors.
      res.status(500).send({ error: { message: "Server error" } });
    }
  }
});

app.post("/api/feeds", async (req, res) => {
  try {
    const daoResponse = await FeedDAO.createFeed(req.body);
    res.status(201).json({ data: daoResponse });
  } catch (error) {
    // Based on the error message, determine the error code.
    if (error.message.includes("Invalid feed data")) {
      res.status(400).send({
        error: { message: error.message },
      });
    } else {
      // For other unexpected errors.
      res.status(500).send({ error: { message: "Server error" } });
    }
  }
});

app.delete("/api/feeds/:id", async (req, res) => {
  try {
    await FeedDAO.deleteFeedById(req.params.id);
    res.status(204).send();
  } catch (error) {
    // Based on the error message, determine the error code.
    if (error.message.includes("not found")) {
      res.status(404).send({
        error: { message: error.message },
      });
    } else {
      // For other unexpected errors.
      res.status(500).send({ error: { message: "Server error" } });
    }
  }
});

export default app;
