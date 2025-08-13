const BASE_HEADERS = {
  'Content-Type': 'application/json',
};

function createAuthHeaders(token) {
  return {
    ...BASE_HEADERS,
    'Authorization': `Bearer ${token}`,
  };
}

function createApiUrl(baseUrl, endpoint) {
  return `${baseUrl}/api${endpoint}`;
}

async function makeApiRequest(url, options = {}) {
  try {
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
    throw new Error(`API request failed: ${error.message}`);
  }
}

export const haApi = {
  async getStates(baseUrl, token) {
    const url = createApiUrl(baseUrl, '/states');
    const headers = createAuthHeaders(token);
    
    return await makeApiRequest(url, {
      method: 'GET',
      headers,
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