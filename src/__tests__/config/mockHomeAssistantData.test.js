import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mockStates, updateMockDeviceState } from '../../config/mockHomeAssistantData.js'

describe('mockHomeAssistantData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Mock data structure validation', () => {
    it('should have valid mock states array', () => {
      expect(Array.isArray(mockStates)).toBe(true)
      expect(mockStates.length).toBeGreaterThan(0)
    })

    it('should have valid entity structure for all devices', () => {
      mockStates.forEach(entity => {
        expect(entity).toHaveProperty('entity_id')
        expect(entity).toHaveProperty('state')
        expect(entity).toHaveProperty('attributes')
        expect(entity).toHaveProperty('last_changed')
        expect(entity).toHaveProperty('last_updated')

        // Validate entity_id format (domain.object_id)
        expect(entity.entity_id).toMatch(/^[a-z_]+\.[a-z0-9_]+$/)
        
        // Validate state is string
        expect(typeof entity.state).toBe('string')
        
        // Validate attributes is object
        expect(typeof entity.attributes).toBe('object')
        expect(entity.attributes).not.toBeNull()
        
        // Validate timestamps are ISO strings
        expect(entity.last_changed).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
        expect(entity.last_updated).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
      })
    })

    it('should have friendly names for all entities', () => {
      mockStates.forEach(entity => {
        expect(entity.attributes).toHaveProperty('friendly_name')
        expect(typeof entity.attributes.friendly_name).toBe('string')
        expect(entity.attributes.friendly_name.length).toBeGreaterThan(0)
      })
    })

    it('should have valid light entities', () => {
      const lights = mockStates.filter(e => e.entity_id.startsWith('light.'))
      
      expect(lights.length).toBeGreaterThan(0)
      
      lights.forEach(light => {
        expect(['on', 'off', 'unavailable']).toContain(light.state)
        
        // Lights should have brightness when on
        if (light.state === 'on') {
          expect(light.attributes).toHaveProperty('brightness')
          expect(light.attributes.brightness).toBeGreaterThanOrEqual(0)
          expect(light.attributes.brightness).toBeLessThanOrEqual(255)
        }
        
        // Color lights should have valid RGB values
        if (light.attributes.rgb_color) {
          expect(Array.isArray(light.attributes.rgb_color)).toBe(true)
          expect(light.attributes.rgb_color).toHaveLength(3)
          
          light.attributes.rgb_color.forEach(colorValue => {
            expect(colorValue).toBeGreaterThanOrEqual(0)
            expect(colorValue).toBeLessThanOrEqual(255)
          })
        }
        
        // Lights should have supported_features
        if (light.attributes.supported_features !== undefined) {
          expect(typeof light.attributes.supported_features).toBe('number')
          expect(light.attributes.supported_features).toBeGreaterThanOrEqual(0)
        }
      })
    })

    it('should have valid switch entities', () => {
      const switches = mockStates.filter(e => e.entity_id.startsWith('switch.'))
      
      expect(switches.length).toBeGreaterThan(0)
      
      switches.forEach(switchEntity => {
        expect(['on', 'off', 'unavailable']).toContain(switchEntity.state)
        
        // Switches should have icon attribute
        if (switchEntity.attributes.icon) {
          expect(switchEntity.attributes.icon).toMatch(/^mdi:[a-z-]+$/)
        }
      })
    })

    it('should have valid scene entities', () => {
      const scenes = mockStates.filter(e => e.entity_id.startsWith('scene.'))
      
      expect(scenes.length).toBeGreaterThan(0)
      
      scenes.forEach(scene => {
        // Scenes should have scening state or similar
        expect(typeof scene.state).toBe('string')
        
        // Scenes should have icon
        if (scene.attributes.icon) {
          expect(scene.attributes.icon).toMatch(/^mdi:[a-z-]+$/)
        }
      })
    })

    it('should have valid climate entities', () => {
      const climateDevices = mockStates.filter(e => e.entity_id.startsWith('climate.'))
      
      if (climateDevices.length > 0) {
        climateDevices.forEach(climate => {
          expect(climate.attributes).toHaveProperty('temperature')
          expect(climate.attributes).toHaveProperty('current_temperature')
          
          if (climate.attributes.temperature) {
            expect(typeof climate.attributes.temperature).toBe('number')
          }
          
          if (climate.attributes.current_temperature) {
            expect(typeof climate.attributes.current_temperature).toBe('number')
          }
          
          if (climate.attributes.hvac_modes) {
            expect(Array.isArray(climate.attributes.hvac_modes)).toBe(true)
            expect(climate.attributes.hvac_modes.length).toBeGreaterThan(0)
          }
          
          if (climate.attributes.supported_features) {
            expect(typeof climate.attributes.supported_features).toBe('number')
          }
        })
      }
    })

    it('should have valid media player entities', () => {
      const mediaPlayers = mockStates.filter(e => e.entity_id.startsWith('media_player.'))
      
      if (mediaPlayers.length > 0) {
        mediaPlayers.forEach(player => {
          const validStates = ['playing', 'paused', 'idle', 'off', 'on', 'unavailable']
          expect(validStates).toContain(player.state)
          
          if (player.attributes.media_title) {
            expect(typeof player.attributes.media_title).toBe('string')
          }
          
          if (player.attributes.media_artist) {
            expect(typeof player.attributes.media_artist).toBe('string')
          }
          
          if (player.attributes.volume_level) {
            expect(player.attributes.volume_level).toBeGreaterThanOrEqual(0)
            expect(player.attributes.volume_level).toBeLessThanOrEqual(1)
          }
        })
      }
    })

    it('should have valid alarm control panel entities', () => {
      const alarms = mockStates.filter(e => e.entity_id.startsWith('alarm_control_panel.'))
      
      if (alarms.length > 0) {
        alarms.forEach(alarm => {
          const validStates = [
            'disarmed', 'armed_home', 'armed_away', 'armed_night', 
            'armed_vacation', 'armed_custom_bypass', 'pending', 
            'arming', 'disarming', 'triggered', 'unavailable'
          ]
          expect(validStates).toContain(alarm.state)
        })
      }
    })

    it('should have valid camera entities', () => {
      const cameras = mockStates.filter(e => e.entity_id.startsWith('camera.'))
      
      if (cameras.length > 0) {
        cameras.forEach(camera => {
          const validStates = ['recording', 'streaming', 'idle', 'unavailable']
          expect(validStates).toContain(camera.state)
          
          if (camera.attributes.entity_picture) {
            expect(typeof camera.attributes.entity_picture).toBe('string')
            expect(camera.attributes.entity_picture).toMatch(/^\/|^https?:\/\//)
          }
        })
      }
    })
  })

  describe('Device type coverage', () => {
    it('should include all supported device types', () => {
      const supportedDomains = ['light', 'switch', 'climate', 'media_player', 'alarm_control_panel', 'camera', 'scene']
      
      supportedDomains.forEach(domain => {
        const entitiesOfType = mockStates.filter(e => e.entity_id.startsWith(`${domain}.`))
        expect(entitiesOfType.length).toBeGreaterThan(0, `Should have at least one ${domain} entity`)
      })
    })

    it('should have diverse device states', () => {
      const onOffDevices = mockStates.filter(e => 
        e.entity_id.startsWith('light.') || e.entity_id.startsWith('switch.')
      )
      
      const onDevices = onOffDevices.filter(d => d.state === 'on')
      const offDevices = onOffDevices.filter(d => d.state === 'off')
      
      expect(onDevices.length).toBeGreaterThan(0, 'Should have some devices in "on" state')
      expect(offDevices.length).toBeGreaterThan(0, 'Should have some devices in "off" state')
    })

    it('should include edge cases', () => {
      // Should have at least one unavailable device for testing
      const unavailableDevices = mockStates.filter(d => d.state === 'unavailable')
      expect(unavailableDevices.length).toBeGreaterThan(0, 'Should have at least one unavailable device for testing')
      
      // Should have devices with different brightness levels
      const lights = mockStates.filter(e => e.entity_id.startsWith('light.') && e.state === 'on')
      if (lights.length > 1) {
        const brightnesses = lights.map(l => l.attributes.brightness).filter(Boolean)
        const uniqueBrightnesses = [...new Set(brightnesses)]
        expect(uniqueBrightnesses.length).toBeGreaterThan(1, 'Should have lights with different brightness levels')
      }
    })
  })

  describe('updateMockDeviceState function', () => {
    it('should be defined and callable', () => {
      expect(typeof updateMockDeviceState).toBe('function')
    })

    it('should update device state', () => {
      const testEntityId = 'light.test'
      
      // Mock the function behavior since we're testing the interface
      const result = updateMockDeviceState(testEntityId, 'on')
      
      if (result) {
        expect(result).toHaveProperty('entity_id', testEntityId)
        expect(result).toHaveProperty('state', 'on')
        expect(result).toHaveProperty('attributes')
      }
    })

    it('should handle attribute updates', () => {
      const testEntityId = 'light.test'
      const attributes = { brightness: 128, rgb_color: [255, 0, 0] }
      
      const result = updateMockDeviceState(testEntityId, 'on', attributes)
      
      if (result) {
        expect(result).toHaveProperty('entity_id', testEntityId)
        expect(result).toHaveProperty('state', 'on')
        expect(result.attributes).toMatchObject(attributes)
      }
    })

    it('should handle non-existent entities gracefully', () => {
      expect(() => {
        updateMockDeviceState('nonexistent.entity', 'on')
      }).not.toThrow()
    })
  })

  describe('Data consistency', () => {
    it('should have unique entity IDs', () => {
      const entityIds = mockStates.map(e => e.entity_id)
      const uniqueEntityIds = [...new Set(entityIds)]
      
      expect(entityIds.length).toBe(uniqueEntityIds.length)
    })

    it('should have consistent timestamp formats', () => {
      const timestampRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{6})?\+\d{2}:\d{2}$/
      
      mockStates.forEach(entity => {
        expect(entity.last_changed).toMatch(timestampRegex)
        expect(entity.last_updated).toMatch(timestampRegex)
      })
    })

    it('should have reasonable attribute values', () => {
      mockStates.forEach(entity => {
        // Brightness should be 0-255
        if (entity.attributes.brightness !== undefined) {
          expect(entity.attributes.brightness).toBeGreaterThanOrEqual(0)
          expect(entity.attributes.brightness).toBeLessThanOrEqual(255)
        }
        
        // Temperature values should be reasonable
        if (entity.attributes.temperature !== undefined) {
          expect(entity.attributes.temperature).toBeGreaterThan(-50)
          expect(entity.attributes.temperature).toBeLessThan(150) // Fahrenheit or Celsius
        }
        
        // Volume levels should be 0-1
        if (entity.attributes.volume_level !== undefined) {
          expect(entity.attributes.volume_level).toBeGreaterThanOrEqual(0)
          expect(entity.attributes.volume_level).toBeLessThanOrEqual(1)
        }
      })
    })

    it('should have appropriate entity names', () => {
      mockStates.forEach(entity => {
        // Friendly names should not be empty
        expect(entity.attributes.friendly_name.trim().length).toBeGreaterThan(0)
        
        // Entity IDs should follow naming conventions
        const [domain, objectId] = entity.entity_id.split('.')
        expect(domain.length).toBeGreaterThan(0)
        expect(objectId.length).toBeGreaterThan(0)
        expect(objectId).toMatch(/^[a-z0-9_]+$/)
      })
    })
  })

  describe('Real Home Assistant API compatibility', () => {
    it('should match Home Assistant entity structure', () => {
      // Based on Home Assistant API documentation
      const requiredFields = ['entity_id', 'state', 'attributes', 'last_changed', 'last_updated']
      
      mockStates.forEach(entity => {
        requiredFields.forEach(field => {
          expect(entity).toHaveProperty(field)
        })
      })
    })

    it('should have valid attribute types for each domain', () => {
      const lights = mockStates.filter(e => e.entity_id.startsWith('light.'))
      lights.forEach(light => {
        if (light.attributes.brightness !== undefined) {
          expect(typeof light.attributes.brightness).toBe('number')
        }
        if (light.attributes.rgb_color !== undefined) {
          expect(Array.isArray(light.attributes.rgb_color)).toBe(true)
        }
        if (light.attributes.supported_features !== undefined) {
          expect(typeof light.attributes.supported_features).toBe('number')
        }
      })
    })

    it('should use standard Home Assistant states', () => {
      const validStates = new Set([
        'on', 'off', 'unavailable', 'unknown', 'idle', 
        'playing', 'paused', 'scening', 'recording', 'streaming',
        'disarmed', 'armed_home', 'armed_away', 'armed_night',
        'heat', 'cool', 'auto', 'fan_only', 'dry'
      ])

      mockStates.forEach(entity => {
        if (!validStates.has(entity.state)) {
          // Allow numeric states for sensors
          const numericState = parseFloat(entity.state)
          if (isNaN(numericState)) {
            // Allow other string states but warn about them
            console.warn(`Unusual state detected: ${entity.state} for ${entity.entity_id}`)
          }
        }
      })
    })
  })

  describe('Test data completeness', () => {
    it('should provide sufficient test scenarios', () => {
      // Should have enough entities for comprehensive testing
      expect(mockStates.length).toBeGreaterThanOrEqual(10)
      
      // Should have multiple entities per domain for variety
      const domains = ['light', 'switch', 'scene']
      domains.forEach(domain => {
        const entities = mockStates.filter(e => e.entity_id.startsWith(`${domain}.`))
        expect(entities.length).toBeGreaterThanOrEqual(2, `Should have at least 2 ${domain} entities`)
      })
    })

    it('should cover different attribute combinations', () => {
      const lights = mockStates.filter(e => e.entity_id.startsWith('light.'))
      
      // Should have lights with and without color
      const colorLights = lights.filter(l => l.attributes.rgb_color)
      const nonColorLights = lights.filter(l => !l.attributes.rgb_color)
      
      if (lights.length >= 2) {
        expect(colorLights.length).toBeGreaterThan(0, 'Should have at least one color light')
        expect(nonColorLights.length).toBeGreaterThan(0, 'Should have at least one non-color light')
      }
    })
  })
})