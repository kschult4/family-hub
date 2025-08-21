# Security Setup Guide

## Environment Variables Configuration

**⚠️ SECURITY CRITICAL**: Never commit real credentials to version control.

### 1. Initial Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your actual values:
   ```bash
   # Replace placeholder values with your real credentials
   VITE_HA_BASE_URL=http://your-actual-ha-instance:8123
   VITE_HA_TOKEN=your_actual_home_assistant_token
   VITE_GOOGLE_CALENDAR_API_KEY=your_actual_google_api_key
   # ... etc
   ```

### 2. Obtaining Credentials

#### Home Assistant Token
1. Log into your Home Assistant instance
2. Go to Profile → Security
3. Create a "Long-lived access token"
4. Copy the token and paste it into `VITE_HA_TOKEN`

#### Google Calendar API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Calendar API
4. Create credentials → API Key
5. Restrict the API key to Calendar API only

### 3. Security Best Practices

- **Never** commit `.env` files to git
- Use different tokens for development and production
- Regularly rotate your access tokens
- Keep your Home Assistant instance updated
- Use strong, unique passwords

### 4. Production Deployment

For production deployments:
1. Use environment variables provided by your hosting platform
2. Enable HTTPS for all connections
3. Consider using a reverse proxy for Home Assistant
4. Implement proper firewall rules

### 5. Mock Data Mode

For development without real credentials:
```bash
VITE_USE_MOCK_HA=true
```

This enables mock data mode, allowing development without connecting to real services.

## Security Updates Applied

This application has been updated with the following security improvements:
- ✅ Removed hardcoded credentials from version control
- ✅ Updated dependencies to fix known vulnerabilities
- ✅ Secured development proxy configuration
- ✅ Added proper .gitignore for sensitive files

## Reporting Security Issues

If you discover a security vulnerability, please email the maintainers directly instead of opening a public issue.