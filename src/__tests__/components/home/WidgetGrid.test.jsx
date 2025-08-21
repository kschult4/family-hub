import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import WidgetGrid from '../../../components/home/WidgetGrid.jsx'

// Mock react-beautiful-dnd
vi.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children, onDragEnd }) => (
    <div data-testid="drag-drop-context" data-on-drag-end={!!onDragEnd}>
      {children}
    </div>
  ),
  Droppable: ({ children }) => 
    children({
      droppableProps: { 'data-testid': 'droppable' },
      innerRef: vi.fn(),
      placeholder: <div data-testid="placeholder" />
    }, { isDraggingOver: false }),
  Draggable: ({ children, draggableId }) => 
    children({
      innerRef: vi.fn(),
      draggableProps: { 
        'data-testid': `draggable-${draggableId}`,
        style: {}
      },
      dragHandleProps: { 'data-drag-handle': true }
    }, { isDragging: false })
}))

describe('WidgetGrid component', () => {
  const mockOnDragEnd = vi.fn()
  const mockOnWidgetPress = vi.fn()
  const mockOnWidgetLongPress = vi.fn()

  const defaultProps = {
    onDragEnd: mockOnDragEnd,
    onWidgetPress: mockOnWidgetPress,
    onWidgetLongPress: mockOnWidgetLongPress
  }

  const mockWidgets = [
    {
      id: 'widget-1',
      type: 'lights',
      component: <div data-testid="widget-1-content">Light Controls</div>
    },
    {
      id: 'widget-2',
      type: 'scenes',
      component: <div data-testid="widget-2-content">Scene Controls</div>
    },
    {
      id: 'widget-3',
      type: 'climate',
      component: <div data-testid="widget-3-content">Climate Controls</div>
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render empty grid when no widgets provided', () => {
      render(<WidgetGrid {...defaultProps} />)

      expect(screen.getByTestId('drag-drop-context')).toBeInTheDocument()
      expect(screen.getByTestId('droppable')).toBeInTheDocument()
      expect(screen.getByTestId('placeholder')).toBeInTheDocument()
    })

    it('should render widgets in grid layout', () => {
      render(<WidgetGrid widgets={mockWidgets} {...defaultProps} />)

      expect(screen.getByTestId('widget-1-content')).toBeInTheDocument()
      expect(screen.getByTestId('widget-2-content')).toBeInTheDocument()
      expect(screen.getByTestId('widget-3-content')).toBeInTheDocument()
    })

    it('should apply correct grid classes', () => {
      const { container } = render(<WidgetGrid widgets={mockWidgets} {...defaultProps} />)
      
      const grid = container.querySelector('[data-testid="droppable"]')
      expect(grid).toHaveClass(
        'grid',
        'grid-cols-2',
        'md:grid-cols-3',
        'lg:grid-cols-4',
        'gap-3',
        'sm:gap-4',
        'p-2',
        'sm:p-4',
        'min-h-[200px]'
      )
    })

    it('should render drag handles for each widget', () => {
      render(<WidgetGrid widgets={mockWidgets} {...defaultProps} />)

      const dragHandles = document.querySelectorAll('[data-drag-handle="true"]')
      expect(dragHandles).toHaveLength(mockWidgets.length)
    })

    it('should apply draggable props to widget containers', () => {
      render(<WidgetGrid widgets={mockWidgets} {...defaultProps} />)

      expect(screen.getByTestId('draggable-widget-1')).toBeInTheDocument()
      expect(screen.getByTestId('draggable-widget-2')).toBeInTheDocument()
      expect(screen.getByTestId('draggable-widget-3')).toBeInTheDocument()
    })
  })

  describe('Widget interactions', () => {
    it('should call onWidgetPress when widget is clicked', async () => {
      const user = userEvent.setup()
      render(<WidgetGrid widgets={mockWidgets} {...defaultProps} />)

      await user.click(screen.getByTestId('widget-1-content'))

      expect(mockOnWidgetPress).toHaveBeenCalledWith(mockWidgets[0])
      expect(mockOnWidgetPress).toHaveBeenCalledTimes(1)
    })

    it('should call onWidgetLongPress on context menu', async () => {
      const user = userEvent.setup()
      render(<WidgetGrid widgets={mockWidgets} {...defaultProps} />)

      await user.pointer({
        keys: '[MouseRight]',
        target: screen.getByTestId('widget-1-content')
      })

      expect(mockOnWidgetLongPress).toHaveBeenCalledWith(mockWidgets[0])
    })

    it('should handle missing callback functions gracefully', async () => {
      const user = userEvent.setup()
      
      expect(() => {
        render(<WidgetGrid widgets={mockWidgets} />)
      }).not.toThrow()

      // Should not throw when clicking without callbacks
      await user.click(screen.getByTestId('widget-1-content'))
    })

    it('should handle touch long press', () => {
      vi.useFakeTimers()
      render(<WidgetGrid widgets={mockWidgets} {...defaultProps} />)

      const widget = screen.getByTestId('widget-1-content').closest('[data-drag-handle="true"]')
      
      fireEvent.touchStart(widget)

      // Fast-forward time to trigger long press
      vi.advanceTimersByTime(500)

      expect(mockOnWidgetLongPress).toHaveBeenCalledWith(mockWidgets[0])

      vi.useRealTimers()
    })

    it('should prevent context menu default behavior', () => {
      render(<WidgetGrid widgets={mockWidgets} {...defaultProps} />)

      const widget = screen.getByTestId('widget-1-content').closest('[data-drag-handle="true"]')
      const contextMenuEvent = new MouseEvent('contextmenu', { bubbles: true })
      const preventDefaultSpy = vi.spyOn(contextMenuEvent, 'preventDefault')

      fireEvent(widget, contextMenuEvent)

      expect(preventDefaultSpy).toHaveBeenCalled()
    })
  })

  describe('Drag and drop', () => {
    it('should setup DragDropContext with onDragEnd handler', () => {
      render(<WidgetGrid widgets={mockWidgets} {...defaultProps} />)

      const dragDropContext = screen.getByTestId('drag-drop-context')
      expect(dragDropContext).toHaveAttribute('data-on-drag-end', 'true')
    })

    it('should render droppable area with correct id', () => {
      render(<WidgetGrid widgets={mockWidgets} {...defaultProps} />)

      // The mock will render droppable props as data-testid
      expect(screen.getByTestId('droppable')).toBeInTheDocument()
    })

    it('should create draggable items with unique ids', () => {
      render(<WidgetGrid widgets={mockWidgets} {...defaultProps} />)

      mockWidgets.forEach(widget => {
        expect(screen.getByTestId(`draggable-${widget.id}`)).toBeInTheDocument()
      })
    })

    it('should include placeholder in droppable area', () => {
      render(<WidgetGrid widgets={mockWidgets} {...defaultProps} />)

      expect(screen.getByTestId('placeholder')).toBeInTheDocument()
    })

    // Note: Full drag and drop testing would require more complex mocking
    // of react-beautiful-dnd's internal state management
  })

  describe('Styling and layout', () => {
    it('should apply base widget styling', () => {
      const { container } = render(<WidgetGrid widgets={mockWidgets} {...defaultProps} />)

      const widgetElements = container.querySelectorAll('[data-drag-handle="true"]')
      widgetElements.forEach(widget => {
        expect(widget).toHaveClass(
          'bg-white',
          'rounded-lg',
          'shadow-md',
          'p-4',
          'cursor-pointer',
          'transition-all',
          'duration-200'
        )
      })
    })

    it('should apply hover and active states', () => {
      const { container } = render(<WidgetGrid widgets={mockWidgets} {...defaultProps} />)

      const widgetElements = container.querySelectorAll('[data-drag-handle="true"]')
      widgetElements.forEach(widget => {
        expect(widget).toHaveClass('hover:shadow-lg', 'active:scale-95')
      })
    })

    it('should handle empty widgets array', () => {
      render(<WidgetGrid widgets={[]} {...defaultProps} />)

      expect(screen.getByTestId('droppable')).toBeInTheDocument()
      expect(screen.getByTestId('placeholder')).toBeInTheDocument()
    })

    it('should handle undefined widgets prop', () => {
      expect(() => {
        render(<WidgetGrid {...defaultProps} />)
      }).not.toThrow()

      expect(screen.getByTestId('droppable')).toBeInTheDocument()
    })
  })

  describe('Responsive design', () => {
    it('should apply responsive grid classes', () => {
      const { container } = render(<WidgetGrid widgets={mockWidgets} {...defaultProps} />)
      
      const grid = container.querySelector('[data-testid="droppable"]')
      expect(grid).toHaveClass('grid-cols-2', 'md:grid-cols-3', 'lg:grid-cols-4')
    })

    it('should apply responsive gap and padding', () => {
      const { container } = render(<WidgetGrid widgets={mockWidgets} {...defaultProps} />)
      
      const grid = container.querySelector('[data-testid="droppable"]')
      expect(grid).toHaveClass('gap-3', 'sm:gap-4', 'p-2', 'sm:p-4')
    })
  })

  describe('Accessibility', () => {
    it('should make widgets clickable', () => {
      const { container } = render(<WidgetGrid widgets={mockWidgets} {...defaultProps} />)

      const widgetElements = container.querySelectorAll('[data-drag-handle="true"]')
      widgetElements.forEach(widget => {
        expect(widget).toHaveClass('cursor-pointer')
      })
    })

    it('should be keyboard accessible', async () => {
      const user = userEvent.setup()
      render(<WidgetGrid widgets={mockWidgets} {...defaultProps} />)

      const firstWidget = screen.getByTestId('widget-1-content').closest('[data-drag-handle="true"]')
      
      await user.tab()
      expect(firstWidget).toHaveFocus()

      await user.keyboard('{Enter}')
      expect(mockOnWidgetPress).toHaveBeenCalledWith(mockWidgets[0])
    })
  })

  describe('Performance', () => {
    it('should handle large number of widgets', () => {
      const manyWidgets = Array.from({ length: 50 }, (_, i) => ({
        id: `widget-${i}`,
        type: 'generic',
        component: <div key={i} data-testid={`widget-${i}-content`}>Widget {i}</div>
      }))

      expect(() => {
        render(<WidgetGrid widgets={manyWidgets} {...defaultProps} />)
      }).not.toThrow()

      expect(screen.getByTestId('widget-0-content')).toBeInTheDocument()
      expect(screen.getByTestId('widget-49-content')).toBeInTheDocument()
    })
  })

  describe('Edge cases', () => {
    it('should handle widgets with missing properties', () => {
      const incompleteWidgets = [
        {
          id: 'incomplete-1',
          component: <div data-testid="incomplete-content">Incomplete Widget</div>
        },
        {
          id: 'incomplete-2',
          type: 'lights'
          // Missing component
        }
      ]

      expect(() => {
        render(<WidgetGrid widgets={incompleteWidgets} {...defaultProps} />)
      }).not.toThrow()

      expect(screen.getByTestId('incomplete-content')).toBeInTheDocument()
    })

    it('should handle widgets with null or undefined components', () => {
      const nullComponentWidgets = [
        {
          id: 'null-widget',
          type: 'generic',
          component: null
        },
        {
          id: 'undefined-widget',
          type: 'generic',
          component: undefined
        }
      ]

      expect(() => {
        render(<WidgetGrid widgets={nullComponentWidgets} {...defaultProps} />)
      }).not.toThrow()
    })

    it('should handle rapid consecutive interactions', async () => {
      const user = userEvent.setup()
      render(<WidgetGrid widgets={mockWidgets} {...defaultProps} />)

      const widget = screen.getByTestId('widget-1-content')
      
      // Multiple rapid clicks
      await user.click(widget)
      await user.click(widget)
      await user.click(widget)

      expect(mockOnWidgetPress).toHaveBeenCalledTimes(3)
      expect(mockOnWidgetPress).toHaveBeenCalledWith(mockWidgets[0])
    })
  })
})