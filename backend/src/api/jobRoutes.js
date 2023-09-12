import express from "express";
import { getJobs } from "../services/jobService.js";

const router = express.Router();

// CRUD API Endpoints
router.get("/api/jobs", async (req, res) => {
  const data = await getJobs();
  res.json({ data });
});

export default router;
