# Email-Queue

A small Node.js example that demonstrates an email queue using two processes backed by Redis via BullMQ:

- `server.js` — HTTP API that accepts email requests and enqueues them
- `worker.js` — background worker that dequeues jobs and “sends” emails (placeholder)

## Goals / contract

- Input: JSON payloads representing an email (`{ to, subject, body }`) posted to the server
- Output: Worker processes jobs and logs delivery (replace with real send logic)
- Error modes: server validates input; worker logs failures (configure retries as needed)

## Prerequisites

- Node.js 18+ (npm included)
- Redis (local or remote) — required for BullMQ

## Setup

1) Install dependencies

```bash
npm install
```

2) Configure environment (dotenv is loaded automatically by the app). Create `.env` with:

```bash
REDIS_HOST=localhost
REDIS_PORT=6379
EMAILS_PER_MINUTE=10
PORT=3000
```

3) Start services (ensure Redis is running):

```bash
# Terminal 1 — API server
node server.js

# Terminal 2 — background worker
node worker.js
```

## HTTP API

- Endpoint: `POST /send/email`
- Body (JSON):

```json
{
  "to": "recipient@example.com",
  "subject": "Hello",
  "body": "This is a test"
}
```

Example:

```bash
curl -X POST http://localhost:3000/send/email \
  -H 'Content-Type: application/json' \
  -d '{"to":"recipient@example.com","subject":"Hello","body":"This is a test"}'
```

Example response (200):

```json
{
  "message": "Email queued successfully for recipient@example.com",
  "queueLength": 0
}
```

## Rate limiting

The worker uses BullMQ’s limiter to process up to `EMAILS_PER_MINUTE` jobs per minute (default 10). Adjust via the env var.

## File overview

- `server.js` — Express API that validates payloads and enqueues jobs in BullMQ
- `worker.js` — BullMQ worker that processes jobs and logs completion/failure
- `package.json` — project metadata and dependencies

Notes:
- This project already uses BullMQ with Redis. For durable retries/backoff, configure job `attempts`/`backoff` when adding jobs or use queue-level defaults.
- Replace the `sendEmail` placeholder in `worker.js` with real email-sending logic (e.g., an SMTP or Google API client).
