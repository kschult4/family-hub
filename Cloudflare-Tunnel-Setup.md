# Cloudflare Tunnel Setup for Home Assistant

## Overview
Set up a secure Cloudflare Tunnel to expose your Home Assistant instance to the internet without port forwarding. This allows your GitHub Pages production site to connect to HA securely.

## Prerequisites
- Cloudflare account (free)
- Domain name managed by Cloudflare (optional but recommended)
- SSH access to your Raspberry Pi

## Step 1: Install cloudflared on Your Pi

SSH into your Pi and install the Cloudflare daemon:

```bash
# Download and install cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64
sudo mv cloudflared-linux-arm64 /usr/local/bin/cloudflared
sudo chmod +x /usr/local/bin/cloudflared

# Verify installation
cloudflared version
```

## Step 2: Authenticate with Cloudflare

```bash
# This will open a browser window to authenticate
cloudflared tunnel login
```

Follow the browser prompts to log into Cloudflare and select your domain (if you have one).

## Step 3: Create a Tunnel

```bash
# Create a new tunnel
cloudflared tunnel create homeassistant

# This will create a tunnel and give you a tunnel ID
# Note the tunnel ID for later use
```

## Step 4: Create Tunnel Configuration

Create the config file:

```bash
sudo mkdir -p /etc/cloudflared
sudo nano /etc/cloudflared/config.yml
```

Add this configuration (replace `TUNNEL_ID` with your actual tunnel ID):

```yaml
tunnel: TUNNEL_ID
credentials-file: /root/.cloudflared/TUNNEL_ID.json

ingress:
  # Route for Home Assistant
  - hostname: homeassistant.yourdomain.com  # Replace with your domain
    service: http://localhost:8123
  # Catch-all rule (required)
  - service: http_status:404
```

**If you don't have a custom domain**, use Cloudflare's default subdomain:

```yaml
tunnel: TUNNEL_ID
credentials-file: /root/.cloudflared/TUNNEL_ID.json

ingress:
  # Route for Home Assistant using trycloudflare.com
  - hostname: homeassistant-RANDOM.trycloudflare.com
    service: http://localhost:8123
  # Catch-all rule (required)
  - service: http_status:404
```

## Step 5: Configure DNS (If Using Custom Domain)

If using your own domain, add a DNS record:

```bash
# Add DNS record pointing to your tunnel
cloudflared tunnel route dns homeassistant homeassistant.yourdomain.com
```

## Step 6: Test the Tunnel

```bash
# Test the tunnel configuration
cloudflared tunnel --config /etc/cloudflared/config.yml run
```

You should see logs indicating the tunnel is connected. Test by visiting your tunnel URL.

## Step 7: Install as Service

```bash
# Install as a system service
sudo cloudflared service install --config /etc/cloudflared/config.yml

# Start the service
sudo systemctl start cloudflared
sudo systemctl enable cloudflared

# Check status
sudo systemctl status cloudflared
```

## Step 8: Update Home Assistant Configuration

Update `/config/configuration.yaml` to include your tunnel URL:

```yaml
http:
  cors_allowed_origins:
    - http://localhost:5173
    - http://127.0.0.1:5173
    - https://kschult4.github.io
    - https://homeassistant.yourdomain.com  # Add your tunnel URL
  use_x_forwarded_for: true
  trusted_proxies:
    - 127.0.0.1
    - ::1
    - 173.245.48.0/20    # Cloudflare IP ranges
    - 103.21.244.0/22
    - 103.22.200.0/22
    - 103.31.4.0/22
    - 141.101.64.0/18
    - 108.162.192.0/18
    - 190.93.240.0/20
    - 188.114.96.0/20
    - 197.234.240.0/22
    - 198.41.128.0/17
    - 162.158.0.0/15
    - 104.16.0.0/13
    - 104.24.0.0/14
    - 172.64.0.0/13
    - 131.0.72.0/22
```

Restart Home Assistant:

```bash
sudo docker restart homeassistant
```

## Step 9: Update Production Environment

Update your GitHub repository secrets or environment variables:

- `VITE_HA_BASE_URL=https://homeassistant.yourdomain.com` (your tunnel URL)
- `VITE_HA_TOKEN=your-long-lived-token`
- `VITE_USE_MOCK_HA=false`

## Step 10: Test End-to-End

1. **Test tunnel access directly:**
   ```bash
   curl https://homeassistant.yourdomain.com/api/
   ```

2. **Test with authorization:**
   ```bash
   TOKEN="your-token"
   curl -H "Authorization: Bearer $TOKEN" https://homeassistant.yourdomain.com/api/
   ```

3. **Test CORS from GitHub Pages:**
   ```bash
   curl -i -X OPTIONS \
     -H "Origin: https://kschult4.github.io" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: authorization" \
     https://homeassistant.yourdomain.com/api/states
   ```

## Troubleshooting

**Tunnel won't start:**
- Check tunnel ID in config.yml matches created tunnel
- Verify credentials file path exists
- Check logs: `sudo journalctl -u cloudflared -f`

**CORS errors:**
- Ensure tunnel URL is in Home Assistant CORS config
- Add Cloudflare IP ranges to trusted_proxies
- Restart Home Assistant after config changes

**502 Bad Gateway:**
- Check Home Assistant is running on port 8123
- Verify tunnel service points to correct local address
- Check firewall isn't blocking local connections

## Security Notes

- Tunnel provides automatic HTTPS encryption
- No ports need to be opened on your router
- Cloudflare handles DDoS protection
- Consider enabling Cloudflare Access for additional security
- Monitor Home Assistant logs for unusual activity

## Alternative: Quick Tunnel (No Custom Domain)

For testing without a custom domain:

```bash
# Start a quick tunnel (temporary URL)
cloudflared tunnel --url http://localhost:8123
```

This gives you a temporary `*.trycloudflare.com` URL for testing.