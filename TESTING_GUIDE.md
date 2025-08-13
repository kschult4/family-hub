# Home Dashboard Testing Guide

## Overview

This guide provides comprehensive instructions for running, developing, and maintaining the test suite for the Home Dashboard functionality.

## Quick Start

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch

# UI test runner (optional)
npm run test:ui
```

## Test Suite Structure

```
src/__tests__/
├── services/           # API and WebSocket service tests
├── hooks/              # Custom React hook tests  
├── components/         # UI component tests
├── integration/        # Full workflow integration tests
└── config/            # Mock data and configuration tests

src/test/
├── setup.js           # Global test configuration
└── utils.js           # Shared test utilities
```

## Test Categories

### Unit Tests
Focus on individual components and functions in isolation.

**Run specific unit tests:**
```bash
npm test services
npm test hooks  
npm test components
```

**Coverage targets:**
- Services: >95%
- Hooks: >90% 
- Components: >95%

### Integration Tests
Test complete user workflows and component interactions.

**Run integration tests:**
```bash
npm test integration
```

**Coverage targets:**
- Integration: >85%
- Critical paths: 100%

### Performance Tests
Validate rendering and interaction performance.

**Key metrics:**
- Component render time: <100ms
- Large dataset handling: 50+ items
- Memory leak detection
- Touch responsiveness: <16ms

## Writing Tests

### Test Structure (AAA Pattern)

```javascript
describe('Component/Function Name', () => {
  beforeEach(() => {
    // Arrange - Setup test conditions
  })

  it('should perform expected behavior', async () => {
    // Arrange - Setup specific test data
    const mockProps = { ... }
    
    // Act - Perform the action being tested
    render(<Component {...mockProps} />)
    await user.click(screen.getByText('Button'))
    
    // Assert - Verify the results
    expect(mockCallback).toHaveBeenCalledWith(expectedValue)
  })
})
```

### Component Testing Template

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MyComponent from '../MyComponent.jsx'

describe('MyComponent', () => {
  const mockOnAction = vi.fn()
  const defaultProps = {
    data: mockData,
    onAction: mockOnAction
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render with required props', () => {
      render(<MyComponent {...defaultProps} />)
      expect(screen.getByText('Expected Text')).toBeInTheDocument()
    })

    it('should handle missing optional props', () => {
      expect(() => {
        render(<MyComponent data={mockData} />)
      }).not.toThrow()
    })
  })

  describe('User Interactions', () => {
    it('should call callback on button click', async () => {
      const user = userEvent.setup()
      render(<MyComponent {...defaultProps} />)
      
      await user.click(screen.getByText('Action Button'))
      
      expect(mockOnAction).toHaveBeenCalledWith(expectedValue)
    })
  })

  describe('Edge Cases', () => {
    it('should handle error states gracefully', () => {
      const errorProps = { ...defaultProps, error: new Error('Test error') }
      
      expect(() => {
        render(<MyComponent {...errorProps} />)
      }).not.toThrow()
    })
  })
})
```

### Hook Testing Template

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import useMyHook from '../useMyHook.js'

describe('useMyHook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useMyHook())
    
    expect(result.current.data).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should handle async operations', async () => {
    const { result } = renderHook(() => useMyHook())
    
    await act(async () => {
      await result.current.performAction()
    })
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    
    expect(result.current.data).toHaveLength(expectedLength)
  })
})
```

## Mocking Strategies

### External Services

```javascript
// Mock Home Assistant API
vi.mock('../../services/homeAssistant.js', () => ({
  haApi: {
    getStates: vi.fn().mockResolvedValue(mockStates),
    toggleDevice: vi.fn().mockResolvedValue({ success: true }),
    // ... other methods
  }
}))

// Mock WebSocket
const mockWebSocket = {
  connect: vi.fn().mockResolvedValue(),
  close: vi.fn(),
  subscribe: vi.fn().mockReturnValue(vi.fn()), // Returns unsubscribe function
  getConnectionState: vi.fn().mockReturnValue(true)
}

