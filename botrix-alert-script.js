onst WORKER_URL =
  "https://polished-silence-32bf.forrest-inman89.workers.dev";

const WEBHOOK_SECRET = "LedyyM4133DarthDocc";
const CHANNEL = "ledyym";

async function sendSubscriberEvent(amount) {
  const safeAmount = Math.max(
    1,
    Math.min(500, Number.parseInt(amount, 10) || 1)
  );

  console.log("[SubCount] BotRix amount:", amount);
  console.log("[SubCount] Sending amount:", safeAmount);

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

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.error || `Webhook failed with HTTP ${response.status}`
      );
    }

    console.log("[SubCount] Counter updated:", result);
  } catch (error) {
    console.error("[SubCount] Update failed:", error);
  }
}

/*
BotRix replaces {amount} with the subscription amount
when this alert runs.
*/
sendSubscriberEvent("{amount}");
