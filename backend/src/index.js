import express from "express";
import cors from "cors";
import { getDb } from "./config/initDB.js";
import feedRoutes from "./api/feedRoutes.js";
import jobService from "./services/jobService.js";
import { JobDAO } from "./dao/jobDAO.js";

const initializeApp = async () => {
  await getDb(); // Initialize the database
  await jobService.initializeJobs(JobDAO); // Initialize the Jobs

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(feedRoutes);

  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

initializeApp()
  .then(() => {
    console.log("Application started.");
  })
  .catch((err) => {
    console.error("Error during initialization:", err);
  });

// sendDigestMessage();
// retrieveNewArticles();