vi.mock('../../services/haWebSocket.js', () => ({
  createWebSocketConnection: vi.fn(() => mockWebSocket)
}))
```

### React Beautiful DnD

```javascript
// Mock drag and drop library
vi.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children, onDragEnd }) => (
    <div data-testid="drag-drop-context" data-on-drag-end={!!onDragEnd}>
      {children}
    </div>
  ),
  Droppable: ({ children }) => children({
    droppableProps: { 'data-testid': 'droppable' },
    innerRef: vi.fn(),
    placeholder: <div data-testid="placeholder" />
  }, { isDraggingOver: false }),
  Draggable: ({ children, draggableId }) => children({
    innerRef: vi.fn(),
    draggableProps: { 'data-testid': `draggable-${draggableId}` },
    dragHandleProps: { 'data-drag-handle': true }
  }, { isDragging: false })
}))
```

### Browser APIs

```javascript
// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
global.localStorage = mockLocalStorage

// Mock WebSocket
global.WebSocket = vi.fn(() => ({
  send: vi.fn(),
  close: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  readyState: 1
}))

// Mock fetch
global.fetch = vi.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockData)
  })
)
```

## Test Utilities

### Custom Render Helpers

```javascript
// test/utils.js
import { render } from '@testing-library/react'

export function renderWithProviders(ui, options = {}) {
  // Add any providers needed for testing
  return render(ui, options)
}

export function mockDeviceEntity(entityId, state, attributes = {}) {
  return {
    entity_id: entityId,
    state,
    attributes: {
      friendly_name: attributes.friendly_name || entityId,
      ...attributes
    },
    last_changed: '2024-01-01T12:00:00.000Z',
    last_updated: '2024-01-01T12:00:00.000Z'
  }
}

export function createMockWebSocket() {
  const mockWS = {
    send: vi.fn(),
    close: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    readyState: 1
  }
  
  // Helper methods for testing
  mockWS.simulateMessage = (data) => {
    const messageHandler = mockWS.addEventListener.mock.calls
      .find(call => call[0] === 'message')?.[1]
    if (messageHandler) {
      messageHandler(new MessageEvent('message', {
        data: JSON.stringify(data)
      }))
    }
  }
  
  return mockWS
}

export async function waitFor(callback, options = {}) {
  const timeout = options.timeout || 1000
  const interval = options.interval || 50
  const startTime = Date.now()
  
  return new Promise((resolve, reject) => {
    const checkCondition = () => {
      try {
        const result = callback()
        if (result) {
          resolve(result)
        } else if (Date.now() - startTime >= timeout) {
          reject(new Error('Timeout waiting for condition'))
        } else {
          setTimeout(checkCondition, interval)
        }
      } catch (error) {
        if (Date.now() - startTime >= timeout) {
          reject(error)
        } else {
          setTimeout(checkCondition, interval)
        }
      }
    }
    checkCondition()
  })
}
```

### Touch Event Testing

```javascript
// Simulate touch long press
export function simulateLongPress(element, duration = 500) {
  vi.useFakeTimers()
  
  fireEvent.touchStart(element, {
    touches: [{ clientX: 100, clientY: 100 }]
  })
  
  vi.advanceTimersByTime(duration)
  
  vi.useRealTimers()
}

