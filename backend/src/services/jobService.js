import { CronJob } from "cron";
import cronstrue from "cronstrue";
import { sendDigestMessage } from "../utils/emailHelper.js";
import { retrieveNewArticles } from "./articleService.js";
import { JobDAO } from "../dao/jobDAO.js";

const jobFunctions = {
  SEND: sendDigestMessage,
  RETRIEVE: retrieveNewArticles,
};

const handleJob = async (job) => {
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
    handleJob(job);
  });
};

export default { initializeJobs };
