import { CronJob } from "cron";
import cronstrue from "cronstrue";
import { sendDigestMessage } from "../utils/emailHelper.js";
import { retrieveNewArticles } from "./articleService.js";
import { JobDAO } from "../dao/jobDAO.js";
import { v4 as uuidv4 } from "uuid";
import Joi from "joi";

const DAO_ERROR = {
  error: {
    code: "DAO_ERROR",
    message: "An error occurred while processing the data.",
  },
};

const NOT_FOUND = {
  error: {
    code: "NOT_FOUND",
    message: "The requested resource was not found.",
  },
};

const jobFunctions = {
  SEND: sendDigestMessage,
  RETRIEVE: retrieveNewArticles,
};

const jobSchema = Joi.object({
  cronTime: Joi.string().required(),
  timezone: Joi.string().required(),
  type: Joi.string()
    .valid(...Object.keys(jobFunctions))
    .required(),
  active: Joi.boolean().default(true),
});

const getJobs = async () => {
  try {
    const result = await JobDAO.getJobs();
    return { data: result };
  } catch (daoError) {
    return DAO_ERROR;
  }
};

const updateJob = async (id, newJobData) => {
  const { error, value } = jobSchema.validate(newJobData);
  if (error) {
    return {
      error: {
        code: "INVALID_DATA",
        message: error.details[0].message,
      },
    };
  }

  try {
    await JobDAO.getJobById(id);
    const result = await JobDAO.updateJob(id, value);
    return { data: result };
  } catch (error) {
    if (error.code === "NOT_FOUND") {
      return NOT_FOUND;
    }
    return DAO_ERROR;
  }
};

const createJob = async (newJobData) => {
  const { error, value } = jobSchema.validate(newJobData);

  if (error) {
    return {
      error: {
        code: "INVALID_DATA",
        message: error.details[0].message,
      },
    };
  }

  const jobFull = { ...value, id: uuidv4() };

  try {
    const result = await JobDAO.createJob(jobFull);
    return { data: result };
  } catch (daoError) {
    return DAO_ERROR;
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
