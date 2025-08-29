# Home Assistant Production CORS Setup

## Problem
Home Assistant devices work in development but fail in production due to CORS restrictions. The dev setup uses localhost tunneling, but production needs direct access.

## Solution: Update Home Assistant CORS Configuration

### 1. Edit Home Assistant Configuration

Access your Home Assistant configuration file and update the CORS settings:

**Location**: `/config/configuration.yaml` (inside the Home Assistant container)

**Current configuration** (from dev setup):
```yaml
http:
  cors_allowed_origins:
    - http://localhost:5173
    - http://127.0.0.1:5173
```

**Updated configuration** (add your production domain):
```yaml
http:
  cors_allowed_origins:
    - http://localhost:5173        # Keep for dev
    - http://127.0.0.1:5173       # Keep for dev  
    - https://kschult4.github.io   # Add your GitHub Pages domain
  use_x_forwarded_for: true
  trusted_proxies:
    - 127.0.0.1
    - ::1
```

### 2. Replace with Your Actual Production URL

**Your production domain is GitHub Pages: `https://kschult4.github.io`**

Note: We're using the root domain (`kschult4.github.io`) rather than the full path (`kschult4.github.io/family-hub/`) for CORS origins, as CORS works at the origin level, not the path level.

### 3. Restart Home Assistant

After updating the configuration:

```bash
sudo docker restart homeassistant
```

### 4. Verify CORS Configuration

Test CORS from your production environment:

```bash
curl -i -X OPTIONS \
  -H "Origin: https://kschult4.github.io" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: authorization" \
  http://192.168.1.224:8123/api/states
```

Should return `200 OK` with CORS headers.

### 5. Test API Access

Test actual API call:

```bash
TOKEN="your-long-lived-token"
curl -i -H "Authorization: Bearer $TOKEN" \
  -H "Origin: https://kschult4.github.io" \
  http://192.168.1.224:8123/api/
```

Should return Home Assistant API information.

## Additional Considerations

### HTTPS Requirements
If your production site uses HTTPS, ensure:
- Your Home Assistant instance is accessible via HTTPS, OR
- Your browser allows mixed content (HTTPS site → HTTP HA)

### Network Access
Ensure your production server/CDN can reach your Home Assistant instance:
- If using a CDN (Netlify, Vercel), HA must be publicly accessible
- If using a VPS, ensure network routing to your home network

### Environment Variables
Verify your production environment has:
- `VITE_HA_BASE_URL=http://192.168.1.224:8123` (your Pi's IP)
- `VITE_HA_TOKEN=your-long-lived-token`
- `VITE_USE_MOCK_HA=false`

**Note**: For GitHub Pages, you'll need to set these as repository secrets and configure your build workflow to use them.

## Troubleshooting

**CORS errors in browser console:**
- Double-check the origin URL in CORS config matches exactly
- Restart Home Assistant after config changes
- Check browser developer tools Network tab for preflight requests

**"Failed to fetch" errors:**
- Verify HA instance is reachable from production environment
- Check if firewall is blocking requests
- Ensure HTTPS/HTTP protocol consistency

**401 Unauthorized:**
- Verify long-lived token is correct and not expired
- Check token is being sent in Authorization header