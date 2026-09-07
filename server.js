require("dotenv").config();
const express = require("express");
const path = require("path");
const { Rcon } = require("rcon-client");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const PORT = Number(process.env.PORT || 3000);
const DEMO = String(process.env.DEMO_MODE || "true").toLowerCase() === "true";

async function withRcon(fn) {
  if (DEMO) return fn(null);
  const rcon = await Rcon.connect({
    host: process.env.RCON_HOST || "127.0.0.1",
    port: Number(process.env.RCON_PORT || 25575),
    password: process.env.RCON_PASSWORD || ""
  });
  try { return await fn(rcon); } finally { rcon.end(); }
}

app.get("/api/status", async (_req, res) => {
  try {
    if (DEMO) return res.json({
      online: true, demo: true, version: "1.21.x",
      players: 7, maxPlayers: 50, tps: 19.9, ram: 38,
      uptime: "2h 18m"
    });
    const raw = await withRcon(r => r.send("list"));
    const match = raw.match(/There are (\d+) of a max of (\d+) players online/);
    res.json({
      online: true, demo: false,
      players: match ? Number(match[1]) : 0,
      maxPlayers: match ? Number(match[2]) : 0,
      raw
    });
  } catch (e) {
    res.status(503).json({online:false, error:e.message});
  }
});

app.post("/api/action", async (req, res) => {
  const action = req.body?.action;
  const commands = {
    say: req.body?.message ? `say ${String(req.body.message).slice(0,120)}` : null,
    save: "save-all",
    weather: "weather clear",
    time: "time set day"
  };
  if (!commands[action]) return res.status(400).json({error:"Unknown action"});
  try {
    if (DEMO) return res.json({ok:true, demo:true, message:`Demo: ${commands[action]}`});
    const result = await withRcon(r => r.send(commands[action]));
    res.json({ok:true, result});
  } catch (e) {
    res.status(500).json({ok:false, error:e.message});
  }
});

app.get("*splat", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Minecraft panel running on http://127.0.0.1:${PORT}`);
});
