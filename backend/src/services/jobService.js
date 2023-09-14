import { CronJob } from "cron";
import cronstrue from "cronstrue";
import { sendDigestMessage } from "../utils/emailHelper.js";
import { retrieveNewArticles } from "./articleService.js";
import { JobDAO } from "../dao/jobDAO.js";

const jobFunctions = {
  SEND: sendDigestMessage,
  RETRIEVE: retrieveNewArticles,
};

const getJobs = async () => {
  const jobs = await JobDAO.getJobs();
  return jobs;
};

const updateJob = async (id, newJobData) => {
  console.log(`newJobData: ${JSON.stringify(newJobData)}`);
  const keys = Object.keys(newJobData);
  if (
    !newJobData.hasOwnProperty("cronTime") ||
    !newJobData.hasOwnProperty("timezone") ||
    !newJobData.hasOwnProperty("type") ||
    !newJobData.hasOwnProperty("active")
  ) {
    console.log("whooops");
    throw new Error(`Invalid job data.`);
  }

  return await JobDAO.updateJob(id, newJobData);
};

const startJob = async (job) => {
  const cronJobObject = new CronJob(
    job.cronTime,
    jobFunctions[job.type],
    null,
    false,
    job.timezone
  );
  cronJobObject.start();
  console.log(
    `Job started! ${job.type}: ${cronstrue.toString(
      cronJobObject.cronTime.source
    )}`
  );
};

const initializeJobs = async () => {
  const jobList = await JobDAO.getJobs();
  jobList.forEach((job) => {
    startJob(job);
  });
};

export { initializeJobs, getJobs, updateJob };
