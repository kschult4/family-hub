import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useWidgetConfig } from '../../hooks/useWidgetConfig.js'

describe('useWidgetConfig hook', () => {
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    global.localStorage = mockLocalStorage
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Initialization', () => {
    it('should initialize with default Pi layout when no stored data', async () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      const { result } = renderHook(() => useWidgetConfig('pi'))

      expect(result.current.loading).toBe(false)
      expect(result.current.layout).toHaveLength(5) // Default Pi layout
      expect(result.current.error).toBe(null)

      // Verify default Pi layout structure
      const widgetTypes = result.current.layout.map(w => w.type)
      expect(widgetTypes).toContain('lights')
      expect(widgetTypes).toContain('scenes')
      expect(widgetTypes).toContain('climate')
      expect(widgetTypes).toContain('media')
      expect(widgetTypes).toContain('security')
    })

    it('should initialize with default PWA layout', async () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      const { result } = renderHook(() => useWidgetConfig('pwa'))

      expect(result.current.layout).toHaveLength(5) // Default PWA layout

      // PWA layout should have full width widgets (w: 12)
      expect(result.current.layout.every(w => w.w === 12)).toBe(true)
    })

    it('should load stored layout from localStorage', async () => {
      const storedLayout = [
        { id: 'custom', type: 'lights', x: 0, y: 0, w: 8, h: 4 }
      ]
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedLayout))

      const { result } = renderHook(() => useWidgetConfig('pi'))

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('home-dashboard-layout-pi')
      expect(result.current.layout).toEqual(storedLayout)
    })

    it('should handle corrupted localStorage data', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockLocalStorage.getItem.mockReturnValue('invalid-json')

      const { result } = renderHook(() => useWidgetConfig('pi'))

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error loading widget layout:',
        expect.any(SyntaxError)
      )
      expect(result.current.layout).toHaveLength(5) // Falls back to default

      consoleErrorSpy.mockRestore()
    })

    it('should handle non-array stored data', async () => {
      mockLocalStorage.getItem.mockReturnValue('{"not": "an-array"}')

      const { result } = renderHook(() => useWidgetConfig('pi'))

      expect(result.current.layout).toHaveLength(5) // Falls back to default
    })

    it('should use correct storage key for different interface types', async () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      renderHook(() => useWidgetConfig('pwa'))
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('home-dashboard-layout-pwa')

      renderHook(() => useWidgetConfig('pi'))
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('home-dashboard-layout-pi')
    })
  })

  describe('Layout management', () => {
    it('should save layout to localStorage and update state', async () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      const { result } = renderHook(() => useWidgetConfig('pi'))

      const newLayout = [
        { id: 'test', type: 'lights', x: 0, y: 0, w: 6, h: 4 }
      ]

      act(() => {
        result.current.saveLayout(newLayout)
      })

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'home-dashboard-layout-pi',
        JSON.stringify(newLayout)
      )
      expect(result.current.layout).toEqual(newLayout)
      expect(result.current.error).toBe(null)
    })

    it('should handle storage errors when saving', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const storageError = new Error('Storage full')
      mockLocalStorage.setItem.mockImplementation(() => {
        throw storageError
      })
      mockLocalStorage.getItem.mockReturnValue(null)

      const { result } = renderHook(() => useWidgetConfig('pi'))

      const newLayout = [{ id: 'test', type: 'lights', x: 0, y: 0, w: 6, h: 4 }]

      act(() => {
        result.current.saveLayout(newLayout)
      })

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error saving layout:', storageError)
      expect(result.current.error).toBe(storageError)

      consoleErrorSpy.mockRestore()
    })

    it('should reset to default layout', async () => {
      const customLayout = [{ id: 'custom', type: 'lights', x: 0, y: 0, w: 6, h: 4 }]
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(customLayout))

      const { result } = renderHook(() => useWidgetConfig('pi'))

      expect(result.current.layout).toEqual(customLayout)

      act(() => {
        result.current.resetLayout()
      })

      expect(result.current.layout).toHaveLength(5) // Back to default
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'home-dashboard-layout-pi',
        expect.stringContaining('lights')
      )
    })
  })

  describe('Widget management', () => {
    beforeEach(() => {
      mockLocalStorage.getItem.mockReturnValue(null)
    })

    it('should add new widget with default position', async () => {
      const { result } = renderHook(() => useWidgetConfig('pi'))

      const initialCount = result.current.layout.length

      act(() => {
        result.current.addWidget('switches')
      })

      expect(result.current.layout).toHaveLength(initialCount + 1)
      
      const newWidget = result.current.layout.find(w => w.type === 'switches')
      expect(newWidget).toBeDefined()
      expect(newWidget.id).toContain('switches-')
      expect(newWidget.x).toBe(0)
      expect(newWidget.y).toBe(0)
      expect(newWidget.w).toBe(3) // minW for switches
      expect(newWidget.h).toBe(2) // minH for switches
    })

    it('should add widget with custom position', async () => {
      const { result } = renderHook(() => useWidgetConfig('pi'))

      const position = { x: 6, y: 4, w: 4, h: 3 }

      act(() => {
        result.current.addWidget('switches', position)
      })

      const newWidget = result.current.layout.find(w => w.type === 'switches')
      expect(newWidget.x).toBe(6)
      expect(newWidget.y).toBe(4)
      expect(newWidget.w).toBe(4)
      expect(newWidget.h).toBe(3)
    })

    it('should handle invalid widget type', async () => {
      const { result } = renderHook(() => useWidgetConfig('pi'))

      act(() => {
        result.current.addWidget('invalid-type')
      })

      expect(result.current.error.message).toBe('Unknown widget type: invalid-type')
      expect(result.current.layout).toHaveLength(5) // No change
    })

    it('should remove widget by id', async () => {
      const { result } = renderHook(() => useWidgetConfig('pi'))

      const widgetToRemove = result.current.layout[0]
      const initialCount = result.current.layout.length

      act(() => {
        result.current.removeWidget(widgetToRemove.id)
      })

      expect(result.current.layout).toHaveLength(initialCount - 1)
      expect(result.current.layout.find(w => w.id === widgetToRemove.id)).toBeUndefined()
    })

    it('should update widget properties', async () => {
      const { result } = renderHook(() => useWidgetConfig('pi'))

      const widgetToUpdate = result.current.layout[0]
      const updates = { w: 8, h: 6, x: 2, y: 3 }

      act(() => {
        result.current.updateWidget(widgetToUpdate.id, updates)
      })

      const updatedWidget = result.current.layout.find(w => w.id === widgetToUpdate.id)
      expect(updatedWidget.w).toBe(8)
      expect(updatedWidget.h).toBe(6)
      expect(updatedWidget.x).toBe(2)
      expect(updatedWidget.y).toBe(3)
      expect(updatedWidget.type).toBe(widgetToUpdate.type) // Unchanged
    })

    it('should not update non-existent widget', async () => {
      const { result } = renderHook(() => useWidgetConfig('pi'))

      const originalLayout = [...result.current.layout]

      act(() => {
        result.current.updateWidget('non-existent-id', { w: 8 })
      })

      expect(result.current.layout).toEqual(originalLayout)
    })
  })

  describe('Widget configuration', () => {
    it('should return available widget types', async () => {
      const { result } = renderHook(() => useWidgetConfig('pi'))

      const widgetTypes = result.current.getAvailableWidgetTypes()

      expect(widgetTypes).toHaveLength(6) // 6 widget types defined
      expect(widgetTypes.find(w => w.type === 'lights')).toBeDefined()
      expect(widgetTypes.find(w => w.type === 'scenes')).toBeDefined()
      expect(widgetTypes.find(w => w.type === 'climate')).toBeDefined()
      expect(widgetTypes.find(w => w.type === 'media')).toBeDefined()
      expect(widgetTypes.find(w => w.type === 'security')).toBeDefined()
      expect(widgetTypes.find(w => w.type === 'switches')).toBeDefined()

      // Check structure
      const lightsConfig = widgetTypes.find(w => w.type === 'lights')
      expect(lightsConfig.name).toBe('Lights')
      expect(lightsConfig.description).toBe('Control smart lights')
      expect(lightsConfig.minW).toBe(4)
      expect(lightsConfig.maxW).toBe(8)
    })

    it('should get specific widget configuration', async () => {
      const { result } = renderHook(() => useWidgetConfig('pi'))

      const lightsConfig = result.current.getWidgetConfig('lights')
      expect(lightsConfig.name).toBe('Lights')
      expect(lightsConfig.minW).toBe(4)
      expect(lightsConfig.maxW).toBe(8)
      expect(lightsConfig.minH).toBe(2)
      expect(lightsConfig.maxH).toBe(6)

      const invalidConfig = result.current.getWidgetConfig('invalid')
      expect(invalidConfig).toBe(null)
    })

    it('should validate widget dimensions', async () => {
      const { result } = renderHook(() => useWidgetConfig('pi'))

      // Valid widget
      const validWidget = { type: 'lights', w: 6, h: 4 }
      expect(result.current.validateWidget(validWidget)).toBe(true)

      // Too small
      const tooSmallWidget = { type: 'lights', w: 2, h: 1 }
      expect(result.current.validateWidget(tooSmallWidget)).toBe(false)

      // Too large
      const tooLargeWidget = { type: 'lights', w: 10, h: 8 }
      expect(result.current.validateWidget(tooLargeWidget)).toBe(false)

      // Invalid type
      const invalidTypeWidget = { type: 'invalid', w: 4, h: 2 }
      expect(result.current.validateWidget(invalidTypeWidget)).toBe(false)
    })

    it('should validate edge cases for widget dimensions', async () => {
      const { result } = renderHook(() => useWidgetConfig('pi'))

      // Exactly at minimum
      const minWidget = { type: 'switches', w: 3, h: 2 } // switches minW: 3, minH: 2
      expect(result.current.validateWidget(minWidget)).toBe(true)

      // Exactly at maximum
      const maxWidget = { type: 'switches', w: 6, h: 4 } // switches maxW: 6, maxH: 4
      expect(result.current.validateWidget(maxWidget)).toBe(true)
    })
  })

  describe('Interface type changes', () => {
    it('should reload layout when interface type changes', async () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      const { result, rerender } = renderHook(
        ({ interfaceType }) => useWidgetConfig(interfaceType),
        { initialProps: { interfaceType: 'pi' } }
      )

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('home-dashboard-layout-pi')

      // Change to PWA
      rerender({ interfaceType: 'pwa' })

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('home-dashboard-layout-pwa')
      
      // PWA layout should be different from Pi layout
      const pwaLayout = result.current.layout
      expect(pwaLayout.every(w => w.w === 12)).toBe(true) // All widgets full width
    })

    it('should persist separate layouts for different interfaces', async () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      const { result } = renderHook(() => useWidgetConfig('pi'))

      // Modify Pi layout
      const piLayout = [{ id: 'pi-custom', type: 'lights', x: 0, y: 0, w: 8, h: 4 }]
      act(() => {
        result.current.saveLayout(piLayout)
      })

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'home-dashboard-layout-pi',
        JSON.stringify(piLayout)
      )

      // Switch to PWA interface
      const { result: pwaResult } = renderHook(() => useWidgetConfig('pwa'))

      // Modify PWA layout
      const pwaLayout = [{ id: 'pwa-custom', type: 'scenes', x: 0, y: 0, w: 12, h: 3 }]
      act(() => {
        pwaResult.current.saveLayout(pwaLayout)
      })

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'home-dashboard-layout-pwa',
        JSON.stringify(pwaLayout)
      )

      // Verify they are stored separately
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(2)
    })
  })

  describe('Error handling', () => {
    it('should handle initialization errors', async () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage access denied')
      })

      const { result } = renderHook(() => useWidgetConfig('pi'))

      expect(result.current.error).toBeInstanceOf(Error)
      expect(result.current.loading).toBe(false)
    })

    it('should handle saving errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockLocalStorage.getItem.mockReturnValue(null)
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })

      const { result } = renderHook(() => useWidgetConfig('pi'))

      act(() => {
        result.current.saveLayout([{ id: 'test', type: 'lights', x: 0, y: 0, w: 4, h: 2 }])
      })

      expect(result.current.error).toBeInstanceOf(Error)
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })
  })

  describe('Performance', () => {
    it('should not cause unnecessary re-renders for unchanged data', async () => {
      mockLocalStorage.getItem.mockReturnValue(null)
      let renderCount = 0

      const { result } = renderHook(() => {
        renderCount++
        return useWidgetConfig('pi')
      })

      const initialRenderCount = renderCount

      // Call functions that shouldn't cause re-renders
      result.current.getAvailableWidgetTypes()
      result.current.getWidgetConfig('lights')
      result.current.validateWidget({ type: 'lights', w: 6, h: 4 })

      expect(renderCount).toBe(initialRenderCount)
    })
  })
})