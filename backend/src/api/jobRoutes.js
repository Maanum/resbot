import express from "express";
import { getJobs, updateJob, createJob } from "../services/jobService.js";

const router = express.Router();

// CRUD API Endpoints
router.get("/api/jobs", async (req, res) => {
  const serviceResponse = await getJobs();
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

router.put("/api/jobs/:id", async (req, res) => {
  const serviceResponse = await updateJob(req.params.id, req.body);

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

router.post("/api/jobs", async (req, res) => {
  const serviceResponse = await createJob(req.body);
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

export default router;
