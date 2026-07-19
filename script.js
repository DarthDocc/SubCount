(() => {
  "use strict";

  const cfg = window.SUB_WIDGET_CONFIG || {};
  const countEl = document.getElementById("count");
  const labelEl = document.getElementById("label");
  const statusEl = document.getElementById("status");
  let currentValue = null;

  if (cfg.debug) document.body.classList.add("debug");

  labelEl.textContent = cfg.label || "TOTAL SUBS";
  document.documentElement.style.setProperty("--label-color", cfg.labelColor || "#ffffff");
  document.documentElement.style.setProperty("--count-color", cfg.countColor || "#ffffff");
  document.documentElement.style.setProperty("--glow-color", cfg.glowColor || "#b56cff");
  document.documentElement.style.setProperty("--label-size", `${Number(cfg.labelSize) || 30}px`);
  document.documentElement.style.setProperty("--count-size", `${Number(cfg.countSize) || 60}px`);
  document.documentElement.style.setProperty("--glow-strength", String(Number(cfg.glowStrength) || 1));

  function setStatus(message) {
    statusEl.textContent = message;
    console.log("[Sub Widget]", message);
  }

  function render(value) {
    if (!Number.isFinite(value)) return;

    if (currentValue !== value) {
      countEl.classList.remove("bump");
      void countEl.offsetWidth;
      countEl.classList.add("bump");
      setTimeout(() => countEl.classList.remove("bump"), 220);
    }

    currentValue = value;
    countEl.textContent = Math.trunc(value).toLocaleString("en-US");
  }

  async function refresh() {
    const worker = String(cfg.workerUrl || "").replace(/\/+$/, "");
    const channel = encodeURIComponent(cfg.channel || "");

    if (!worker || worker.includes("YOUR-WORKER") || !channel) {
      render(Number(cfg.fallbackValue) || 0);
      setStatus("Configure workerUrl and channel in config.js");
      return;
    }

    try {
      const response = await fetch(`${worker}/count?channel=${channel}&_=${Date.now()}`, {
        cache: "no-store"
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const payload = await response.json();
      const value = Number(payload.count);

      if (!Number.isFinite(value)) {
        throw new Error("Worker response did not contain a valid count");
      }

      render(value);
      setStatus(`Connected — ${value}`);
    } catch (error) {
      if (currentValue === null) render(Number(cfg.fallbackValue) || 0);
      setStatus(`Connection failed: ${error.message}`);
    }
  }

  refresh();
  setInterval(refresh, Math.max(3000, Number(cfg.pollEveryMs) || 5000));

  window.refreshSubscriberCount = refresh;
})();
