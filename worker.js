import { Worker } from "bullmq";
import IORedis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

async function sendEmail({ to, subject, body }) {
  console.log(`Sending email to: ${to} | Subject: ${subject}`);
  await new Promise((r) => setTimeout(r, 500));
}

const worker = new Worker(
  "emailQueue",
  async (job) => {
    await sendEmail(job.data);
  },
  {
    connection,
    limiter: {
      max: parseInt(process.env.EMAILS_PER_MINUTE) || 10,
      duration: 60 * 1000,
    },
  }
);

worker.on("completed", (job) => console.log(`Job ${job.id} completed`));
worker.on("failed", (job, err) => console.error(`Job ${job.id} failed:`, err));
