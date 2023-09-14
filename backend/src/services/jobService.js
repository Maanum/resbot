import { CronJob } from "cron";
import cronstrue from "cronstrue";
import { sendDigestMessage } from "../utils/emailHelper.js";
import { retrieveNewArticles } from "./articleService.js";
import { JobDAO } from "../dao/jobDAO.js";
import { v4 as uuidv4 } from "uuid";

const jobFunctions = {
  SEND: sendDigestMessage,
  RETRIEVE: retrieveNewArticles,
};

const getJobs = async () => {
  const jobs = await JobDAO.getJobs();
  return jobs;
};

const updateJob = async (id, newJobData) => {
  if (
    !newJobData.hasOwnProperty("cronTime") ||
    !newJobData.hasOwnProperty("timezone") ||
    !newJobData.hasOwnProperty("type") ||
    !newJobData.hasOwnProperty("active")
  ) {
    throw new Error(`Invalid job data.`);
  }

  return await JobDAO.updateJob(id, newJobData);
};

const createJob = async (newJobData) => {
  console.log(`newJobData: ${JSON.stringify(newJobData)}`);
  try {
    if (
      !newJobData.hasOwnProperty("cronTime") ||
      !newJobData.hasOwnProperty("timezone") ||
      !newJobData.hasOwnProperty("type")
    ) {
      throw new Error(
        `Invalid job data. Expected "cronTime", "type" and "timezone" fields only.`
      );
    }
    const validJobTypes = Object.keys(jobFunctions);

    if (!validJobTypes.includes(newJobData.type)) {
      throw new Error(`Invalid Job Type must be in ${validJobTypes}.`);
    }
    if (!newJobData.hasOwnProperty("active")) {
      newJobData.active = true;
    }
    const jobFull = { ...newJobData, id: uuidv4() };

    return await JobDAO.createJob(jobFull);
  } catch (error) {
    console.log(error);
    throw error;
  }
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

export { initializeJobs, getJobs, createJob, updateJob };
