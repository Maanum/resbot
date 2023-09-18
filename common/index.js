import Joi from "joi";
import moment from "moment-timezone";
import { CronTime } from "cron";

const cronValidator = (value, helpers) => {
  try {
    new CronTime(value);
    return value; // If no error is thrown, return the valid value
  } catch (error) {
    // return helpers.error("string.pattern.base", { value }); // If an error is thrown, return a Joi error
    return helpers.error("any.invalid");
  }
};
const LOCAL_JOB_FUNCTIONS = ["SEND", "RETRIEVE"];
const timezones = moment.tz.names();

const jobSchema = Joi.object({
  cronTime: Joi.string()
    .custom(cronValidator, "Cron Time Validation")
    .required(),
  timezone: Joi.string()
    .valid(...timezones)
    .required(),
  type: Joi.string()
    .valid(...LOCAL_JOB_FUNCTIONS)
    .required(),
  active: Joi.boolean().default(true),
});

const feedSchema = Joi.object({
  url: Joi.string().uri().required(),
  name: Joi.string().required(),
  icon: Joi.string().uri(),
});

const articleSchema = Joi.object({
  feedTitle: Joi.string().required(),
  feedUrl: Joi.string().uri().required(),
  articleUrl: Joi.string().uri().required(),
  articleText: Joi.string().required(),
  articleFeedSummary: Joi.string().required(),
  articleTitle: Joi.string().required(),
  articleAnalysis: Joi.string(),
  articleUpdatedDate: Joi.string().required(),
  sentInDigest: Joi.boolean().default(false),
});

const articleListSchema = Joi.array().items(articleSchema);

export { jobSchema, feedSchema, articleSchema, articleListSchema };
