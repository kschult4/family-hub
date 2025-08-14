# Home Assistant Dev Tunnel – Quick Runbook

## What was wrong (one-liner)
Your corporate Mac/network was intercepting or stripping the browser's `Authorization` header and complicating CORS. We solved it by (1) allowing your dev origin in Home Assistant, (2) using a long‑lived token, and (3) running the dev server on the Pi and tunneling both the app and HA API back to your Mac so everything looks like `localhost` to the browser.

---

## One-time setup

### 1) Allow your dev origin in Home Assistant
Edit `/config/configuration.yaml` **inside the container** and add:
```yaml
http:
  cors_allowed_origins:
    - http://localhost:5173
    - http://127.0.0.1:5173
```

Restart HA:

```bash
sudo docker restart homeassistant
```

### 2) Create a long‑lived access token

**Home Assistant → Profile → Long‑Lived Access Tokens → "Create Token".** Copy it somewhere safe.

### 3) (Nice to have) Mac alias to start the tunnel

Add to `~/.zshrc`:

```bash
alias ha-tunnel='ssh -N -L 5173:localhost:5173 -L 8123:localhost:8123 kschult4@192.168.1.224'
```

Then source your shell config:

```bash
source ~/.zshrc
```

> **Tip:** If your Pi's IP changes, update the alias accordingly or use mDNS/hostname.

---

## Daily workflow (the quick way)

### A) On the Pi

```bash
cd ~/family-hub
npm run dev -- --host
```

Leave it running. It serves on Pi port **5173**.

### B) On your Mac

Start the tunnel:

```bash
ha-tunnel
```

(Or run the full `ssh` command if you didn't add the alias.)

### C) Use the app

Open: `http://localhost:5173`
Ensure your app calls HA at `http://localhost:8123` and sends:

```
Authorization: Bearer <YOUR_TOKEN>
```

---

## Quick tests (to verify things)

**Preflight/CORS from Mac (should be 200 OK):**

```bash
curl -i -X OPTIONS \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: authorization" \
  --noproxy '*' \
  http://192.168.1.224:8123/api/states
```

**API via the tunnel from Mac (should return JSON):**

```bash
TOKEN="<your token>"
curl -i -H "Authorization: Bearer $TOKEN" \
  http://localhost:8123/api/
```

---

## Troubleshooting cheatsheet

* **401 Unauthorized** → Token missing/typo/expired. Regenerate and make sure header is exactly `Authorization: Bearer <token>`.
* **403 Forbidden in browser** → CORS. Confirm `cors_allowed_origins` includes `http://localhost:5173` **and** you restarted HA.
* **"Failed to fetch"** → Tunnel not running or app pointing to wrong base URL. Start `ha-tunnel`, make sure the app calls `http://localhost:8123`.
* **Can't reach 127.0.0.1:5173** → Vite not running on the Pi. Start `npm run dev -- --host` again.
* **Unsure where config lives** → Confirm container + bind mount:

```bash
sudo docker inspect homeassistant --format '{{ range .Mounts }}{{ .Source }} -> {{ .Destination }}{{ println }}{{ end }}'
```

---

## Notes & safety

* Long‑lived tokens grant full API access. Store them securely and rotate if exposed.
* If your Mac uses a corporate proxy, keep `--noproxy '*'` on direct‑LAN curls, and prefer the SSH tunnel for browser traffic.
* Consider moving the SSH options to `~/.ssh/config` for readability and adding `-o ServerAliveInterval=60` for stability.