"use strict";
const fs = require("fs");
const path = require("path");

function loadConfig() {
  const p = path.join(__dirname, "..", "config", "service.json");
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

async function checkEndpoint(url) {
  try {
    const res = await fetch(url, { method: "GET" });
    return { url, ok: res.ok, status: res.status };
  } catch (e) {
    return { url, ok: false, error: String(e) };
  }
}

async function main() {
  const cfg = loadConfig();
  const results = [];
  for (const url of cfg.endpoints || []) {
    results.push(await checkEndpoint(url));
  }
  console.log(JSON.stringify({ checked: results.length, results }, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = { loadConfig, checkEndpoint };
