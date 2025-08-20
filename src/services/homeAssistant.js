const BASE_HEADERS = {
  'Content-Type': 'application/json',
};

function createAuthHeaders(token, includeContentType = true) {
  const headers = {
    'Authorization': `Bearer ${token}`,
  };
  
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  
  return headers;
}

function createApiUrl(baseUrl, endpoint) {
  return `${baseUrl}/api${endpoint}`;
}

async function makeApiRequest(url, options = {}) {
  try {
    // Removed excessive logging - only log errors
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    // Reduce error logging to prevent console spam during network issues
    if (!error.message.includes('Failed to fetch')) {
      console.error('API request error:', error);
    }
    throw new Error(`API request failed: ${error.message}`);
  }
}

const baseUrl = import.meta.env.VITE_HA_BASE_URL;
const token = import.meta.env.VITE_HA_TOKEN;

export const haApi = {
  async getStates(baseUrlParam = baseUrl, tokenParam = token) {
    const url = createApiUrl(baseUrlParam, '/states');
    
    return await makeApiRequest(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenParam}` },
    });
  },

  async toggleDevice(baseUrl, token, entityId) {
    const domain = entityId.split('.')[0];
    const url = createApiUrl(baseUrl, `/services/${domain}/toggle`);
    const headers = createAuthHeaders(token);
    
    const body = JSON.stringify({
      entity_id: entityId,
    });
    
    return await makeApiRequest(url, {
      method: 'POST',
      headers,
      body,
    });
  },

  async setDeviceAttributes(baseUrl, token, entityId, attributes) {
    const domain = entityId.split('.')[0];
    const url = createApiUrl(baseUrl, `/services/${domain}/turn_on`);
    const headers = createAuthHeaders(token);
    
    const body = JSON.stringify({
      entity_id: entityId,
      ...attributes,
    });
    
    return await makeApiRequest(url, {
      method: 'POST',
      headers,
      body,
    });
  },

  async activateScene(baseUrl, token, entityId) {
    const url = createApiUrl(baseUrl, '/services/scene/turn_on');
    const headers = createAuthHeaders(token);
    
    const body = JSON.stringify({
      entity_id: entityId,
    });
    
    return await makeApiRequest(url, {
      method: 'POST',
      headers,
      body,
    });
  },

  async turnOffDevice(baseUrl, token, entityId) {
    const domain = entityId.split('.')[0];
    const url = createApiUrl(baseUrl, `/services/${domain}/turn_off`);
    const headers = createAuthHeaders(token);
    
    const body = JSON.stringify({
      entity_id: entityId,
    });
    
    return await makeApiRequest(url, {
      method: 'POST',
      headers,
      body,
    });
  },

  async callService(baseUrl, token, domain, service, data = {}) {
    const url = createApiUrl(baseUrl, `/services/${domain}/${service}`);
    const headers = createAuthHeaders(token);
    
    const body = JSON.stringify(data);
    
    return await makeApiRequest(url, {
      method: 'POST',
      headers,
      body,
    });
  },
};