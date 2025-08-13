import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

// Mock Home Assistant data for testing
export const mockDeviceEntity = {
  entity_id: 'light.living_room',
  state: 'on',
  attributes: {
    friendly_name: 'Living Room Light',
    brightness: 128,
    color_temp: 366,
    rgb_color: [255, 255, 255],
    supported_features: 63
  },
  last_changed: '2024-01-01T12:00:00.000Z',
  last_updated: '2024-01-01T12:00:00.000Z'
}

export const mockSceneEntity = {
  entity_id: 'scene.movie_night',
  state: 'scening',
  attributes: {
    friendly_name: 'Movie Night',
    icon: 'mdi:movie'
  },
  last_changed: '2024-01-01T12:00:00.000Z',
  last_updated: '2024-01-01T12:00:00.000Z'
}

export const mockThermostatEntity = {
  entity_id: 'climate.main_thermostat',
  state: 'heat',
  attributes: {
    friendly_name: 'Main Thermostat',
    temperature: 72,
    current_temperature: 70,
    target_temp_high: 75,
    target_temp_low: 68,
    hvac_modes: ['heat', 'cool', 'auto', 'off'],
    hvac_action: 'heating',
    supported_features: 387
  },
  last_changed: '2024-01-01T12:00:00.000Z',
  last_updated: '2024-01-01T12:00:00.000Z'
}

// Create a mock fetch response helper
export const mockFetchResponse = (data, ok = true, status = 200) => {
  return Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  })
}

// Create a mock WebSocket for testing
export const createMockWebSocket = () => {
  const mockWS = {
    send: vi.fn(),
    close: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    readyState: 1,
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
  }
  
  // Helper to simulate receiving messages
  mockWS.simulateMessage = (data) => {
    const messageEvent = new MessageEvent('message', {
      data: JSON.stringify(data)
    })
    const messageHandler = mockWS.addEventListener.mock.calls
      .find(call => call[0] === 'message')?.[1]
    if (messageHandler) {
      messageHandler(messageEvent)
    }
  }
  
  // Helper to simulate connection open
  mockWS.simulateOpen = () => {
    mockWS.readyState = 1
    const openHandler = mockWS.addEventListener.mock.calls
      .find(call => call[0] === 'open')?.[1]
    if (openHandler) {
      openHandler(new Event('open'))
    }
  }
  
  // Helper to simulate connection close
  mockWS.simulateClose = () => {
    mockWS.readyState = 3
    const closeHandler = mockWS.addEventListener.mock.calls
      .find(call => call[0] === 'close')?.[1]
    if (closeHandler) {
      closeHandler(new Event('close'))
    }
  }
  
  return mockWS
}

// Helper to wait for async operations
export const waitFor = (callback, options = {}) => {
  return new Promise((resolve, reject) => {
    const timeout = options.timeout || 1000
    const interval = options.interval || 50
    const startTime = Date.now()
    
    const checkCondition = () => {
      try {
        const result = callback()
        if (result) {
          resolve(result)
        } else if (Date.now() - startTime >= timeout) {
          reject(new Error('Timeout waiting for condition'))
        } else {
          setTimeout(checkCondition, interval)
        }
      } catch (error) {
        if (Date.now() - startTime >= timeout) {
          reject(error)
        } else {
          setTimeout(checkCondition, interval)
        }
      }
    }
    
    checkCondition()
  })
}

// Helper for testing drag and drop
export const mockDragEvent = (dataTransfer = {}) => ({
  dataTransfer: {
    setData: vi.fn(),
    getData: vi.fn(),
    setDragImage: vi.fn(),
    ...dataTransfer
  },
  preventDefault: vi.fn(),
  stopPropagation: vi.fn()
})

// Helper for testing touch events
export const mockTouchEvent = (touches = []) => ({
  touches,
  changedTouches: touches,
  targetTouches: touches,
  preventDefault: vi.fn(),
  stopPropagation: vi.fn()
})

// Custom render with common providers (if needed)
export const renderWithProviders = (ui, options = {}) => {
  return render(ui, {
    ...options,
  })
}

// Helper to mock environment variables
export const mockEnv = (env = {}) => {
  const originalEnv = import.meta.env
  Object.keys(env).forEach(key => {
    import.meta.env[key] = env[key]
  })
  
  return () => {
    Object.keys(env).forEach(key => {
      if (originalEnv[key] !== undefined) {
        import.meta.env[key] = originalEnv[key]
      } else {
        delete import.meta.env[key]
      }
    })
  }
}