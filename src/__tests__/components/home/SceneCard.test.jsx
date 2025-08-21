import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SceneCard from '../../../components/home/SceneCard.jsx'

describe('SceneCard component', () => {
  const mockOnActivate = vi.fn()

  const defaultScene = {
    entity_id: 'scene.movie_night',
    state: 'scening',
    attributes: {
      friendly_name: 'Movie Night'
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render scene correctly', () => {
      render(<SceneCard scene={defaultScene} onActivate={mockOnActivate} />)

      expect(screen.getByText('Movie Night')).toBeInTheDocument()
      expect(screen.getByText('Tap to activate')).toBeInTheDocument()
    })

    it('should fallback to entity_id when no friendly_name', () => {
      const sceneWithoutName = {
        entity_id: 'scene.unnamed_scene',
        state: 'scening',
        attributes: {}
      }

      render(<SceneCard scene={sceneWithoutName} onActivate={mockOnActivate} />)

      expect(screen.getByText('scene.unnamed_scene')).toBeInTheDocument()
    })

    it('should render unavailable scene correctly', () => {
      const unavailableScene = {
        entity_id: 'scene.broken',
        state: 'unavailable',
        attributes: {
          friendly_name: 'Broken Scene'
        }
      }

      render(<SceneCard scene={unavailableScene} onActivate={mockOnActivate} />)

      expect(screen.getByText('Broken Scene')).toBeInTheDocument()
      expect(screen.getByText('Unavailable')).toBeInTheDocument()
    })

    it('should show default zap icon initially', () => {
      const { container } = render(<SceneCard scene={defaultScene} onActivate={mockOnActivate} />)

      const zapIcon = container.querySelector('svg')
      expect(zapIcon).toBeInTheDocument()
    })

    it('should show play icon hint', () => {
      const { container } = render(<SceneCard scene={defaultScene} onActivate={mockOnActivate} />)

      const svgIcons = container.querySelectorAll('svg')
      expect(svgIcons.length).toBeGreaterThan(0)
    })
  })

  describe('Visual states', () => {
    it('should apply correct default styling', () => {
      const { container } = render(<SceneCard scene={defaultScene} onActivate={mockOnActivate} />)

      const card = container.firstChild
      expect(card).toHaveClass('text-black')
      expect(card).toHaveStyle({ backgroundColor: '#f8f9fa', borderColor: 'rgb(105, 165, 209)' })
    })

    it('should apply correct unavailable styling', () => {
      const unavailableScene = {
        ...defaultScene,
        state: 'unavailable'
      }

      const { container } = render(<SceneCard scene={unavailableScene} onActivate={mockOnActivate} />)

      const card = container.firstChild
      expect(card).toHaveClass('text-gray-400', 'bg-gray-100', 'border-gray-200', 'opacity-50', 'cursor-not-allowed')
    })

    it('should show pressed state on mouse/touch interaction', () => {
      const { container } = render(<SceneCard scene={defaultScene} onActivate={mockOnActivate} />)
      const card = container.firstChild

      expect(card).not.toHaveClass('scale-95')

      fireEvent.mouseDown(card)
      expect(card).toHaveClass('scale-95')

      fireEvent.mouseUp(card)
      expect(card).not.toHaveClass('scale-95')
    })

    it('should clear pressed state on mouse leave', () => {
      const { container } = render(<SceneCard scene={defaultScene} onActivate={mockOnActivate} />)
      const card = container.firstChild

      fireEvent.mouseDown(card)
      expect(card).toHaveClass('scale-95')

      fireEvent.mouseLeave(card)
      expect(card).not.toHaveClass('scale-95')
    })

    it('should handle touch interactions', () => {
      const { container } = render(<SceneCard scene={defaultScene} onActivate={mockOnActivate} />)
      const card = container.firstChild

      fireEvent.touchStart(card)
      expect(card).toHaveClass('scale-95')

      fireEvent.touchEnd(card)
      expect(card).not.toHaveClass('scale-95')
    })
  })

  describe('Scene activation', () => {
    it('should call onActivate when clicked', async () => {
      const user = userEvent.setup()
      mockOnActivate.mockResolvedValue()

      render(<SceneCard scene={defaultScene} onActivate={mockOnActivate} />)

      await user.click(screen.getByText('Movie Night'))

      expect(mockOnActivate).toHaveBeenCalledWith('scene.movie_night')
      expect(mockOnActivate).toHaveBeenCalledTimes(1)
    })

    it('should show loading state during activation', async () => {
      const user = userEvent.setup()
      let resolveActivation
      const activationPromise = new Promise(resolve => {
        resolveActivation = resolve
      })
      mockOnActivate.mockReturnValue(activationPromise)

      const { container } = render(<SceneCard scene={defaultScene} onActivate={mockOnActivate} />)

      await user.click(screen.getByText('Movie Night'))

      // Should show loading state
      expect(screen.getByText('Activating...')).toBeInTheDocument()
      
      // Should show spinner
      const spinner = container.querySelector('.animate-spin')
      expect(spinner).toBeInTheDocument()

      // Should maintain default colors during loading
      const card = container.firstChild
      expect(card).toHaveClass('text-black')

      // Resolve activation
      resolveActivation()
      await waitFor(() => {
        expect(screen.getByText('Activated!')).toBeInTheDocument()
      })
    })

    it('should show success state after activation', async () => {
      vi.useFakeTimers()
      const user = userEvent.setup()
      mockOnActivate.mockResolvedValue()

      const { container } = render(<SceneCard scene={defaultScene} onActivate={mockOnActivate} />)

      await user.click(screen.getByText('Movie Night'))

      await waitFor(() => {
        expect(screen.getByText('Activated!')).toBeInTheDocument()
      })

      // Should maintain default colors after success
      const card = container.firstChild
      expect(card).toHaveClass('text-black')

      // Should show check circle icon (represented by SVG)
      const svgIcons = container.querySelectorAll('svg')
      expect(svgIcons.length).toBeGreaterThan(0)

      // Should return to normal after timeout
      act(() => {
        vi.advanceTimersByTime(2000)
      })

      await waitFor(() => {
        expect(screen.getByText('Tap to activate')).toBeInTheDocument()
      })

      expect(card).toHaveClass('text-black')

      vi.useRealTimers()
    })

    it('should handle activation errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const user = userEvent.setup()
      const error = new Error('Activation failed')
      mockOnActivate.mockRejectedValue(error)

      render(<SceneCard scene={defaultScene} onActivate={mockOnActivate} />)

      await user.click(screen.getByText('Movie Night'))

      await waitFor(() => {
        expect(screen.getByText('Tap to activate')).toBeInTheDocument()
      })

      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to activate scene:', error)
      
      consoleErrorSpy.mockRestore()
    })

    it('should not activate unavailable scenes', async () => {
      const user = userEvent.setup()
      const unavailableScene = {
        ...defaultScene,
        state: 'unavailable'
      }

      render(<SceneCard scene={unavailableScene} onActivate={mockOnActivate} />)

      await user.click(screen.getByText('Movie Night'))

      expect(mockOnActivate).not.toHaveBeenCalled()
    })

    it('should prevent multiple simultaneous activations', async () => {
      const user = userEvent.setup()
      let resolveActivation
      const activationPromise = new Promise(resolve => {
        resolveActivation = resolve
      })
      mockOnActivate.mockReturnValue(activationPromise)

      render(<SceneCard scene={defaultScene} onActivate={mockOnActivate} />)

      // First click
      await user.click(screen.getByText('Movie Night'))
      expect(mockOnActivate).toHaveBeenCalledTimes(1)

      // Second click while first is still processing
      await user.click(screen.getByText('Activating...'))
      expect(mockOnActivate).toHaveBeenCalledTimes(1) // Still only called once

      resolveActivation()
    })

    it('should handle missing onActivate callback gracefully', async () => {
      const user = userEvent.setup()

      expect(() => {
        render(<SceneCard scene={defaultScene} />)
      }).not.toThrow()

      const card = screen.getByText('Movie Night')
      await user.click(card)

      // Should not throw error
    })
  })

  describe('Accessibility', () => {
    it('should be keyboard accessible', async () => {
      const user = userEvent.setup()
      mockOnActivate.mockResolvedValue()

      render(<SceneCard scene={defaultScene} onActivate={mockOnActivate} />)

      const card = screen.getByText('Movie Night').closest('div')
      
      // Should be focusable
      await user.tab()
      expect(card).toHaveFocus()

      // Should activate on Enter
      await user.keyboard('{Enter}')
      expect(mockOnActivate).toHaveBeenCalledWith('scene.movie_night')
    })

    it('should prevent text selection', () => {
      const { container } = render(<SceneCard scene={defaultScene} onActivate={mockOnActivate} />)
      
      expect(container.firstChild).toHaveClass('select-none')
    })

    it('should have appropriate cursor states', () => {
      const { container } = render(<SceneCard scene={defaultScene} onActivate={mockOnActivate} />)
      
      expect(container.firstChild).toHaveClass('cursor-pointer')

      // Unavailable should have not-allowed cursor
      const unavailableScene = { ...defaultScene, state: 'unavailable' }
      const { container: unavailableContainer } = render(
        <SceneCard scene={unavailableScene} onActivate={mockOnActivate} />
      )
      
      expect(unavailableContainer.firstChild).toHaveClass('cursor-not-allowed')
    })
  })

  describe('Status indicators', () => {
    it('should show correct button visual states', async () => {
      vi.useFakeTimers()
      const user = userEvent.setup()
      mockOnActivate.mockResolvedValue()

      const { container } = render(<SceneCard scene={defaultScene} onActivate={mockOnActivate} />)

      // Initial state - blue button with inline styles
      const getButton = () => container.querySelector('.absolute.bottom-2.right-2 > div')
      expect(getButton()).toHaveStyle({ backgroundColor: 'rgb(105, 165, 209)' })

      // Click to activate
      await user.click(screen.getByText('Movie Night'))

      // Button should still be present during state changes
      await waitFor(() => {
        expect(getButton()).toBeInTheDocument()
      })

      // Button should still be present in success state
      await waitFor(() => {
        expect(getButton()).toBeInTheDocument()
      })

      // Should have check icon in success state (represented by SVG)
      const buttonSvg = getButton().querySelector('svg')
      expect(buttonSvg).toBeInTheDocument()

      // Return to normal after timeout
      act(() => {
        vi.advanceTimersByTime(2000)
      })

      await waitFor(() => {
        expect(getButton()).toHaveStyle({ backgroundColor: 'rgb(105, 165, 209)' })
      })

      vi.useRealTimers()
    })
  })

  describe('Edge cases', () => {
    it('should handle missing scene attributes', () => {
      const minimalScene = {
        entity_id: 'scene.minimal',
        state: 'scening'
      }

      expect(() => {
        render(<SceneCard scene={minimalScene} onActivate={mockOnActivate} />)
      }).not.toThrow()

      expect(screen.getByText('scene.minimal')).toBeInTheDocument()
    })

    it('should handle very long scene names', () => {
      const longNameScene = {
        entity_id: 'scene.test',
        state: 'scening',
        attributes: {
          friendly_name: 'This is a very long scene name that should be truncated properly'
        }
      }

      render(<SceneCard scene={longNameScene} onActivate={mockOnActivate} />)

      const nameElement = screen.getByText('This is a very long scene name that should be truncated properly')
      expect(nameElement).toHaveClass('truncate')
    })

    it('should handle rapid state changes during activation', async () => {
      vi.useFakeTimers()
      const user = userEvent.setup()
      
      // Mock a slow activation
      let resolveActivation
      const activationPromise = new Promise(resolve => {
        resolveActivation = resolve
      })
      mockOnActivate.mockReturnValue(activationPromise)

      const { unmount } = render(<SceneCard scene={defaultScene} onActivate={mockOnActivate} />)

      // Start activation
      await user.click(screen.getByText('Movie Night'))

      // Unmount component before activation completes
      unmount()

      // Complete activation - should not cause errors
      resolveActivation()

      // Fast-forward timers to ensure no pending timeouts cause issues
      act(() => {
        vi.runAllTimers()
      })

      vi.useRealTimers()
    })
  })
})