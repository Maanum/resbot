import { getDb } from "../config/initDB.js";

const JobDAO = {
  getJobs: async () => {
    const db = await getDb();
    return db.data.jobs;
  },

  getJobById: async (id) => {
    const db = await getDb();
    const index = db.data.jobs.findIndex((jobs) => jobs.id === id);
    if (index !== -1) {
      return db.data.jobs[index];
    } else {
      throw new Error(`Job with id ${id} not found`);
    }
  },

  updateJob: async (id, newJobData) => {
    try {
      const db = await getDb();
      const index = db.data.jobs.findIndex((job) => job.id === id);

      if (index !== -1) {
        db.data.jobs[index] = { ...db.data.jobs[index], ...newJobData };
        db.write();
        return db.data.jobs[index];
      } else {
        throw new Error(`Job with id ${id} not found`);
      }
    } catch (error) {
      throw error;
    }
  },

  createJob: async (job) => {
    try {
      const db = await getDb();
      db.data.jobs.push(job);
      db.write();
      return job;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};

export { JobDAO };
