import express from "express";
import {
  getFeeds,
  updateFeed,
  createFeed,
  deleteFeed,
} from "../services/feedService.js";

const router = express.Router();

// CRUD API Endpoints
router.get("/api/feeds", async (req, res) => {
  const data = await getFeeds();
  res.json({ data });
});

// Update an existing article
router.put("/api/feeds/:id", async (req, res) => {
  try {
    const serviceResponse = await updateFeed(req.params.id, req.body);

    // Successfully updated the feed.
    res.json({ data: serviceResponse });
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

router.post("/api/feeds", async (req, res) => {
  try {
    const serviceResponse = await createFeed(req.body);
    res.status(201).json({ data: serviceResponse });
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

router.delete("/api/feeds/:id", async (req, res) => {
  try {
    await deleteFeed(req.params.id);
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

export default router;
