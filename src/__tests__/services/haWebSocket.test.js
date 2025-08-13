import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createWebSocketConnection } from '../../services/haWebSocket.js'
import { createMockWebSocket } from '../../test/utils.js'

// Mock WebSocket globally
const mockWS = createMockWebSocket()
global.WebSocket = vi.fn(() => mockWS)

describe('haWebSocket service', () => {
  const mockBaseUrl = 'http://homeassistant.local:8123'
  const mockToken = 'test_token_123'
  let wsConnection

  beforeEach(() => {
    vi.clearAllMocks()
    mockWS.readyState = 0 // CONNECTING
    wsConnection = createWebSocketConnection(mockBaseUrl, mockToken)
  })

  afterEach(() => {
    if (wsConnection) {
      wsConnection.close()
    }
  })

  describe('Connection establishment', () => {
    it('should create WebSocket connection with correct URL', async () => {
      const connectPromise = wsConnection.connect()
      
      expect(global.WebSocket).toHaveBeenCalledWith(
        'ws://homeassistant.local:8123/api/websocket'
      )

      // Simulate connection flow
      mockWS.simulateOpen()
      mockWS.simulateMessage({ type: 'auth_required' })
      mockWS.simulateMessage({ type: 'auth_ok' })
      mockWS.simulateMessage({ type: 'result', success: true, id: 2 })

      await expect(connectPromise).resolves.toBeUndefined()
    })

    it('should handle HTTPS URLs correctly', () => {
      const httpsConnection = createWebSocketConnection('https://homeassistant.example.com', mockToken)
      httpsConnection.connect()

      expect(global.WebSocket).toHaveBeenCalledWith(
        'wss://homeassistant.example.com/api/websocket'
      )
    })

    it('should send authentication after auth_required', async () => {
      const connectPromise = wsConnection.connect()
      
      mockWS.simulateOpen()
      mockWS.simulateMessage({ type: 'auth_required' })

      expect(mockWS.send).toHaveBeenCalledWith(
        JSON.stringify({
          type: 'auth',
          access_token: mockToken
        })
      )

      // Complete the connection
      mockWS.simulateMessage({ type: 'auth_ok' })
      mockWS.simulateMessage({ type: 'result', success: true, id: 2 })
      
      await connectPromise
    })

    it('should subscribe to state changes after authentication', async () => {
      const connectPromise = wsConnection.connect()
      
      mockWS.simulateOpen()
      mockWS.simulateMessage({ type: 'auth_required' })
      mockWS.simulateMessage({ type: 'auth_ok' })

      expect(mockWS.send).toHaveBeenCalledWith(
        JSON.stringify({
          id: 2,
          type: 'subscribe_events',
          event_type: 'state_changed'
        })
      )

      mockWS.simulateMessage({ type: 'result', success: true, id: 2 })
      await connectPromise
    })

    it('should reject on invalid authentication', async () => {
      const connectPromise = wsConnection.connect()
      
      mockWS.simulateOpen()
      mockWS.simulateMessage({ type: 'auth_required' })
      mockWS.simulateMessage({ type: 'auth_invalid' })

      await expect(connectPromise).rejects.toThrow('Invalid Home Assistant token')
    })

    it('should reject on connection error', async () => {
      const connectPromise = wsConnection.connect()
      
      const errorEvent = new Error('Connection failed')
      mockWS.addEventListener.mock.calls
        .find(call => call[0] === 'error')[1](errorEvent)

      await expect(connectPromise).rejects.toThrow('Failed to connect to Home Assistant WebSocket')
    })
  })

  describe('State change handling', () => {
    beforeEach(async () => {
      const connectPromise = wsConnection.connect()
      mockWS.simulateOpen()
      mockWS.simulateMessage({ type: 'auth_required' })
      mockWS.simulateMessage({ type: 'auth_ok' })
      mockWS.simulateMessage({ type: 'result', success: true, id: 2 })
      await connectPromise
    })

    it('should call subscribers on state changes', () => {
      const mockCallback = vi.fn()
      const unsubscribe = wsConnection.subscribe(mockCallback)

      const stateChangeMessage = {
        type: 'event',
        event: {
          event_type: 'state_changed',
          data: {
            entity_id: 'light.living_room',
            new_state: {
              entity_id: 'light.living_room',
              state: 'on',
              attributes: { brightness: 255 }
            }
          }
        }
      }

      mockWS.simulateMessage(stateChangeMessage)

      expect(mockCallback).toHaveBeenCalledWith(
        'light.living_room',
        {
          entity_id: 'light.living_room',
          state: 'on',
          attributes: { brightness: 255 }
        }
      )

      unsubscribe()
    })

    it('should handle multiple subscribers', () => {
      const mockCallback1 = vi.fn()
      const mockCallback2 = vi.fn()
      
      wsConnection.subscribe(mockCallback1)
      wsConnection.subscribe(mockCallback2)

      const stateChangeMessage = {
        type: 'event',
        event: {
          event_type: 'state_changed',
          data: {
            entity_id: 'switch.bedroom',
            new_state: { entity_id: 'switch.bedroom', state: 'off' }
          }
        }
      }

      mockWS.simulateMessage(stateChangeMessage)

      expect(mockCallback1).toHaveBeenCalledWith('switch.bedroom', expect.any(Object))
      expect(mockCallback2).toHaveBeenCalledWith('switch.bedroom', expect.any(Object))
    })

    it('should remove subscriber when unsubscribe is called', () => {
      const mockCallback = vi.fn()
      const unsubscribe = wsConnection.subscribe(mockCallback)

      unsubscribe()

      const stateChangeMessage = {
        type: 'event',
        event: {
          event_type: 'state_changed',
          data: {
            entity_id: 'light.living_room',
            new_state: { entity_id: 'light.living_room', state: 'on' }
          }
        }
      }

      mockWS.simulateMessage(stateChangeMessage)

      expect(mockCallback).not.toHaveBeenCalled()
    })

    it('should handle errors in callback functions', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const mockCallback = vi.fn(() => {
        throw new Error('Callback error')
      })
      
      wsConnection.subscribe(mockCallback)

      const stateChangeMessage = {
        type: 'event',
        event: {
          event_type: 'state_changed',
          data: {
            entity_id: 'light.living_room',
            new_state: { entity_id: 'light.living_room', state: 'on' }
          }
        }
      }

      mockWS.simulateMessage(stateChangeMessage)

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error in state change callback:',
        expect.any(Error)
      )

      consoleErrorSpy.mockRestore()
    })

    it('should ignore non-state-change events', () => {
      const mockCallback = vi.fn()
      wsConnection.subscribe(mockCallback)

      mockWS.simulateMessage({
        type: 'event',
        event: {
          event_type: 'other_event',
          data: { some: 'data' }
        }
      })

      expect(mockCallback).not.toHaveBeenCalled()
    })
  })

  describe('Reconnection logic', () => {
    it('should attempt to reconnect on connection close', async () => {
      const connectSpy = vi.spyOn(wsConnection, 'connect')
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
      // Simulate unexpected close
      mockWS.simulateClose()

      // Wait for reconnection attempt
      await new Promise(resolve => setTimeout(resolve, 1100))

      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Attempting to reconnect (1/5)...'
      )
      expect(connectSpy).toHaveBeenCalled()

      connectSpy.mockRestore()
      consoleLogSpy.mockRestore()
    })

    it('should use exponential backoff for reconnection delays', () => {
      vi.useFakeTimers()
      const timeoutSpy = vi.spyOn(global, 'setTimeout')
      
      // Simulate multiple reconnection attempts
      for (let i = 1; i <= 3; i++) {
        wsConnection.reconnectAttempts = i - 1
        wsConnection.scheduleReconnect()
        
        expect(timeoutSpy).toHaveBeenCalledWith(
          expect.any(Function),
          1000 * Math.pow(2, i - 1)
        )
      }

      vi.useRealTimers()
      timeoutSpy.mockRestore()
    })

    it('should stop reconnecting after max attempts', () => {
      wsConnection.reconnectAttempts = 5
      const timeoutSpy = vi.spyOn(global, 'setTimeout')
      
      mockWS.simulateClose()

      expect(timeoutSpy).not.toHaveBeenCalled()

      timeoutSpy.mockRestore()
    })

    it('should not reconnect on normal close (code 1000)', () => {
      const timeoutSpy = vi.spyOn(global, 'setTimeout')
      
      const closeEvent = new CloseEvent('close', { code: 1000 })
      mockWS.addEventListener.mock.calls
        .find(call => call[0] === 'close')[1](closeEvent)

      expect(timeoutSpy).not.toHaveBeenCalled()

      timeoutSpy.mockRestore()
    })
  })

  describe('Connection management', () => {
    it('should return correct connection state', async () => {
      expect(wsConnection.getConnectionState()).toBe(false)

      const connectPromise = wsConnection.connect()
      mockWS.simulateOpen()
      mockWS.simulateMessage({ type: 'auth_required' })
      mockWS.simulateMessage({ type: 'auth_ok' })
      mockWS.simulateMessage({ type: 'result', success: true, id: 2 })
      
      await connectPromise
      expect(wsConnection.getConnectionState()).toBe(true)

      wsConnection.close()
      expect(wsConnection.getConnectionState()).toBe(false)
    })

    it('should close connection and clear subscribers', () => {
      const mockCallback = vi.fn()
      wsConnection.subscribe(mockCallback)

      expect(wsConnection.subscribers.size).toBe(1)

      wsConnection.close()

      expect(mockWS.close).toHaveBeenCalledWith(1000)
      expect(wsConnection.subscribers.size).toBe(0)
      expect(wsConnection.getConnectionState()).toBe(false)
    })

    it('should handle sending messages when not connected', () => {
      mockWS.readyState = 3 // CLOSED
      
      wsConnection.send({ type: 'test' })

      expect(mockWS.send).not.toHaveBeenCalled()
    })

    it('should send messages when connected', async () => {
      const connectPromise = wsConnection.connect()
      mockWS.simulateOpen()
      mockWS.readyState = 1 // OPEN
      mockWS.simulateMessage({ type: 'auth_required' })
      mockWS.simulateMessage({ type: 'auth_ok' })
      mockWS.simulateMessage({ type: 'result', success: true, id: 2 })
      
      await connectPromise

      const testMessage = { type: 'test', data: 'test' }
      wsConnection.send(testMessage)

      expect(mockWS.send).toHaveBeenCalledWith(JSON.stringify(testMessage))
    })
  })

  describe('Message handling edge cases', () => {
    it('should handle unknown message types', () => {
      expect(() => {
        wsConnection.handleMessage({ type: 'unknown_type' }, vi.fn(), vi.fn())
      }).not.toThrow()
    })

    it('should handle malformed state change events', () => {
      const mockCallback = vi.fn()
      wsConnection.subscribe(mockCallback)

      // Missing event data
      mockWS.simulateMessage({
        type: 'event'
      })

      expect(mockCallback).not.toHaveBeenCalled()
    })

    it('should handle result messages', () => {
      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      wsConnection.handleMessage(
        { type: 'result', success: true, id: 2 },
        vi.fn(),
        vi.fn()
      )

      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Successfully subscribed to state changes'
      )

      consoleLogSpy.mockRestore()
    })
  })
})