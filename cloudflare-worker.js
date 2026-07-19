/**
 * Cloudflare Worker for a multi-channel subscriber counter.
 *
 * Required bindings:
 *   SUB_COUNTS  -> KV namespace
 *
 * Required secret:
 *   WEBHOOK_SECRET
 */

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Webhook-Secret",
      "Cache-Control": "no-store"
    }
  });
}

function normalizeChannel(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");
}

async function getCount(env, channel) {
  const stored = await env.SUB_COUNTS.get(`count:${channel}`);
  const parsed = Number(stored);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : 0;
}

async function setCount(env, channel, count) {
  const normalized = Math.max(0, Math.trunc(Number(count) || 0));
  await env.SUB_COUNTS.put(`count:${channel}`, String(normalized));
  return normalized;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return json({ ok: true });
    }

    if (url.pathname === "/count" && request.method === "GET") {
      const channel = normalizeChannel(url.searchParams.get("channel"));
      if (!channel) return json({ error: "Missing channel" }, 400);

      const count = await getCount(env, channel);
      return json({ channel, count });
    }

    if (url.pathname === "/event" && request.method === "POST") {
      const secret = request.headers.get("X-Webhook-Secret");
      if (!env.WEBHOOK_SECRET || secret !== env.WEBHOOK_SECRET) {
        return json({ error: "Unauthorized" }, 401);
      }

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "Invalid JSON" }, 400);
      }

      const channel = normalizeChannel(body.channel);
      if (!channel) return json({ error: "Missing channel" }, 400);

      const amount = Math.max(1, Math.trunc(Number(body.amount) || 1));
      const current = await getCount(env, channel);
      const count = await setCount(env, channel, current + amount);

      return json({ ok: true, channel, added: amount, count });
    }

    if (url.pathname === "/set" && request.method === "POST") {
      const secret = request.headers.get("X-Webhook-Secret");
      if (!env.WEBHOOK_SECRET || secret !== env.WEBHOOK_SECRET) {
        return json({ error: "Unauthorized" }, 401);
      }

      let body;
      try {
        body = await request.json();
      } catch {
        return json({ error: "Invalid JSON" }, 400);
      }

      const channel = normalizeChannel(body.channel);
      if (!channel) return json({ error: "Missing channel" }, 400);

      const count = await setCount(env, channel, body.count);
      return json({ ok: true, channel, count });
    }

    return json({
      ok: true,
      routes: {
        read: "GET /count?channel=ledyym",
        add: "POST /event",
        set: "POST /set"
      }
    });
  }
};