// Mock touch event
export function mockTouchEvent(touches = []) {
  return {
    touches,
    changedTouches: touches,
    targetTouches: touches,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn()
  }
}
```

## Common Testing Patterns

### Async Testing

```javascript
// Testing async operations
it('should handle async operations', async () => {
  const mockAsyncFunction = vi.fn().mockResolvedValue('success')
  
  const { result } = renderHook(() => useAsyncHook(mockAsyncFunction))
  
  await act(async () => {
    await result.current.performAsync()
  })
  
  await waitFor(() => {
    expect(result.current.loading).toBe(false)
  })
  
  expect(result.current.data).toBe('success')
})
```

### Error Testing

```javascript
// Testing error states
it('should handle errors gracefully', async () => {
  const error = new Error('Test error')
  mockService.mockRejectedValue(error)
  
  const { result } = renderHook(() => useMyHook())
  
  await act(async () => {
    await result.current.performAction()
  })
  
  expect(result.current.error).toBe(error)
  expect(result.current.loading).toBe(false)
})
```

### Timer Testing

```javascript
// Testing components with timers
it('should handle timeouts correctly', () => {
  vi.useFakeTimers()
  
  const { result } = renderHook(() => useTimer())
  
  act(() => {
    result.current.startTimer()
  })
  
  // Fast-forward time
  act(() => {
    vi.advanceTimersByTime(1000)
  })
  
  expect(result.current.timeElapsed).toBe(1000)
  
  vi.useRealTimers()
})
```

### Cleanup Testing

```javascript
// Testing cleanup on unmount
it('should cleanup resources on unmount', () => {
  const mockCleanup = vi.fn()
  const mockSubscribe = vi.fn(() => mockCleanup)
  
  const { unmount } = renderHook(() => {
    useEffect(() => {
      const unsubscribe = mockSubscribe()
      return unsubscribe
    }, [])
  })
  
  unmount()
  
  expect(mockCleanup).toHaveBeenCalled()
})
```

## Debugging Tests

### Debug Failed Tests

```javascript
// Add debug information to failing tests
it('should debug failing test', () => {
  const { container } = render(<Component />)
  
  // Print DOM structure
  screen.debug()
  
  // Print specific elements
  console.log(container.innerHTML)
  
  // Query debugging
  screen.getByRole('button', { name: /submit/i })
  // If this fails, try:
  screen.getAllByRole('button')
  // To see what buttons exist
})
```

### Test Environment Issues

```javascript
// Check test environment
beforeEach(() => {
  console.log('Window dimensions:', window.innerWidth, window.innerHeight)
  console.log('Local storage available:', !!global.localStorage)
  console.log('WebSocket available:', !!global.WebSocket)
})
```

### Performance Debugging

```javascript
// Measure test performance
it('should measure performance', () => {
  const startTime = performance.now()
  
  render(<ExpensiveComponent data={largeDataset} />)
  
  const endTime = performance.now()
  const renderTime = endTime - startTime
  
  expect(renderTime).toBeLessThan(100) // 100ms threshold
})
```

## Test Data Management

### Mock Data Setup

```javascript
// Create realistic mock data
const createMockDevices = (count = 10) => {
  return Array.from({ length: count }, (_, i) => ({
    entity_id: `light.device_${i}`,
    state: i % 2 === 0 ? 'on' : 'off',
    attributes: {
      friendly_name: `Device ${i}`,
      brightness: Math.floor(Math.random() * 255),
      rgb_color: [
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255),
        Math.floor(Math.random() * 255)
      ]
    },
    last_changed: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    last_updated: new Date(Date.now() - Math.random() * 86400000).toISOString()
  }))
}

// Test edge cases
const createEdgeCaseData = () => ({
  emptyData: [],
  unavailableDevice: {
    entity_id: 'light.broken',
    state: 'unavailable',
    attributes: { friendly_name: 'Broken Light' }
  },
  maxBrightness: {
    entity_id: 'light.bright',
    state: 'on',
    attributes: { brightness: 255 }
  },
  zeroBrightness: {
    entity_id: 'light.dim',
    state: 'on', 
    attributes: { brightness: 0 }
  }
})
```

### Test Data Validation

```javascript
// Validate mock data structure
describe('Mock Data Validation', () => {
  it('should have valid entity structure', () => {
    const devices = createMockDevices(5)
    
    devices.forEach(device => {
      expect(device).toHaveProperty('entity_id')
      expect(device).toHaveProperty('state')
      expect(device).toHaveProperty('attributes')
      expect(device.entity_id).toMatch(/^[a-z_]+\.[a-z0-9_]+$/)
    })
  })
})
```

## Continuous Integration

### GitHub Actions Setup

```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

### Coverage Requirements

```javascript
// vitest.config.js
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        },
        // Stricter requirements for critical components
        'src/services/': {
          branches: 95,
          functions: 95,
          lines: 95,
          statements: 95
        },
        'src/hooks/': {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        }
      }
    }
  }
})
```

## Best Practices

### Do's
- ✅ Test user behavior, not implementation details
- ✅ Use descriptive test names that explain the scenario
- ✅ Mock external dependencies consistently
- ✅ Test error states and edge cases
- ✅ Keep tests independent and isolated
- ✅ Use setup/teardown for consistent test environment
- ✅ Test accessibility features

### Don'ts
- ❌ Test internal component state directly
- ❌ Mock modules that you're testing
- ❌ Write tests that depend on other tests
- ❌ Ignore error console output
- ❌ Skip edge cases and error scenarios
- ❌ Test implementation details over behavior

### Performance Considerations
- Run tests in parallel when possible
- Use `vi.clearAllMocks()` instead of recreating mocks
- Minimize DOM queries in loops
- Use `screen.getByTestId()` for performance-critical queries
- Clean up resources (timers, subscriptions) in tests

---

This testing guide ensures comprehensive coverage and maintainable tests for the Home Dashboard functionality. Follow these patterns and practices to maintain high code quality and reliable functionality.