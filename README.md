# Email-Queue

A small Node.js example project that demonstrates a simple email queue pattern using two processes:

- `server.js` — API that accepts email requests and enqueues them
- `worker.js` — background worker that dequeues jobs and sends emails

## Goals / contract

- Input: JSON payloads representing an email ({ to, subject, text, html?, metadata? }) posted to the server
- Output: Worker delivers email via configured SMTP (or logs delivery if SMTP not configured)
- Error modes: the server should validate and reject bad requests; the worker should retry or log failures

## Prerequisites

- Node.js (21+ recommended)
- npm (comes with Node.js)

If the code uses a queue backend (Redis, for example) you'll need that too — check `server.js`/`worker.js` for any specific backend. If not present, the project may use an in-memory queue for demo purposes.

## Quick start (macOS / zsh)

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file (or export environment variables). Example `.env` values:

```bash
# server
REDIS_HOST=localhost
REDIS_PORT=6379
```

Load the `.env` values in your shell (if you use a tool like `dotenv`, the project may do this for you):

```bash
export $(cat .env | xargs)
```

3. Start the server (accepts enqueue requests):

```bash
node server.js
```

4. Start the worker (processes queued emails):

```bash
node worker.js
```

## Example: enqueue an email

Assuming the server exposes a POST /enqueue endpoint that accepts JSON, here's a curl example:

```bash
curl -X POST http://localhost:3000/enqueue \
	-H 'Content-Type: application/json' \
	-d '{ "to": "recipient@example.com", "subject": "Hello", "text": "This is a test" }'
```

Expected server response: a 200/201 with a job id or queued acknowledgement. The worker should pick up the job and either send the email or log the delivery result.

## File overview

- `server.js` — minimal HTTP API that validates email payloads and enqueues jobs
- `worker.js` — background process that waits for jobs, sends email via SMTP, and handles retries/errors
- `package.json` — project metadata and dependencies

If you want to adapt this project, consider replacing the queue implementation with Bull (Redis-backed) or Bee-Queue and add durable retries.
