# LEDYYM Webhook Subscriber Counter

This package contains:

- GitHub Pages widget
- Cloudflare Worker counter backend
- BotRix alert JavaScript template
- Manual count update commands

## 1. GitHub Pages

Upload these files to your GitHub repository:

- index.html
- style.css
- config.js
- script.js

Enable GitHub Pages from the main branch.

## 2. Cloudflare Worker

Create a Worker and paste in:

- cloudflare-worker.js

Create a KV namespace and bind it to the Worker as:

    SUB_COUNTS

Add a Worker secret named:

    WEBHOOK_SECRET

Use a long random value.

## 3. Configure the GitHub widget

Edit config.js:

    workerUrl: "https://your-worker.workers.dev"
    channel: "ledyym"

Set debug to false after testing.

## 4. Set the starting total

Run this command after replacing the URL and secret:

    curl -X POST "https://your-worker.workers.dev/set"       -H "Content-Type: application/json"       -H "X-Webhook-Secret: YOUR_SECRET"       -d '{"channel":"ledyym","count":8869}'

## 5. Connect BotRix

Open botrix-alert-script.js.

Replace:

- WORKER_URL
- WEBHOOK_SECRET
- CHANNEL

Paste the function into the BotRix custom alert JavaScript area.

Then call:

    sendSubscriberEvent(1)

for a normal subscription, or pass the gifted-sub amount.

The exact BotRix event amount variable still needs to be confirmed inside the
BotRix alert editor. Do not guess the variable name.

## OBS

Use your GitHub Pages URL as a Browser Source.

Recommended size:

- Width: 500
- Height: 200

## Manual tests

Read count:

    https://your-worker.workers.dev/count?channel=ledyym

Add one:

    curl -X POST "https://your-worker.workers.dev/event"       -H "Content-Type: application/json"       -H "X-Webhook-Secret: YOUR_SECRET"       -d '{"channel":"ledyym","amount":1}'
