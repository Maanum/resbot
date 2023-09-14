import express from "express";
import { getJobs, updateJob, createJob } from "../services/jobService.js";

const router = express.Router();

// CRUD API Endpoints
router.get("/api/jobs", async (req, res) => {
  const data = await getJobs();
  res.json({ data });
});

router.put("/api/jobs/:id", async (req, res) => {
  try {
    const serviceResponse = await updateJob(req.params.id, req.body);

    // Successfully updated the job.
    res.json({ data: serviceResponse });
  } catch (error) {
    // Based on the error message, determine the error code.
    if (error.message.includes("not found")) {
      res.status(404).send({
        error: { message: error.message },
      });
    } else if (error.message.includes("Invalid Job data")) {
      res.status(400).send({
        error: { message: error.message },
      });
    } else {
      // For other unexpected errors.
      res.status(500).send({ error: { message: "Server error" } });
    }
  }
});

router.post("/api/jobs", async (req, res) => {
  try {
    const serviceResponse = await createJob(req.body);
    res.status(201).json({ data: serviceResponse });
  } catch (error) {
    // Based on the error message, determine the error code.
    if (error.message.includes("Invalid job data")) {
      res.status(400).send({
        error: { message: error.message },
      });
    } else {
      // For other unexpected errors.
      res.status(500).send({ error: { message: "Server error" } });
    }
  }
});

export default router;
