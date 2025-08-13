import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { haApi } from '../../services/homeAssistant.js'
import { mockFetchResponse } from '../../test/utils.js'

describe('homeAssistant service', () => {
  const mockBaseUrl = 'http://homeassistant.local:8123'
  const mockToken = 'test_token_123'
  const mockEntityId = 'light.living_room'

  beforeEach(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('getStates', () => {
    it('should fetch all states successfully', async () => {
      const mockStates = [
        { entity_id: 'light.living_room', state: 'on' },
        { entity_id: 'switch.bedroom', state: 'off' }
      ]
      
      global.fetch.mockResolvedValue(mockFetchResponse(mockStates))

      const result = await haApi.getStates(mockBaseUrl, mockToken)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://homeassistant.local:8123/api/states',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test_token_123'
          }
        }
      )
      expect(result).toEqual(mockStates)
    })

    it('should handle HTTP errors', async () => {
      global.fetch.mockResolvedValue(mockFetchResponse({}, false, 401))

      await expect(haApi.getStates(mockBaseUrl, mockToken))
        .rejects.toThrow('API request failed: HTTP 401: Unauthorized')
    })

    it('should handle network errors', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'))

      await expect(haApi.getStates(mockBaseUrl, mockToken))
        .rejects.toThrow('API request failed: Network error')
    })
  })

  describe('toggleDevice', () => {
    it('should toggle a light successfully', async () => {
      const mockResponse = { success: true }
      global.fetch.mockResolvedValue(mockFetchResponse(mockResponse))

      const result = await haApi.toggleDevice(mockBaseUrl, mockToken, 'light.living_room')

      expect(global.fetch).toHaveBeenCalledWith(
        'http://homeassistant.local:8123/api/services/light/toggle',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test_token_123'
          },
          body: JSON.stringify({ entity_id: 'light.living_room' })
        }
      )
      expect(result).toEqual(mockResponse)
    })

    it('should toggle a switch successfully', async () => {
      const mockResponse = { success: true }
      global.fetch.mockResolvedValue(mockFetchResponse(mockResponse))

      await haApi.toggleDevice(mockBaseUrl, mockToken, 'switch.bedroom')

      expect(global.fetch).toHaveBeenCalledWith(
        'http://homeassistant.local:8123/api/services/switch/toggle',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ entity_id: 'switch.bedroom' })
        })
      )
    })

    it('should handle toggle errors', async () => {
      global.fetch.mockResolvedValue(mockFetchResponse({}, false, 500))

      await expect(haApi.toggleDevice(mockBaseUrl, mockToken, mockEntityId))
        .rejects.toThrow('API request failed: HTTP 500: Internal Server Error')
    })
  })

  describe('setDeviceAttributes', () => {
    it('should set light brightness and color', async () => {
      const mockResponse = { success: true }
      const attributes = {
        brightness: 128,
        rgb_color: [255, 255, 255]
      }
      global.fetch.mockResolvedValue(mockFetchResponse(mockResponse))

      const result = await haApi.setDeviceAttributes(mockBaseUrl, mockToken, 'light.living_room', attributes)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://homeassistant.local:8123/api/services/light/turn_on',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test_token_123'
          },
          body: JSON.stringify({
            entity_id: 'light.living_room',
            brightness: 128,
            rgb_color: [255, 255, 255]
          })
        }
      )
      expect(result).toEqual(mockResponse)
    })

    it('should handle empty attributes', async () => {
      const mockResponse = { success: true }
      global.fetch.mockResolvedValue(mockFetchResponse(mockResponse))

      await haApi.setDeviceAttributes(mockBaseUrl, mockToken, 'light.living_room', {})

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: JSON.stringify({ entity_id: 'light.living_room' })
        })
      )
    })
  })

  describe('activateScene', () => {
    it('should activate a scene successfully', async () => {
      const mockResponse = { success: true }
      global.fetch.mockResolvedValue(mockFetchResponse(mockResponse))

      const result = await haApi.activateScene(mockBaseUrl, mockToken, 'scene.movie_night')

      expect(global.fetch).toHaveBeenCalledWith(
        'http://homeassistant.local:8123/api/services/scene/turn_on',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test_token_123'
          },
          body: JSON.stringify({ entity_id: 'scene.movie_night' })
        }
      )
      expect(result).toEqual(mockResponse)
    })

    it('should handle scene activation errors', async () => {
      global.fetch.mockResolvedValue(mockFetchResponse({}, false, 404))

      await expect(haApi.activateScene(mockBaseUrl, mockToken, 'scene.nonexistent'))
        .rejects.toThrow('API request failed: HTTP 404: Not Found')
    })
  })

  describe('turnOffDevice', () => {
    it('should turn off a device successfully', async () => {
      const mockResponse = { success: true }
      global.fetch.mockResolvedValue(mockFetchResponse(mockResponse))

      const result = await haApi.turnOffDevice(mockBaseUrl, mockToken, 'light.living_room')

      expect(global.fetch).toHaveBeenCalledWith(
        'http://homeassistant.local:8123/api/services/light/turn_off',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test_token_123'
          },
          body: JSON.stringify({ entity_id: 'light.living_room' })
        }
      )
      expect(result).toEqual(mockResponse)
    })
  })

  describe('callService', () => {
    it('should call a generic service successfully', async () => {
      const mockResponse = { success: true }
      const serviceData = {
        entity_id: 'climate.living_room',
        temperature: 72
      }
      global.fetch.mockResolvedValue(mockFetchResponse(mockResponse))

      const result = await haApi.callService(mockBaseUrl, mockToken, 'climate', 'set_temperature', serviceData)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://homeassistant.local:8123/api/services/climate/set_temperature',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test_token_123'
          },
          body: JSON.stringify(serviceData)
        }
      )
      expect(result).toEqual(mockResponse)
    })

    it('should handle empty service data', async () => {
      const mockResponse = { success: true }
      global.fetch.mockResolvedValue(mockFetchResponse(mockResponse))

      await haApi.callService(mockBaseUrl, mockToken, 'homeassistant', 'restart')

      expect(global.fetch).toHaveBeenCalledWith(
        'http://homeassistant.local:8123/api/services/homeassistant/restart',
        expect.objectContaining({
          body: JSON.stringify({})
        })
      )
    })
  })

  describe('API URL construction', () => {
    it('should handle base URL with trailing slash', async () => {
      global.fetch.mockResolvedValue(mockFetchResponse([]))

      await haApi.getStates('http://homeassistant.local:8123/', mockToken)

      expect(global.fetch).toHaveBeenCalledWith(
        'http://homeassistant.local:8123/api/states',
        expect.any(Object)
      )
    })

    it('should handle HTTPS URLs', async () => {
      global.fetch.mockResolvedValue(mockFetchResponse([]))

      await haApi.getStates('https://homeassistant.example.com', mockToken)

      expect(global.fetch).toHaveBeenCalledWith(
        'https://homeassistant.example.com/api/states',
        expect.any(Object)
      )
    })
  })

  describe('Response handling', () => {
    it('should handle non-JSON responses', async () => {
      const textResponse = 'Success'
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: {
          get: vi.fn().mockReturnValue('text/plain')
        },
        text: vi.fn().mockResolvedValue(textResponse),
        json: vi.fn()
      })

      const result = await haApi.getStates(mockBaseUrl, mockToken)

      expect(result).toBe(textResponse)
    })

    it('should handle responses without content-type header', async () => {
      const jsonResponse = { success: true }
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: {
          get: vi.fn().mockReturnValue(null)
        },
        text: vi.fn().mockResolvedValue(JSON.stringify(jsonResponse)),
        json: vi.fn()
      })

      const result = await haApi.getStates(mockBaseUrl, mockToken)

      expect(result).toBe(JSON.stringify(jsonResponse))
    })
  })

  describe('Authentication', () => {
    it('should include Bearer token in all requests', async () => {
      global.fetch.mockResolvedValue(mockFetchResponse({}))

      await haApi.getStates(mockBaseUrl, 'custom_token_456')

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer custom_token_456'
          })
        })
      )
    })

    it('should handle empty token', async () => {
      global.fetch.mockResolvedValue(mockFetchResponse({}))

      await haApi.getStates(mockBaseUrl, '')

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer '
          })
        })
      )
    })
  })
})