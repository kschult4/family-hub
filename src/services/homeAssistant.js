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

// Helper function to create the correct URL and headers for development vs production
function createRequestConfig(endpoint, baseUrlParam = baseUrl, tokenParam = token) {
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment) {
    // Use Vite proxy in development
    return {
      url: `/api/ha/api${endpoint}`,
      headers: { 'Content-Type': 'application/json' }
    };
  } else {
    // Use direct calls in production
    return {
      url: createApiUrl(baseUrlParam, endpoint),
      headers: createAuthHeaders(tokenParam)
    };
  }
}

export const haApi = {
  async getStates(baseUrlParam = baseUrl, tokenParam = token) {
    const { url, headers } = createRequestConfig('/states', baseUrlParam, tokenParam);
    
    return await makeApiRequest(url, {
      method: 'GET',
      headers,
    });
  },

  async toggleDevice(baseUrl, token, entityId) {
    const domain = entityId.split('.')[0];
    const { url, headers } = createRequestConfig(`/services/${domain}/toggle`, baseUrl, token);
    
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
    const { url, headers } = createRequestConfig(`/services/${domain}/turn_on`, baseUrl, token);
    
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
    const { url, headers } = createRequestConfig('/services/scene/turn_on', baseUrl, token);
    
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
    const { url, headers } = createRequestConfig(`/services/${domain}/turn_off`, baseUrl, token);
    
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
    const { url, headers } = createRequestConfig(`/services/${domain}/${service}`, baseUrl, token);
    
    const body = JSON.stringify(data);
    
    return await makeApiRequest(url, {
      method: 'POST',
      headers,
      body,
    });
  },
};