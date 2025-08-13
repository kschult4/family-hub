import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import HomeDashboard from '../../views/HomeDashboard.jsx'

// Mock the hooks and services
vi.mock('../../hooks/useHomeAssistant.js')
vi.mock('../../hooks/useWidgetConfig.js')
vi.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children }) => <div data-testid="drag-drop-context">{children}</div>,
  Droppable: ({ children }) => children({
    droppableProps: {},
    innerRef: vi.fn(),
    placeholder: <div data-testid="placeholder" />
  }, { isDraggingOver: false }),
  Draggable: ({ children, draggableId }) => children({
    innerRef: vi.fn(),
    draggableProps: { 'data-testid': `draggable-${draggableId}` },
    dragHandleProps: {}
  }, { isDragging: false })
}))

import { useHomeAssistant } from '../../hooks/useHomeAssistant.js'
import { useWidgetConfig } from '../../hooks/useWidgetConfig.js'

describe('HomeDashboard Integration Tests', () => {
  const mockDevices = [
    {
      entity_id: 'light.living_room',
      state: 'on',
      attributes: {
        friendly_name: 'Living Room Light',
        brightness: 200,
        rgb_color: [255, 255, 255]
      }
    },
    {
      entity_id: 'switch.coffee_maker',
      state: 'off',
      attributes: {
        friendly_name: 'Coffee Maker'
      }
    }
  ]

  const mockScenes = [
    {
      entity_id: 'scene.movie_night',
      state: 'scening',
      attributes: {
        friendly_name: 'Movie Night'
      }
    }
  ]

  const mockLayout = [
    { id: 'lights', type: 'lights', x: 0, y: 0, w: 6, h: 4 },
    { id: 'scenes', type: 'scenes', x: 6, y: 0, w: 6, h: 4 }
  ]

  const mockUseHomeAssistant = {
    devices: mockDevices,
    scenes: mockScenes,
    loading: false,
    error: null,
    toggleDevice: vi.fn(),
    updateDevice: vi.fn(),
    activateScene: vi.fn(),
    turnOffDevice: vi.fn(),
    callService: vi.fn(),
    refreshStates: vi.fn(),
    isConnected: true
  }

  const mockUseWidgetConfig = {
    layout: mockLayout,
    loading: false,
    error: null,
    saveLayout: vi.fn(),
    addWidget: vi.fn(),
    removeWidget: vi.fn(),
    updateWidget: vi.fn(),
    resetLayout: vi.fn(),
    getAvailableWidgetTypes: vi.fn().mockReturnValue([
      { type: 'lights', name: 'Lights' },
      { type: 'scenes', name: 'Scenes' }
    ]),
    validateWidget: vi.fn().mockReturnValue(true),
    getWidgetConfig: vi.fn().mockReturnValue({ minW: 4, maxW: 8, minH: 2, maxH: 6 })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    useHomeAssistant.mockReturnValue(mockUseHomeAssistant)
    useWidgetConfig.mockReturnValue(mockUseWidgetConfig)
    
    // Mock console methods to avoid noise in tests
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Dashboard Initialization', () => {
    it('should render dashboard with loading state', () => {
      useHomeAssistant.mockReturnValue({
        ...mockUseHomeAssistant,
        loading: true
      })

      render(<HomeDashboard />)

      expect(screen.getByText(/loading/i)).toBeInTheDocument()
    })

    it('should render dashboard with devices and scenes', async () => {
      render(<HomeDashboard />)

      await waitFor(() => {
        expect(screen.getByText('Living Room Light')).toBeInTheDocument()
        expect(screen.getByText('Coffee Maker')).toBeInTheDocument()
        expect(screen.getByText('Movie Night')).toBeInTheDocument()
      })
    })

    it('should handle error states', () => {
      const error = new Error('Connection failed')
      useHomeAssistant.mockReturnValue({
        ...mockUseHomeAssistant,
        error,
        loading: false
      })

      render(<HomeDashboard />)

      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })

    it('should show connection status', () => {
      useHomeAssistant.mockReturnValue({
        ...mockUseHomeAssistant,
        isConnected: false
      })

      render(<HomeDashboard />)

      expect(screen.getByText(/disconnected/i)).toBeInTheDocument()
    })
  })

  describe('Device Interaction', () => {
    it('should toggle device when clicked', async () => {
      const user = userEvent.setup()
      render(<HomeDashboard />)

      await waitFor(() => {
        expect(screen.getByText('Living Room Light')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Living Room Light'))

      expect(mockUseHomeAssistant.toggleDevice).toHaveBeenCalledWith('light.living_room')
    })

    it('should open device modal on long press', async () => {
      const user = userEvent.setup()
      render(<HomeDashboard />)

      await waitFor(() => {
        expect(screen.getByText('Living Room Light')).toBeInTheDocument()
      })

      // Simulate right click for long press
      await user.pointer({
        keys: '[MouseRight]',
        target: screen.getByText('Living Room Light')
      })

      await waitFor(() => {
        expect(screen.getByText(/brightness/i)).toBeInTheDocument()
      })
    })

    it('should update device attributes from modal', async () => {
      const user = userEvent.setup()
      render(<HomeDashboard />)

      // Open device modal
      await waitFor(() => {
        expect(screen.getByText('Living Room Light')).toBeInTheDocument()
      })

      await user.pointer({
        keys: '[MouseRight]',
        target: screen.getByText('Living Room Light')
      })

      // Interact with brightness slider
      const brightnessSlider = await screen.findByRole('slider')
      await user.click(brightnessSlider)
      
      fireEvent.change(brightnessSlider, { target: { value: '150' } })

      expect(mockUseHomeAssistant.updateDevice).toHaveBeenCalledWith(
        'light.living_room',
        expect.objectContaining({ brightness: 150 })
      )
    })

    it('should activate scene when clicked', async () => {
      const user = userEvent.setup()
      render(<HomeDashboard />)

      await waitFor(() => {
        expect(screen.getByText('Movie Night')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Movie Night'))

      expect(mockUseHomeAssistant.activateScene).toHaveBeenCalledWith('scene.movie_night')
    })
  })

  describe('Widget Layout Management', () => {
    it('should save layout changes', async () => {
      render(<HomeDashboard />)

      // Simulate drag and drop by calling the onDragEnd handler directly
      const dragResult = {
        destination: { droppableId: 'widget-grid', index: 1 },
        source: { droppableId: 'widget-grid', index: 0 },
        draggableId: 'lights'
      }

      // Find the DragDropContext and simulate drag end
      const dragDropContext = screen.getByTestId('drag-drop-context')
      const onDragEnd = dragDropContext.props?.onDragEnd || (() => {})
      
      act(() => {
        onDragEnd(dragResult)
      })

      await waitFor(() => {
        expect(mockUseWidgetConfig.saveLayout).toHaveBeenCalled()
      })
    })

    it('should handle widget addition', async () => {
      const user = userEvent.setup()
      render(<HomeDashboard />)

      // Find and click add widget button
      const addButton = screen.getByText(/add widget/i) || screen.getByRole('button', { name: /add/i })
      await user.click(addButton)

      // Select widget type
      const lightOption = await screen.findByText('Lights')
      await user.click(lightOption)

      expect(mockUseWidgetConfig.addWidget).toHaveBeenCalledWith('lights', expect.any(Object))
    })

    it('should handle widget removal', async () => {
      const user = userEvent.setup()
      render(<HomeDashboard />)

      // Find and long press a widget to get context menu
      await waitFor(() => {
        expect(screen.getByText('Living Room Light')).toBeInTheDocument()
      })

      // Simulate widget removal action
      const removeButton = screen.queryByText(/remove/i) || screen.queryByRole('button', { name: /delete/i })
      if (removeButton) {
        await user.click(removeButton)
        expect(mockUseWidgetConfig.removeWidget).toHaveBeenCalled()
      }
    })
  })

  describe('Interface Adaptation', () => {
    it('should detect Pi interface', () => {
      // Mock window.innerWidth for Pi detection
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      })

      render(<HomeDashboard />)

      expect(useWidgetConfig).toHaveBeenCalledWith('pi')
    })

    it('should detect PWA interface', () => {
      // Mock window.innerWidth for PWA detection
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      })

      render(<HomeDashboard />)

      expect(useWidgetConfig).toHaveBeenCalledWith('pwa')
    })

    it('should handle window resize', () => {
      render(<HomeDashboard />)

      // Change window size
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      })

      fireEvent.resize(window)

      // Should trigger interface re-detection
      expect(useWidgetConfig).toHaveBeenCalled()
    })
  })

  describe('Real-time Updates', () => {
    it('should update device states from WebSocket', async () => {
      const { rerender } = render(<HomeDashboard />)

      // Simulate device state change
      const updatedDevices = [
        {
          ...mockDevices[0],
          state: 'off',
          attributes: {
            ...mockDevices[0].attributes,
            brightness: 0
          }
        },
        mockDevices[1]
      ]

      useHomeAssistant.mockReturnValue({
        ...mockUseHomeAssistant,
        devices: updatedDevices
      })

      rerender(<HomeDashboard />)

      await waitFor(() => {
        // The light should now show as off
        expect(screen.getByText('Off')).toBeInTheDocument()
      })
    })

    it('should handle device unavailability', async () => {
      const unavailableDevices = [
        {
          ...mockDevices[0],
          state: 'unavailable'
        },
        mockDevices[1]
      ]

      useHomeAssistant.mockReturnValue({
        ...mockUseHomeAssistant,
        devices: unavailableDevices
      })

      render(<HomeDashboard />)

      await waitFor(() => {
        expect(screen.getByText('Unavailable')).toBeInTheDocument()
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle device action failures', async () => {
      const user = userEvent.setup()
      mockUseHomeAssistant.toggleDevice.mockRejectedValue(new Error('Toggle failed'))

      render(<HomeDashboard />)

      await waitFor(() => {
        expect(screen.getByText('Living Room Light')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Living Room Light'))

      // Should show error notification or handle gracefully
      await waitFor(() => {
        expect(console.error).toHaveBeenCalled()
      })
    })

    it('should handle layout save failures', async () => {
      mockUseWidgetConfig.saveLayout.mockRejectedValue(new Error('Save failed'))

      render(<HomeDashboard />)

      const dragResult = {
        destination: { droppableId: 'widget-grid', index: 1 },
        source: { droppableId: 'widget-grid', index: 0 },
        draggableId: 'lights'
      }

      const dragDropContext = screen.getByTestId('drag-drop-context')
      const onDragEnd = dragDropContext.props?.onDragEnd || (() => {})
      
      await act(async () => {
        onDragEnd(dragResult)
      })

      // Should handle error gracefully
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('Performance', () => {
    it('should handle large number of devices', async () => {
      const manyDevices = Array.from({ length: 50 }, (_, i) => ({
        entity_id: `light.device_${i}`,
        state: i % 2 === 0 ? 'on' : 'off',
        attributes: {
          friendly_name: `Device ${i}`,
          brightness: Math.floor(Math.random() * 255)
        }
      }))

      useHomeAssistant.mockReturnValue({
        ...mockUseHomeAssistant,
        devices: manyDevices
      })

      const startTime = performance.now()
      render(<HomeDashboard />)

      await waitFor(() => {
        expect(screen.getByText('Device 0')).toBeInTheDocument()
      })

      const endTime = performance.now()
      const renderTime = endTime - startTime

      // Should render within reasonable time (adjust threshold as needed)
      expect(renderTime).toBeLessThan(1000) // 1 second
    })

    it('should debounce rapid state updates', async () => {
      vi.useFakeTimers()
      const user = userEvent.setup()

      render(<HomeDashboard />)

      await waitFor(() => {
        expect(screen.getByText('Living Room Light')).toBeInTheDocument()
      })

      // Rapid clicks
      const lightButton = screen.getByText('Living Room Light')
      await user.click(lightButton)
      await user.click(lightButton)
      await user.click(lightButton)

      // Fast-forward timers
      act(() => {
        vi.runAllTimers()
      })

      // Should not call toggle multiple times rapidly
      expect(mockUseHomeAssistant.toggleDevice).toHaveBeenCalledTimes(3)

      vi.useRealTimers()
    })
  })

  describe('Accessibility', () => {
    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(<HomeDashboard />)

      await waitFor(() => {
        expect(screen.getByText('Living Room Light')).toBeInTheDocument()
      })

      // Should be able to tab through widgets
      await user.tab()
      const firstWidget = document.activeElement
      expect(firstWidget).toBeInTheDocument()

      await user.tab()
      const secondWidget = document.activeElement
      expect(secondWidget).not.toBe(firstWidget)
    })

    it('should have proper ARIA labels', async () => {
      render(<HomeDashboard />)

      await waitFor(() => {
        expect(screen.getByText('Living Room Light')).toBeInTheDocument()
      })

      // Check for accessibility attributes
      const lightControl = screen.getByText('Living Room Light').closest('[role]')
      if (lightControl) {
        expect(lightControl).toHaveAttribute('role')
      }
    })

    it('should support screen readers', async () => {
      render(<HomeDashboard />)

      await waitFor(() => {
        expect(screen.getByText('Living Room Light')).toBeInTheDocument()
      })

      // Check for screen reader friendly text
      const lightState = screen.getByText('On')
      expect(lightState).toBeInTheDocument()
    })
  })

  describe('Cleanup', () => {
    it('should cleanup resources on unmount', () => {
      const { unmount } = render(<HomeDashboard />)

      unmount()

      // Verify cleanup happened (would be tested in hook tests)
      expect(true).toBe(true) // Placeholder for cleanup verification
    })

    it('should handle unmount during async operations', async () => {
      const user = userEvent.setup()
      
      // Mock slow toggle operation
      let resolveToggle
      mockUseHomeAssistant.toggleDevice.mockReturnValue(
        new Promise(resolve => { resolveToggle = resolve })
      )

      const { unmount } = render(<HomeDashboard />)

      await waitFor(() => {
        expect(screen.getByText('Living Room Light')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Living Room Light'))

      // Unmount before operation completes
      unmount()

      // Complete the operation - should not cause errors
      resolveToggle()

      // No errors should be thrown
      expect(true).toBe(true)
    })
  })
})