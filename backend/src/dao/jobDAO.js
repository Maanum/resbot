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
};

export { JobDAO };
