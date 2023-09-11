const JobDAO = {
  getJobs: async () => {
    return db.data.jobs;
  },

  getJobById: async (id) => {
    const index = db.data.jobs.findIndex((jobs) => jobs.id === id);
    if (index !== -1) {
      return db.data.jobs[index];
    } else {
      throw new Error(`Job with id ${id} not found`);
    }
  },
};

export { JobDAO };
