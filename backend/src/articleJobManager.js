import { CronJob } from "cron";

class ArticleJobManager {
  constructor() {
    this.jobs = {}; // Will store the running jobs, key is the unique ID and value is the CronJob instance
  }

  addJob(id, cronExpression, callback) {
    if (this.jobs[id]) {
      this.jobs[id].stop();
      delete this.jobs[id];
    }

    const job = new CronJob(cronExpression, callback, null, true);
    this.jobs[id] = job;
  }

  removeJob(id) {
    if (this.jobs[id]) {
      this.jobs[id].stop();
      delete this.jobs[id];
    }
  }

  updateJob(id, cronExpression, callback) {
    this.removeJob(id);
    this.addJob(id, cronExpression, callback);
  }
}

export default ArticleJobManager;
