/*
Paste the SEND function into the custom JavaScript area of the BotRix
subscription alert, then call it when the alert fires.

You MUST replace:
  WORKER_URL
  WEBHOOK_SECRET
  CHANNEL

The exact BotRix event variable names can differ. Use the alert's documented
amount variable where indicated below.
*/

const WORKER_URL = "https://YOUR-WORKER.YOUR-SUBDOMAIN.workers.dev";
const WEBHOOK_SECRET = "REPLACE_WITH_A_LONG_RANDOM_SECRET";
const CHANNEL = "ledyym";

async function sendSubscriberEvent(amount = 1) {
  const safeAmount = Math.max(1, Number.parseInt(amount, 10) || 1);

  try {
    const response = await fetch(`${WORKER_URL}/event`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": WEBHOOK_SECRET
      },
      body: JSON.stringify({
        channel: CHANNEL,
        amount: safeAmount
      })
    });

    if (!response.ok) {
      throw new Error(`Webhook failed with HTTP ${response.status}`);
    }

    console.log("Subscriber count updated", await response.json());
  } catch (error) {
    console.error("Subscriber webhook error", error);
  }
}

/*
Examples:

Regular subscription:
sendSubscriberEvent(1);

Five gifted subscriptions:
sendSubscriberEvent(5);

Replace the number with BotRix's actual event amount variable after confirming
the variable name in its alert editor.
*/
