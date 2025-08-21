import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DeviceCard from '../../../components/home/DeviceCard.jsx'
import { mockDeviceEntity, mockTouchEvent } from '../../../test/utils.js'

describe('DeviceCard component', () => {
  const mockOnToggle = vi.fn()
  const mockOnLongPress = vi.fn()

  const defaultProps = {
    onToggle: mockOnToggle,
    onLongPress: mockOnLongPress
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render light device correctly', () => {
      const lightDevice = {
        entity_id: 'light.living_room',
        state: 'on',
        attributes: {
          friendly_name: 'Living Room Light',
          brightness: 128,
          rgb_color: [255, 255, 255]
        }
      }

      render(<DeviceCard device={lightDevice} {...defaultProps} />)

      expect(screen.getByText('Living Room Light')).toBeInTheDocument()
      expect(screen.getByText('On')).toBeInTheDocument()
      expect(screen.getByText('50%')).toBeInTheDocument() // brightness percentage
    })

    it('should render switch device correctly', () => {
      const switchDevice = {
        entity_id: 'switch.bedroom',
        state: 'off',
        attributes: {
          friendly_name: 'Bedroom Switch'
        }
      }

      render(<DeviceCard device={switchDevice} {...defaultProps} />)

      expect(screen.getByText('Bedroom Switch')).toBeInTheDocument()
      expect(screen.getByText('Off')).toBeInTheDocument()
    })

    it('should render unavailable device correctly', () => {
      const unavailableDevice = {
        entity_id: 'light.kitchen',
        state: 'unavailable',
        attributes: {
          friendly_name: 'Kitchen Light'
        }
      }

      render(<DeviceCard device={unavailableDevice} {...defaultProps} />)

      expect(screen.getByText('Kitchen Light')).toBeInTheDocument()
      expect(screen.getByText('Unavailable')).toBeInTheDocument()
    })

    it('should fallback to entity_id when no friendly_name', () => {
      const deviceWithoutName = {
        entity_id: 'light.unnamed_light',
        state: 'on',
        attributes: {}
      }

      render(<DeviceCard device={deviceWithoutName} {...defaultProps} />)

      expect(screen.getByText('light.unnamed_light')).toBeInTheDocument()
    })

    it('should show color indicator for lights with color', () => {
      const colorLight = {
        entity_id: 'light.color_bulb',
        state: 'on',
        attributes: {
          friendly_name: 'Color Bulb',
          brightness: 255,
          rgb_color: [255, 0, 0]
        }
      }

      render(<DeviceCard device={colorLight} {...defaultProps} />)

      // Should have palette icon for color lights
      const paletteIcon = document.querySelector('[data-lucide="palette"]')
      expect(paletteIcon).toBeInTheDocument()
    })

    it('should show brightness indicator only for lights that are on', () => {
      const onLight = {
        entity_id: 'light.test',
        state: 'on',
        attributes: {
          friendly_name: 'Test Light',
          brightness: 200
        }
      }

      const { rerender } = render(<DeviceCard device={onLight} {...defaultProps} />)

      // Should show brightness indicator
      expect(screen.getByText('78%')).toBeInTheDocument() // 200/255 * 100 ≈ 78%

      // Turn off the light
      const offLight = { ...onLight, state: 'off' }
      rerender(<DeviceCard device={offLight} {...defaultProps} />)

      // Should not show brightness indicator
      expect(screen.queryByText('78%')).not.toBeInTheDocument()
    })

    it('should show long press indicator for lights', () => {
      const lightDevice = {
        entity_id: 'light.test',
        state: 'on',
        attributes: { friendly_name: 'Test Light' }
      }

      render(<DeviceCard device={lightDevice} {...defaultProps} />)

      // Should have blue indicator dot for lights (long press hint)
      const container = document.querySelector('.bg-blue-400')
      expect(container).toBeInTheDocument()
    })

    it('should not show long press indicator for switches', () => {
      const switchDevice = {
        entity_id: 'switch.test',
        state: 'on',
        attributes: { friendly_name: 'Test Switch' }
      }

      render(<DeviceCard device={switchDevice} {...defaultProps} />)

      // Should not have blue indicator dot for switches
      const container = document.querySelector('.bg-blue-400')
      expect(container).not.toBeInTheDocument()
    })
  })

  describe('Visual states', () => {
    it('should apply correct styling for on state', () => {
      const onDevice = {
        entity_id: 'light.test',
        state: 'on',
        attributes: { friendly_name: 'Test Light' }
      }

      const { container } = render(<DeviceCard device={onDevice} {...defaultProps} />)

      const card = container.firstChild
      expect(card).toHaveClass('border-yellow-200', 'bg-yellow-50')
    })

    it('should apply correct styling for off state', () => {
      const offDevice = {
        entity_id: 'light.test',
        state: 'off',
        attributes: { friendly_name: 'Test Light' }
      }

      const { container } = render(<DeviceCard device={offDevice} {...defaultProps} />)

      const card = container.firstChild
      expect(card).toHaveClass('border-gray-200', 'bg-white')
    })

    it('should apply correct styling for unavailable state', () => {
      const unavailableDevice = {
        entity_id: 'light.test',
        state: 'unavailable',
        attributes: { friendly_name: 'Test Light' }
      }

      const { container } = render(<DeviceCard device={unavailableDevice} {...defaultProps} />)

      const card = container.firstChild
      expect(card).toHaveClass('border-gray-200', 'bg-gray-50', 'opacity-50', 'cursor-not-allowed')
    })
  })

  describe('Click interactions', () => {
    it('should call onToggle when clicked', async () => {
      const user = userEvent.setup()
      const device = {
        entity_id: 'light.test',
        state: 'on',
        attributes: { friendly_name: 'Test Light' }
      }

      render(<DeviceCard device={device} {...defaultProps} />)

      await user.click(screen.getByText('Test Light'))

      expect(mockOnToggle).toHaveBeenCalledWith('light.test')
      expect(mockOnToggle).toHaveBeenCalledTimes(1)
    })

    it('should not call onToggle for unavailable devices', async () => {
      const user = userEvent.setup()
      const unavailableDevice = {
        entity_id: 'light.test',
        state: 'unavailable',
        attributes: { friendly_name: 'Test Light' }
      }

      render(<DeviceCard device={unavailableDevice} {...defaultProps} />)

      await user.click(screen.getByText('Test Light'))

      expect(mockOnToggle).not.toHaveBeenCalled()
    })

    it('should handle missing onToggle callback gracefully', async () => {
      const user = userEvent.setup()
      const device = {
        entity_id: 'light.test',
        state: 'on',
        attributes: { friendly_name: 'Test Light' }
      }

      expect(() => {
        render(<DeviceCard device={device} />)
      }).not.toThrow()

      const card = screen.getByText('Test Light')
      await user.click(card)

      // Should not throw error
    })
  })

  describe('Long press interactions', () => {
    it('should call onLongPress for lights on context menu', async () => {
      const user = userEvent.setup()
      const lightDevice = {
        entity_id: 'light.test',
        state: 'on',
        attributes: { friendly_name: 'Test Light' }
      }

      render(<DeviceCard device={lightDevice} {...defaultProps} />)

      await user.pointer({
        keys: '[MouseRight]',
        target: screen.getByText('Test Light')
      })

      expect(mockOnLongPress).toHaveBeenCalledWith('light.test')
    })

    it('should not call onLongPress for switches on context menu', async () => {
      const user = userEvent.setup()
      const switchDevice = {
        entity_id: 'switch.test',
        state: 'on',
        attributes: { friendly_name: 'Test Switch' }
      }

      render(<DeviceCard device={switchDevice} {...defaultProps} />)

      await user.pointer({
        keys: '[MouseRight]',
        target: screen.getByText('Test Switch')
      })

      expect(mockOnLongPress).not.toHaveBeenCalled()
    })

    it('should not call onLongPress for unavailable lights', async () => {
      const user = userEvent.setup()
      const unavailableLight = {
        entity_id: 'light.test',
        state: 'unavailable',
        attributes: { friendly_name: 'Test Light' }
      }

      render(<DeviceCard device={unavailableLight} {...defaultProps} />)

      await user.pointer({
        keys: '[MouseRight]',
        target: screen.getByText('Test Light')
      })

      expect(mockOnLongPress).not.toHaveBeenCalled()
    })

    it('should handle touch long press', () => {
      vi.useFakeTimers()
      
      const lightDevice = {
        entity_id: 'light.test',
        state: 'on',
        attributes: { friendly_name: 'Test Light' }
      }

      const { container } = render(<DeviceCard device={lightDevice} {...defaultProps} />)
      const card = container.firstChild

      // Simulate touch start
      fireEvent.touchStart(card, {
        touches: [{ clientX: 100, clientY: 100 }]
      })

      // Fast-forward time to trigger long press
      vi.advanceTimersByTime(500)

      expect(mockOnLongPress).toHaveBeenCalledWith('light.test')

      vi.useRealTimers()
    })

    it('should cancel long press on touch move', () => {
      vi.useFakeTimers()
      
      const lightDevice = {
        entity_id: 'light.test',
        state: 'on',
        attributes: { friendly_name: 'Test Light' }
      }

      const { container } = render(<DeviceCard device={lightDevice} {...defaultProps} />)
      const card = container.firstChild

      // Simulate touch start
      fireEvent.touchStart(card, {
        touches: [{ clientX: 100, clientY: 100 }]
      })

      // Simulate touch move before long press timeout
      vi.advanceTimersByTime(300)
      fireEvent.touchMove(card, {
        touches: [{ clientX: 150, clientY: 100 }]
      })

      // Continue to long press timeout
      vi.advanceTimersByTime(300)

      expect(mockOnLongPress).not.toHaveBeenCalled()

      vi.useRealTimers()
    })

    it('should cancel long press on touch end', () => {
      vi.useFakeTimers()
      
      const lightDevice = {
        entity_id: 'light.test',
        state: 'on',
        attributes: { friendly_name: 'Test Light' }
      }

      const { container } = render(<DeviceCard device={lightDevice} {...defaultProps} />)
      const card = container.firstChild

      // Simulate touch start
      fireEvent.touchStart(card, {
        touches: [{ clientX: 100, clientY: 100 }]
      })

      // Simulate touch end before long press timeout
      vi.advanceTimersByTime(300)
      fireEvent.touchEnd(card, {
        changedTouches: [{ clientX: 100, clientY: 100 }]
      })

      // Continue to long press timeout
      vi.advanceTimersByTime(300)

      expect(mockOnLongPress).not.toHaveBeenCalled()

      vi.useRealTimers()
    })
  })

  describe('Mouse interactions', () => {
    it('should show pressed state on mouse down', () => {
      const device = {
        entity_id: 'light.test',
        state: 'on',
        attributes: { friendly_name: 'Test Light' }
      }

      const { container } = render(<DeviceCard device={device} {...defaultProps} />)
      const card = container.firstChild

      expect(card).not.toHaveClass('scale-95')

      fireEvent.mouseDown(card)
      expect(card).toHaveClass('scale-95')

      fireEvent.mouseUp(card)
      expect(card).not.toHaveClass('scale-95')
    })

    it('should clear pressed state on mouse leave', () => {
      const device = {
        entity_id: 'light.test',
        state: 'on',
        attributes: { friendly_name: 'Test Light' }
      }

      const { container } = render(<DeviceCard device={device} {...defaultProps} />)
      const card = container.firstChild

      fireEvent.mouseDown(card)
      expect(card).toHaveClass('scale-95')

      fireEvent.mouseLeave(card)
      expect(card).not.toHaveClass('scale-95')
    })
  })

  describe('Icons', () => {
    it('should show correct light icon for different states', () => {
      const lightDevice = {
        entity_id: 'light.test',
        state: 'on',
        attributes: { friendly_name: 'Test Light' }
      }

      const { container, rerender } = render(<DeviceCard device={lightDevice} {...defaultProps} />)

      // On light should have filled lightbulb
      let lightbulb = container.querySelector('[data-lucide="lightbulb"]')
      expect(lightbulb).toBeInTheDocument()
      expect(lightbulb).toHaveClass('fill-current')

      // Off light should have outline lightbulb
      rerender(<DeviceCard device={{ ...lightDevice, state: 'off' }} {...defaultProps} />)
      lightbulb = container.querySelector('[data-lucide="lightbulb"]')
      expect(lightbulb).toBeInTheDocument()
      expect(lightbulb).not.toHaveClass('fill-current')
    })

    it('should show correct switch icon for different states', () => {
      const switchDevice = {
        entity_id: 'switch.test',
        state: 'on',
        attributes: { friendly_name: 'Test Switch' }
      }

      const { container, rerender } = render(<DeviceCard device={switchDevice} {...defaultProps} />)

      // On switch should have toggle-right
      expect(container.querySelector('[data-lucide="toggle-right"]')).toBeInTheDocument()

      // Off switch should have toggle-left
      rerender(<DeviceCard device={{ ...switchDevice, state: 'off' }} {...defaultProps} />)
      expect(container.querySelector('[data-lucide="toggle-left"]')).toBeInTheDocument()
    })

    it('should show brightness indicator with correct opacity', () => {
      const lightDevice = {
        entity_id: 'light.test',
        state: 'on',
        attributes: {
          friendly_name: 'Test Light',
          brightness: 128 // 50% brightness
        }
      }

      const { container } = render(<DeviceCard device={lightDevice} {...defaultProps} />)

      const sunIcon = container.querySelector('[data-lucide="sun"]')
      expect(sunIcon).toBeInTheDocument()
      expect(sunIcon).toHaveStyle({ opacity: '0.5019607843137255' }) // 128/255
    })
  })

  describe('Accessibility', () => {
    it('should be keyboard accessible', async () => {
      const user = userEvent.setup()
      const device = {
        entity_id: 'light.test',
        state: 'on',
        attributes: { friendly_name: 'Test Light' }
      }

      render(<DeviceCard device={device} {...defaultProps} />)

      const card = screen.getByText('Test Light').closest('div')
      
      // Should be focusable
      await user.tab()
      expect(card).toHaveFocus()

      // Should activate on Enter or Space
      await user.keyboard('{Enter}')
      expect(mockOnToggle).toHaveBeenCalledWith('light.test')
    })

    it('should prevent text selection', () => {
      const device = {
        entity_id: 'light.test',
        state: 'on',
        attributes: { friendly_name: 'Test Light' }
      }

      const { container } = render(<DeviceCard device={device} {...defaultProps} />)
      
      expect(container.firstChild).toHaveClass('select-none')
    })
  })

  describe('Edge cases', () => {
    it('should handle missing device attributes', () => {
      const minimalDevice = {
        entity_id: 'light.minimal',
        state: 'on'
      }

      expect(() => {
        render(<DeviceCard device={minimalDevice} {...defaultProps} />)
      }).not.toThrow()

      expect(screen.getByText('light.minimal')).toBeInTheDocument()
    })

    it('should handle zero brightness', () => {
      const zeroBrightnessLight = {
        entity_id: 'light.dim',
        state: 'on',
        attributes: {
          friendly_name: 'Dim Light',
          brightness: 0
        }
      }

      render(<DeviceCard device={zeroBrightnessLight} {...defaultProps} />)

      expect(screen.getByText('0%')).toBeInTheDocument()
    })

    it('should handle maximum brightness', () => {
      const maxBrightnessLight = {
        entity_id: 'light.bright',
        state: 'on',
        attributes: {
          friendly_name: 'Bright Light',
          brightness: 255
        }
      }

      render(<DeviceCard device={maxBrightnessLight} {...defaultProps} />)

      expect(screen.getByText('100%')).toBeInTheDocument()
    })

    it('should handle very long device names', () => {
      const longNameDevice = {
        entity_id: 'light.test',
        state: 'on',
        attributes: {
          friendly_name: 'This is a very long device name that should be truncated properly'
        }
      }

      render(<DeviceCard device={longNameDevice} {...defaultProps} />)

      const nameElement = screen.getByText('This is a very long device name that should be truncated properly')
      expect(nameElement).toHaveClass('truncate')
    })
  })
})