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
  const serviceResponse = await getFeeds();
  if (serviceResponse.error) {
    switch (serviceResponse.error.code) {
      case "DAO_ERROR":
        return res.status(500).send({ error: { message: "Server error" } });
      default:
        return res.status(500).send({ error: { message: "Unknown error" } });
    }
  }

  return res.status(200).json({ data: serviceResponse.data });
});

router.put("/api/feeds/:id", async (req, res) => {
  const serviceResponse = await updateFeed(req.params.id, req.body);

  if (serviceResponse.error) {
    switch (serviceResponse.error.code) {
      case "INVALID_DATA":
      case "INVALID_TYPE":
        return res.status(400).send({ error: serviceResponse.error });
      case "NOT_FOUND":
        return res.status(404).send({ error: serviceResponse.error });
      case "DAO_ERROR":
        return res.status(500).send({ error: { message: "Server error" } });
      default:
        return res.status(500).send({ error: { message: "Unknown error" } });
    }
  }
  return res.status(200).json({ data: serviceResponse.data });
});

router.post("/api/feeds", async (req, res) => {
  const serviceResponse = await createFeed(req.body);
  if (serviceResponse.error) {
    switch (serviceResponse.error.code) {
      case "INVALID_DATA":
      case "INVALID_TYPE":
        return res.status(400).send({ error: serviceResponse.error });
      case "DAO_ERROR":
        return res.status(500).send({ error: { message: "Server error" } });
      default:
        return res.status(500).send({ error: { message: "Unknown error" } });
    }
  }
  return res.status(201).json({ data: serviceResponse.data });
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
