import express from "express";
import { Queue } from "bullmq";
import IORedis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

const emailQueue = new Queue("emailQueue", { connection });

app.post("/send/email", async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    if (!to || !subject) {
      return res.status(400).json({ error: "Missing 'to' or 'subject' field" });
    }

    await emailQueue.add("sendEmail", { to, subject, body });
    const queueLength = await emailQueue.getWaitingCount();

    res.status(200).json({
      message: `Email queued successfully for ${to}`,
      queueLength,
    });
  } catch (err) {
    console.error("Error enqueueing email:", err);
    res.status(500).json({ error: "Failed to queue email" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
