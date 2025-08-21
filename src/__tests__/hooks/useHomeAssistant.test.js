import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useHomeAssistant } from '../../hooks/useHomeAssistant.js'
import { haApi } from '../../services/homeAssistant.js'
import { createWebSocketConnection } from '../../services/haWebSocket.js'
import { mockStates, updateMockDeviceState } from '../../config/mockHomeAssistantData.js'

// Mock the services
vi.mock('../../services/homeAssistant.js')
vi.mock('../../services/haWebSocket.js')
vi.mock('../../config/mockHomeAssistantData.js')

// Mock environment variables
const mockEnv = (env = {}) => {
  Object.keys(env).forEach(key => {
    import.meta.env[key] = env[key]
  })
}

describe('useHomeAssistant hook', () => {
  const mockWebSocket = {
    connect: vi.fn(),
    close: vi.fn(),
    subscribe: vi.fn(),
    getConnectionState: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock WebSocket creation
    createWebSocketConnection.mockReturnValue(mockWebSocket)
    mockWebSocket.connect.mockResolvedValue()
    mockWebSocket.subscribe.mockReturnValue(vi.fn())
    mockWebSocket.getConnectionState.mockReturnValue(true)

    // Mock API responses
    haApi.getStates.mockResolvedValue([])
    haApi.toggleDevice.mockResolvedValue({ success: true })
    haApi.setDeviceAttributes.mockResolvedValue({ success: true })
    haApi.activateScene.mockResolvedValue({ success: true })
    haApi.turnOffDevice.mockResolvedValue({ success: true })
    haApi.callService.mockResolvedValue({ success: true })

    // Mock data
    mockStates.splice(0) // Clear array
    mockStates.push(
      {
        entity_id: 'light.living_room',
        state: 'on',
        attributes: { friendly_name: 'Living Room Light', brightness: 255 }
      },
      {
        entity_id: 'switch.bedroom',
        state: 'off',
        attributes: { friendly_name: 'Bedroom Switch' }
      },
      {
        entity_id: 'scene.movie_night',
        state: 'scening',
        attributes: { friendly_name: 'Movie Night' }
      },
      {
        entity_id: 'sensor.temperature',
        state: '72',
        attributes: { friendly_name: 'Temperature Sensor' }
      }
    )

    updateMockDeviceState.mockImplementation((entityId, newState, attributes) => ({
      entity_id: entityId,
      state: newState,
      attributes: { ...attributes }
    }))

    // Reset environment
    import.meta.env.VITE_USE_MOCK_HA = 'true'
    import.meta.env.VITE_HA_BASE_URL = 'http://localhost:8123'
    import.meta.env.VITE_HA_TOKEN = ''
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Initialization', () => {
    it('should initialize with loading state', async () => {
      const { result } = renderHook(() => useHomeAssistant())

      // Initial state should be loading
      expect(result.current.loading).toBe(true)
      expect(result.current.devices).toEqual([])
      expect(result.current.scenes).toEqual([])
      
      // Don't check error immediately - React batches state updates
      // Error should be null after initialization completes
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })
      
      expect(result.current.error).toBe(null)
    })

    it('should load mock data when VITE_USE_MOCK_HA is true', async () => {
      const { result } = renderHook(() => useHomeAssistant())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.devices).toHaveLength(2) // light and switch
      expect(result.current.scenes).toHaveLength(1) // scene
      expect(result.current.devices[0].entity_id).toBe('light.living_room')
      expect(result.current.scenes[0].entity_id).toBe('scene.movie_night')
      expect(haApi.getStates).not.toHaveBeenCalled()
    })

    it('should load live data when useMockData is false', async () => {
      const liveStates = [
        { entity_id: 'light.kitchen', state: 'on' },
        { entity_id: 'scene.dinner', state: 'scening' }
      ]
      haApi.getStates.mockResolvedValue(liveStates)

      const { result } = renderHook(() => useHomeAssistant({ 
        useMockData: false,
        baseUrl: 'http://homeassistant.local:8123',
        token: 'test_token_123'
      }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(haApi.getStates).toHaveBeenCalledWith('http://homeassistant.local:8123', 'test_token_123')
      expect(result.current.devices).toHaveLength(1)
      expect(result.current.scenes).toHaveLength(1)
    })

    it('should handle API errors during initialization', async () => {
      const error = new Error('API Error')
      haApi.getStates.mockRejectedValue(error)

      const { result } = renderHook(() => useHomeAssistant({ 
        useMockData: false,
        baseUrl: 'http://homeassistant.local:8123',
        token: 'test_token_123'
      }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe(error)
      expect(result.current.devices).toEqual([])
      expect(result.current.scenes).toEqual([])
    })
  })

  describe('Device filtering', () => {
    it('should filter only supported device types', async () => {
      const states = [
        { entity_id: 'light.living_room', state: 'on' },
        { entity_id: 'switch.bedroom', state: 'off' },
        { entity_id: 'climate.thermostat', state: 'heat' },
        { entity_id: 'media_player.spotify', state: 'playing' },
        { entity_id: 'alarm_control_panel.main', state: 'armed' },
        { entity_id: 'camera.front_door', state: 'streaming' },
        { entity_id: 'sensor.temperature', state: '72' }, // Should be filtered out
        { entity_id: 'binary_sensor.door', state: 'on' }, // Should be filtered out
        { entity_id: 'scene.movie_night', state: 'scening' }
      ]
      haApi.getStates.mockResolvedValue(states)

      const { result } = renderHook(() => useHomeAssistant({ 
        useMockData: false,
        baseUrl: 'http://homeassistant.local:8123',
        token: 'test_token_123'
      }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.devices).toHaveLength(6) // All supported devices
      expect(result.current.scenes).toHaveLength(1)
      
      const deviceTypes = result.current.devices.map(d => d.entity_id.split('.')[0])
      expect(deviceTypes).toContain('light')
      expect(deviceTypes).toContain('switch')
      expect(deviceTypes).toContain('climate')
      expect(deviceTypes).toContain('media_player')
      expect(deviceTypes).toContain('alarm_control_panel')
      expect(deviceTypes).toContain('camera')
      expect(deviceTypes).not.toContain('sensor')
      expect(deviceTypes).not.toContain('binary_sensor')
    })
  })

  describe('WebSocket connection', () => {
    it('should setup WebSocket for live data', async () => {
      const { result } = renderHook(() => useHomeAssistant({ 
        useMockData: false,
        baseUrl: 'http://test.local',
        token: 'test-token'
      }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(createWebSocketConnection).toHaveBeenCalledWith('http://test.local', 'test-token')
      expect(mockWebSocket.connect).toHaveBeenCalled()
      expect(mockWebSocket.subscribe).toHaveBeenCalled()
    })

    it('should not setup WebSocket for mock data', async () => {
      const { result } = renderHook(() => useHomeAssistant({ useMockData: true }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(createWebSocketConnection).not.toHaveBeenCalled()
    })

    it('should handle WebSocket connection errors', async () => {
      const error = new Error('WebSocket Error')
      mockWebSocket.connect.mockRejectedValue(error)

      const { result } = renderHook(() => useHomeAssistant({ 
        useMockData: false,
        baseUrl: 'http://test.local',
        token: 'test-token'
      }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe(error)
    })

    it('should update device state from WebSocket', async () => {
      let subscribeCallback
      mockWebSocket.subscribe.mockImplementation((callback) => {
        subscribeCallback = callback
        return vi.fn()
      })

      // Initial load with a device - must be set before hook creation
      haApi.getStates.mockResolvedValue([
        { entity_id: 'light.living_room', state: 'off', attributes: { brightness: 0 } }
      ])

      const { result } = renderHook(() => useHomeAssistant({ 
        useMockData: false,
        baseUrl: 'http://test.local',
        token: 'test-token'
      }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await waitFor(() => {
        expect(result.current.devices).toHaveLength(1)
      })

      expect(result.current.devices[0].state).toBe('off')

      // Simulate WebSocket update
      act(() => {
        subscribeCallback('light.living_room', {
          entity_id: 'light.living_room',
          state: 'on',
          attributes: { brightness: 255 }
        })
      })

      await waitFor(() => {
        expect(result.current.devices[0]?.state).toBe('on')
      })
      expect(result.current.devices[0].attributes.brightness).toBe(255)
    })

    it('should update scene state from WebSocket', async () => {
      let subscribeCallback
      mockWebSocket.subscribe.mockImplementation((callback) => {
        subscribeCallback = callback
        return vi.fn()
      })

      // Set up scene data before hook creation
      haApi.getStates.mockResolvedValue([
        { entity_id: 'scene.movie_night', state: 'scening' }
      ])

      const { result } = renderHook(() => useHomeAssistant({ 
        useMockData: false,
        baseUrl: 'http://test.local',
        token: 'test-token'
      }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await waitFor(() => {
        expect(result.current.scenes).toHaveLength(1)
      })

      act(() => {
        subscribeCallback('scene.movie_night', {
          entity_id: 'scene.movie_night',
          state: 'scening',
          last_changed: '2024-01-01T12:00:00Z'
        })
      })

      await waitFor(() => {
        expect(result.current.scenes[0]?.last_changed).toBe('2024-01-01T12:00:00Z')
      })
    })

    it('should ignore WebSocket updates for null states', async () => {
      let subscribeCallback
      mockWebSocket.subscribe.mockImplementation((callback) => {
        subscribeCallback = callback
        return vi.fn()
      })

      const { result } = renderHook(() => useHomeAssistant({ 
        useMockData: false,
        baseUrl: 'http://test.local',
        token: 'test-token'
      }))

      haApi.getStates.mockResolvedValue([
        { entity_id: 'light.living_room', state: 'off' }
      ])

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const originalState = result.current.devices[0]?.state

      act(() => {
        subscribeCallback('light.living_room', null)
      })

      // Wait a bit to ensure any potential state changes would have occurred
      await new Promise(resolve => setTimeout(resolve, 10))
      
      expect(result.current.devices[0]?.state).toBe(originalState)
    })
  })

  describe('Device actions - Mock mode', () => {
    it('should toggle device in mock mode', async () => {
      const { result } = renderHook(() => useHomeAssistant())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const mockDevice = { entity_id: 'light.living_room', state: 'on' }
      updateMockDeviceState.mockReturnValue({ ...mockDevice, state: 'off' })

      await act(async () => {
        await result.current.toggleDevice('light.living_room')
      })

      expect(updateMockDeviceState).toHaveBeenCalledWith('light.living_room', 'off')
      expect(haApi.toggleDevice).not.toHaveBeenCalled()
    })

    it('should update device attributes in mock mode', async () => {
      const { result } = renderHook(() => useHomeAssistant())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const attributes = { brightness: 128 }
      updateMockDeviceState.mockReturnValue({
        entity_id: 'light.living_room',
        state: 'on',
        attributes
      })

      await act(async () => {
        await result.current.updateDevice('light.living_room', attributes)
      })

      expect(updateMockDeviceState).toHaveBeenCalledWith('light.living_room', 'on', attributes)
      expect(haApi.setDeviceAttributes).not.toHaveBeenCalled()
    })

    it('should turn off device in mock mode', async () => {
      const { result } = renderHook(() => useHomeAssistant())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      updateMockDeviceState.mockReturnValue({
        entity_id: 'light.living_room',
        state: 'off'
      })

      await act(async () => {
        await result.current.turnOffDevice('light.living_room')
      })

      expect(updateMockDeviceState).toHaveBeenCalledWith('light.living_room', 'off')
      expect(haApi.turnOffDevice).not.toHaveBeenCalled()
    })

    it('should activate scene in mock mode', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const { result } = renderHook(() => useHomeAssistant())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await act(async () => {
        await result.current.activateScene('scene.movie_night')
      })

      expect(consoleSpy).toHaveBeenCalledWith('Mock: Activating scene scene.movie_night')
      expect(haApi.activateScene).not.toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('should call service in mock mode', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const { result } = renderHook(() => useHomeAssistant())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const serviceData = { temperature: 72 }

      await act(async () => {
        await result.current.callService('climate', 'set_temperature', serviceData)
      })

      expect(consoleSpy).toHaveBeenCalledWith(
        'Mock: Calling service climate.set_temperature',
        serviceData
      )
      expect(haApi.callService).not.toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('Device actions - Live mode', () => {
    it('should toggle device in live mode', async () => {
      const { result } = renderHook(() => useHomeAssistant({ 
        useMockData: false,
        baseUrl: 'http://test.local',
        token: 'test-token'
      }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await act(async () => {
        await result.current.toggleDevice('light.living_room')
      })

      expect(haApi.toggleDevice).toHaveBeenCalledWith(
        'http://test.local',
        'test-token',
        'light.living_room'
      )
    })

    it('should update device attributes in live mode', async () => {
      const { result } = renderHook(() => useHomeAssistant({ 
        useMockData: false,
        baseUrl: 'http://test.local',
        token: 'test-token'
      }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const attributes = { brightness: 128 }

      await act(async () => {
        await result.current.updateDevice('light.living_room', attributes)
      })

      expect(haApi.setDeviceAttributes).toHaveBeenCalledWith(
        'http://test.local',
        'test-token',
        'light.living_room',
        attributes
      )
    })

    it('should handle action errors in live mode', async () => {
      const error = new Error('Device action failed')
      haApi.toggleDevice.mockRejectedValue(error)

      const { result } = renderHook(() => useHomeAssistant({ 
        useMockData: false,
        baseUrl: 'http://test.local',
        token: 'test-token'
      }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await act(async () => {
        await result.current.toggleDevice('light.living_room')
      })

      expect(result.current.error).toBe(error)
    })
  })

  describe('State refresh', () => {
    it('should refresh states when requested', async () => {
      const { result } = renderHook(() => useHomeAssistant({ 
        useMockData: false,
        baseUrl: 'http://homeassistant.local:8123',
        token: 'test_token_123'
      }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(haApi.getStates).toHaveBeenCalledTimes(1)

      await act(async () => {
        result.current.refreshStates()
      })

      await waitFor(() => {
        expect(haApi.getStates).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('Connection state', () => {
    it('should return true for mock data', async () => {
      const { result } = renderHook(() => useHomeAssistant())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.isConnected).toBe(true)
    })

    it('should return WebSocket connection state for live data', async () => {
      mockWebSocket.getConnectionState.mockReturnValue(false)

      const { result } = renderHook(() => useHomeAssistant({ 
        useMockData: false,
        baseUrl: 'http://test.local',
        token: 'test-token'
      }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.isConnected).toBe(false)
    })
  })

  describe('Cleanup', () => {
    it('should cleanup WebSocket on unmount', async () => {
      const unsubscribeFn = vi.fn()
      mockWebSocket.subscribe.mockReturnValue(unsubscribeFn)

      const { result, unmount } = renderHook(() => useHomeAssistant({ 
        useMockData: false,
        baseUrl: 'http://test.local',
        token: 'test-token'
      }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      unmount()

      expect(unsubscribeFn).toHaveBeenCalled()
      expect(mockWebSocket.close).toHaveBeenCalled()
    })

    it('should clear reconnect timeout on unmount', async () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')
      
      const { result, unmount } = renderHook(() => useHomeAssistant())

      // Wait for initialization to complete (so timeout is set)
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      unmount()

      expect(clearTimeoutSpy).toHaveBeenCalled()

      clearTimeoutSpy.mockRestore()
    })
  })

  describe('Configuration', () => {
    it('should use provided configuration', async () => {
      const config = {
        baseUrl: 'https://custom.local:8123',
        token: 'custom-token',
        useMockData: false
      }

      const { result } = renderHook(() => useHomeAssistant(config))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(haApi.getStates).toHaveBeenCalledWith(
        'https://custom.local:8123',
        'custom-token'
      )
    })

    it('should use environment variables as defaults', async () => {
      mockEnv({
        VITE_HA_BASE_URL: 'http://env.local',
        VITE_HA_TOKEN: 'env-token'
      })

      const { result } = renderHook(() => useHomeAssistant({ useMockData: false }))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(haApi.getStates).toHaveBeenCalledWith('http://env.local', 'env-token')
    })
  })
})