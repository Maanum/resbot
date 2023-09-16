import { getDb } from "../config/initDB.js";

const findJobIndexById = async (id) => {
  const db = await getDb();
  const index = db.data.jobs.findIndex((job) => job.id === id);

  if (index === -1) {
    throw {
      code: "NOT_FOUND",
      message: `Job with id ${id} not found`,
    };
  }

  return { db, index };
};

const JobDAO = {
  getJobs: async () => {
    const db = await getDb();
    return db.data.jobs;
  },

  getJobById: async (id) => {
    try {
      const { db, index } = await findJobIndexById(id);
      return db.data.jobs[index];
    } catch (error) {
      if (error.code === "NOT_FOUND") {
        throw error; // Rethrow the "NOT_FOUND" error
      }
      throw {
        code: "DAO_ERROR",
        message: "An error occurred in the DAO layer.",
        originalError: error,
      };
    }
  },

  updateJob: async (id, newJobData) => {
    try {
      const { db, index } = await findJobIndexById(id);
      db.data.jobs[index] = { ...db.data.jobs[index], ...newJobData };
      db.write();
      return db.data.jobs[index];
    } catch (error) {
      throw {
        code: "DAO_ERROR",
        message: "An error occurred in the DAO layer.",
        originalError: error,
      };
    }
  },

  createJob: async (job) => {
    try {
      const db = await getDb();
      db.data.jobs.push(job);
      db.write();
      return job;
    } catch (error) {
      throw {
        code: "DAO_ERROR",
        message: "An error occurred in the DAO layer.",
        originalError: error,
      };
    }
  },
};

export { JobDAO };
