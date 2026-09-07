# Minecraft Web Panel

A Minecraft-themed web control panel designed to run alongside a Minecraft Java server.

## Stack
- Frontend: Vite + vanilla HTML/CSS/JS
- Backend: Node.js + Express
- Minecraft control: RCON (optional)
- Demo mode: enabled by default so the UI works without a server

## Termux

```bash
pkg update
pkg install nodejs git
git clone YOUR_GITHUB_REPO_URL
cd minecraft-web-panel
npm install
cp .env.example .env
npm start
```

Open `http://127.0.0.1:3000`.

For a real server, set RCON details in `.env`:
- RCON_HOST
- RCON_PORT
- RCON_PASSWORD

Then set `DEMO_MODE=false`.

## GitHub

```bash
git init
git add .
git commit -m "Minecraft web panel"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

Do not commit `.env`.
