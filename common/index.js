import Joi from "joi";

const LOCAL_JOB_FUNCTIONS = ["SEND", "RETRIEVE"];

const jobSchema = Joi.object({
  cronTime: Joi.string().required(),
  timezone: Joi.string().required(),
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
