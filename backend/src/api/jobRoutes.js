import express from "express";
import { getJobs, updateJob } from "../services/jobService.js";

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

export default router;
