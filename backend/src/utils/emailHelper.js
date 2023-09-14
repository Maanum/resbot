import nodemailer from "nodemailer";
import {
  getUnsentArticles,
  markArticleAsSent,
} from "../services/articleService.js";

const createNotificationBodyText = async (articles) => {
  if (!Array.isArray(articles)) {
    throw new Error("Expected an array of data entries.");
  }

  let htmlOutput = "<h1>📚ResBot</h1><hr>";

  articles.forEach((article) => {
    if (
      !article.articleTitle ||
      !article.articleAnalysis ||
      !article.articleUrl
    ) {
      throw new Error("Invalid JSON structure in one or more entries.");
    }

    if (article.articleAnalysis === "NOT APPLICABLE") {
      return;
    }

    htmlOutput += `
        <div style="margin-bottom: 20px;">
            <h2>${article.articleTitle}</h2>
            <a href="${
              article.articleUrl
            }" style="color: blue; text-decoration: underline;">${
      article.articleUrl
    }</a>
            <h3>Summary</h3>
            <p>${article.articleFeedSummary.split("\n").join("<br>")}</p>
            <h3>Analysis</h3>
            <p>${article.articleAnalysis.split("\n").join("<br>")}</p>
            <hr>
        </div>
    `;
  });

  return htmlOutput;
};

const sendDigestMessage = async () => {
  const articles = await getUnsentArticles();
  if (articles.length === 0) {
    console.log("Email: No new articles to send.");
    return;
  }
  const emailBody = await createNotificationBodyText(articles);

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Set email data
  let mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: process.env.EMAIL_ADDRESS,
    subject: "Resbot News Digest",
    html: emailBody,
  };

  // Send the email
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log(`Email: Successfully Sent: ${info.response}`);
    articles.forEach((article) => {
      markArticleAsSent(article);
    });
  } catch (error) {
    console.error(`Email: Error occurred: ${error.message}`);
  }
};

export { sendDigestMessage };
