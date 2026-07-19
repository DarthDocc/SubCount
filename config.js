window.SUB_WIDGET_CONFIG = {
  // Replace this after deploying the Cloudflare Worker.
  workerUrl: "https://polished-silence-32bf.forrest-inman89.workers.dev",,

  // Unique channel name used by the Worker.
  channel: "ledyym",

  label: "TOTAL SUBS",
  pollEveryMs: 5000,
  fallbackValue: 9189,
  debug: false,

  labelColor: "#ffffff",
  countColor: "#ffffff",
  glowColor: "#b56cff",
  labelSize: 30,
  countSize: 60,
  glowStrength: 1
};
