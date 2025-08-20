import '@testing-library/jest-dom'
import { vi, beforeEach } from 'vitest'

// Mock environment variables for tests
import.meta.env.VITE_HA_BASE_URL = 'http://homeassistant.local:8123'
import.meta.env.VITE_HA_TOKEN = 'test_token_123'
import.meta.env.VITE_USE_MOCK_HA = 'true'
import.meta.env.DEV = true

// Mock environment variables
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  disconnect: vi.fn(),
  unobserve: vi.fn(),
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock

// Mock sessionStorage
global.sessionStorage = localStorageMock

// Mock WebSocket with better state management
global.WebSocket = vi.fn().mockImplementation((url) => {
  const ws = {
    url,
    close: vi.fn(),
    send: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    readyState: 0, // CONNECTING initially
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
    onopen: null,
    onclose: null,
    onmessage: null,
    onerror: null,
    
    // Test helpers
    simulateOpen() {
      this.readyState = 1
      if (this.onopen) this.onopen(new Event('open'))
      const openHandler = this.addEventListener.mock.calls
        .find(call => call[0] === 'open')?.[1]
      if (openHandler) openHandler(new Event('open'))
    },
    
    simulateClose(code = 1000) {
      this.readyState = 3
      const closeEvent = new CloseEvent('close', { code })
      if (this.onclose) this.onclose(closeEvent)
      const closeHandler = this.addEventListener.mock.calls
        .find(call => call[0] === 'close')?.[1]
      if (closeHandler) closeHandler(closeEvent)
    },
    
    simulateMessage(data) {
      const messageEvent = new MessageEvent('message', { data })
      if (this.onmessage) this.onmessage(messageEvent)
      const messageHandler = this.addEventListener.mock.calls
        .find(call => call[0] === 'message')?.[1]
      if (messageHandler) messageHandler(messageEvent)
    },
    
    simulateError(error = new Error('WebSocket error')) {
      const errorEvent = new ErrorEvent('error', { error })
      if (this.onerror) this.onerror(errorEvent)
      const errorHandler = this.addEventListener.mock.calls
        .find(call => call[0] === 'error')?.[1]
      if (errorHandler) errorHandler(errorEvent)
    }
  }
  
  // Auto-open after a tick to simulate real WebSocket behavior
  setTimeout(() => {
    if (ws.readyState === 0) {
      ws.simulateOpen()
    }
  }, 0)
  
  return ws
})

// Mock fetch
global.fetch = vi.fn()

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
  sessionStorage.clear()
})