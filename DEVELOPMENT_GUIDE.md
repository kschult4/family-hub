# Home Dashboard Development Guide

## Overview

This guide provides comprehensive instructions for developing, extending, and maintaining the Home Dashboard functionality. Follow these patterns and practices to ensure consistent, maintainable code.

## Getting Started

### Prerequisites

- **Node.js**: 18+ (LTS recommended)
- **npm**: 9+
- **Git**: For version control
- **VS Code**: Recommended editor with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - Vitest
  - ESLint

### Setup

```bash
# Clone repository
git clone https://github.com/your-org/family-hub.git
cd family-hub

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests in watch mode
npm run test:watch

# Start with mock data (default)
VITE_USE_MOCK_HA=true npm run dev

# Start with live Home Assistant
VITE_USE_MOCK_HA=false VITE_HA_BASE_URL=http://homeassistant.local:8123 VITE_HA_TOKEN=your_token npm run dev
```

### Project Structure

```
src/
├── components/home/           # Home Dashboard UI components
├── views/                     # Page-level components  
├── hooks/                     # Custom React hooks
├── services/                  # API clients and utilities
├── config/                    # Configuration and mock data
├── test/                      # Test utilities
└── __tests__/                 # Test suites
```

## Development Workflow

### 1. Feature Development Process

#### Planning Phase
1. **Define Requirements**: Clear user stories and acceptance criteria
2. **Design API**: Hook interfaces and component props
3. **Write Tests**: Test-driven development approach
4. **Implementation**: Build feature incrementally

#### Implementation Phase
```bash
# Create feature branch
git checkout -b feature/new-widget-type

# Write failing tests first
npm run test:watch

# Implement feature
# Code until tests pass

# Verify integration
npm run test
npm run build

# Commit changes
git add .
git commit -m "feat: add new widget type support"
```

### 2. Code Organization Patterns

#### Component Structure
```javascript
// DeviceCard.jsx - Example component structure
import { useState, useCallback, memo } from 'react'
import { Icon } from 'lucide-react'

// Props interface (add JSDoc for documentation)
/**
 * DeviceCard - Displays and controls a Home Assistant device
 * @param {Object} device - Home Assistant entity object
 * @param {Function} onToggle - Callback for toggle action
 * @param {Function} onLongPress - Callback for detailed controls
 */
const DeviceCard = memo(({ device, onToggle, onLongPress }) => {
  // 1. State declarations
  const [isPressed, setIsPressed] = useState(false)
  
  // 2. Computed values (with useMemo for expensive calculations)
  const isOn = device.state === 'on'
  const brightness = device.attributes?.brightness || 255
  
  // 3. Callback handlers (with useCallback for performance)
  const handleToggle = useCallback(() => {
    if (device.state !== 'unavailable') {
      onToggle?.(device.entity_id)
    }
  }, [onToggle, device.entity_id, device.state])
  
  // 4. Effect hooks (if needed)
  
  // 5. Helper functions
  const getStatusColor = () => {
    if (device.state === 'unavailable') return 'text-gray-400'
    return isOn ? 'text-yellow-600' : 'text-gray-600'
  }
  
  // 6. JSX render
  return (
    <div className={`card ${getStatusColor()}`} onClick={handleToggle}>
      {/* Component content */}
    </div>
  )
})

DeviceCard.displayName = 'DeviceCard'
export default DeviceCard
```

#### Hook Structure
```javascript
// useHomeAssistant.js - Example hook structure
import { useState, useEffect, useRef, useCallback } from 'react'

export function useHomeAssistant(config = {}) {
  // 1. Configuration and setup
  const {
    baseUrl = import.meta.env.VITE_HA_BASE_URL,
    token = import.meta.env.VITE_HA_TOKEN,
    useMockData = import.meta.env.VITE_USE_MOCK_HA === 'true'
  } = config

  // 2. State declarations (triple state pattern)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // 3. Refs for cleanup
  const wsRef = useRef(null)
  const timeoutRef = useRef(null)
  
  // 4. Helper functions
  const handleError = useCallback((err) => {
    console.error('useHomeAssistant error:', err)
    setError(err)
    setLoading(false)
  }, [])
  
  // 5. Main logic functions
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = useMockData 
        ? getMockData()
        : await api.getData(baseUrl, token)
      
      setData(result)
      setLoading(false)
    } catch (err) {
      handleError(err)
    }
  }, [baseUrl, token, useMockData, handleError])
  
  // 6. Action functions
  const performAction = useCallback(async (actionData) => {
    try {
      if (useMockData) {
        // Mock implementation
        return
      }
      
      await api.performAction(baseUrl, token, actionData)
    } catch (err) {
      handleError(err)
    }
  }, [baseUrl, token, useMockData, handleError])
  
  // 7. Effects for initialization and cleanup
  useEffect(() => {
    loadData()
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [loadData])
  
  // 8. Return hook interface
  return {
    data,
    loading,
    error,
    performAction,
    refresh: loadData
  }
}
```

### 3. State Management Patterns

#### Triple State Pattern
Always use consistent state structure for async operations:

```javascript
const [state, setState] = useState({
  data: null,      // The actual data
  loading: true,   // Loading indicator
  error: null      // Error state
})

// Update patterns
setState(prev => ({ ...prev, loading: true, error: null }))
setState(prev => ({ ...prev, data: result, loading: false }))
setState(prev => ({ ...prev, error: err, loading: false }))
```

#### Function Stability
Use `useCallback` for functions passed as props:

```javascript
const handleToggle = useCallback((entityId) => {
  // Implementation
}, [dependencies]) // Only include actual dependencies

// Pass stable references
<DeviceCard onToggle={handleToggle} />
```

#### Computed Values
Use `useMemo` for expensive calculations:

```javascript
const sortedDevices = useMemo(() => {
  return devices.sort((a, b) => a.name.localeCompare(b.name))
}, [devices])

const devicesByRoom = useMemo(() => {
  return devices.reduce((acc, device) => {
    const room = device.attributes.room || 'Other'
    acc[room] = acc[room] || []
    acc[room].push(device)
    return acc
  }, {})
}, [devices])
```

## Component Development

### 1. Creating New Components

#### UI Component Template
```javascript
// components/home/NewWidget.jsx
import { memo } from 'react'
import PropTypes from 'prop-types'

const NewWidget = memo(({ title, data, onAction, className = '' }) => {
  return (
    <div className={`new-widget ${className}`}>
      <h3>{title}</h3>
      {/* Widget content */}
    </div>
  )
})

NewWidget.displayName = 'NewWidget'

NewWidget.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array,
  onAction: PropTypes.func,
  className: PropTypes.string
}

export default NewWidget
```

#### Test Template
```javascript
// __tests__/components/home/NewWidget.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewWidget from '../../../components/home/NewWidget.jsx'

describe('NewWidget', () => {
  const defaultProps = {
    title: 'Test Widget',
    data: [],
    onAction: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render with required props', () => {
    render(<NewWidget {...defaultProps} />)
    expect(screen.getByText('Test Widget')).toBeInTheDocument()
  })

  it('should handle user interactions', async () => {
    const user = userEvent.setup()
    render(<NewWidget {...defaultProps} />)
    
    // Test interactions
    await user.click(screen.getByText('Test Widget'))
    
    expect(defaultProps.onAction).toHaveBeenCalled()
  })
})
```

### 2. Widget System Extension

#### Adding New Widget Types

1. **Define Widget Configuration**:
```javascript
// hooks/useWidgetConfig.js
const WIDGET_TYPES = {
  // ... existing types
  new_widget: {
    name: 'New Widget',
    description: 'Description of new widget',
    minW: 4, minH: 2,
    maxW: 8, maxH: 6,
    // Widget-specific configuration
    defaultSettings: {
      refreshInterval: 30000,
      showLabels: true
    }
  }
}
```

2. **Create Widget Component**:
```javascript
// components/home/NewWidgetType.jsx
import { memo, useEffect, useState } from 'react'

const NewWidgetType = memo(({ entities, settings, onUpdate }) => {
  const [localState, setLocalState] = useState(null)
  
  useEffect(() => {
    // Initialize widget
    const interval = setInterval(() => {
      // Refresh logic if needed
    }, settings.refreshInterval)
    
    return () => clearInterval(interval)
  }, [settings.refreshInterval])
  
  return (
    <div className="widget-container">
      {/* Widget UI */}
    </div>
  )
})

export default NewWidgetType
```

3. **Register in Dashboard**:
```javascript
// views/HomeDashboard.jsx
import NewWidgetType from '../components/home/NewWidgetType.jsx'

const renderWidget = (widget) => {
  const commonProps = {
    key: widget.id,
    entities: getEntitiesForWidget(widget.type),
    settings: widget.settings || {}
  }
  
  switch (widget.type) {
    case 'new_widget':
      return <NewWidgetType {...commonProps} onUpdate={handleWidgetUpdate} />
    // ... other cases
  }
}
```

### 3. Styling Guidelines

#### Tailwind CSS Patterns
```javascript
// Use consistent spacing and sizing
const cardClasses = `
  p-4 rounded-lg border-2 
  transition-all duration-200 
  cursor-pointer select-none
  hover:shadow-md active:scale-95
`

// State-based styling
const getStatusClasses = (state) => {
  const baseClasses = 'text-sm font-medium'
  const stateClasses = {
    on: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    off: 'text-gray-600 bg-gray-50 border-gray-200',
    unavailable: 'text-gray-400 bg-gray-100 border-gray-200 opacity-50'
  }
  return `${baseClasses} ${stateClasses[state] || stateClasses.off}`
}

// Responsive design
const gridClasses = `
  grid gap-3 sm:gap-4
  grid-cols-2 md:grid-cols-3 lg:grid-cols-4
  p-2 sm:p-4
`
```

#### Component Styling Best Practices
- Use Tailwind utility classes for consistency
- Create reusable class strings for common patterns
- Use state-based conditional styling
- Implement responsive design with mobile-first approach
- Ensure touch targets are minimum 44px on mobile

## Hook Development

### 1. Custom Hook Patterns

#### Data Fetching Hook Template
```javascript
export function useDataFetcher(url, options = {}) {
  const {
    immediate = true,
    dependencies = [],
    transform = (data) => data
  } = options
  
  const [state, setState] = useState({
    data: null,
    loading: immediate,
    error: null
  })
  
  const abortControllerRef = useRef(null)
  
  const fetchData = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    abortControllerRef.current = new AbortController()
    
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      const response = await fetch(url, {
        signal: abortControllerRef.current.signal
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      const transformedData = transform(data)
      
      setState({
        data: transformedData,
        loading: false,
        error: null
      })
    } catch (err) {
      if (err.name !== 'AbortError') {
        setState(prev => ({
          ...prev,
          loading: false,
          error: err
        }))
      }
    }
  }, [url, transform])
  
  useEffect(() => {
    if (immediate) {
      fetchData()
    }
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchData, immediate, ...dependencies])
  
  return {
    ...state,
    refetch: fetchData
  }
}
```

#### WebSocket Hook Template
```javascript
export function useWebSocket(url, options = {}) {
  const {
    onMessage,
    onConnect,
    onDisconnect,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5
  } = options
  
  const wsRef = useRef(null)
  const reconnectAttemptsRef = useRef(0)
  const [connectionState, setConnectionState] = useState('disconnected')
  
  const connect = useCallback(() => {
    try {
      wsRef.current = new WebSocket(url)
      setConnectionState('connecting')
      
      wsRef.current.onopen = () => {
        setConnectionState('connected')
        reconnectAttemptsRef.current = 0
        onConnect?.()
      }
      
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          onMessage?.(data)
        } catch (err) {
          console.error('WebSocket message parse error:', err)
        }
      }
      
      wsRef.current.onclose = () => {
        setConnectionState('disconnected')
        onDisconnect?.()
        
        // Attempt reconnection
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++
          setTimeout(connect, reconnectInterval)
        }
      }
    } catch (err) {
      console.error('WebSocket connection error:', err)
      setConnectionState('error')
    }
  }, [url, onMessage, onConnect, onDisconnect, reconnectInterval, maxReconnectAttempts])
  
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
    }
  }, [])
  
  const send = useCallback((data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data))
    }
  }, [])
  
  useEffect(() => {
    connect()
    
    return () => {
      disconnect()
    }
  }, [connect, disconnect])
  
  return {
    connectionState,
    send,
    reconnect: connect,
    disconnect
  }
}
```

### 2. Performance Optimization

#### Memoization Strategies
```javascript
// Expensive calculations
const processedData = useMemo(() => {
  return rawData
    .filter(item => item.active)
    .sort((a, b) => a.priority - b.priority)
    .map(item => ({
      ...item,
      displayName: formatDisplayName(item.name)
    }))
}, [rawData]) // Only recalculate when rawData changes

// Stable callback references
const handleAction = useCallback((action, payload) => {
  switch (action) {
    case 'toggle':
      return toggleDevice(payload.entityId)
    case 'update':
      return updateDevice(payload.entityId, payload.attributes)
    default:
      console.warn('Unknown action:', action)
  }
}, [toggleDevice, updateDevice])
```

#### Render Optimization
```javascript
// Prevent unnecessary re-renders with React.memo
const OptimizedComponent = memo(({ data, onAction }) => {
  return <div>{/* Component JSX */}</div>
}, (prevProps, nextProps) => {
  // Custom comparison for complex props
  return (
    prevProps.data === nextProps.data &&
    prevProps.onAction === nextProps.onAction
  )
})

// Or use shallow comparison (default)
const SimpleOptimizedComponent = memo(({ data, onAction }) => {
  return <div>{/* Component JSX */}</div>
})
```

## Testing Strategies

### 1. Component Testing

#### Interaction Testing
```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

it('should handle complex user interactions', async () => {
  const user = userEvent.setup()
  const mockOnLongPress = vi.fn()
  
  render(<DeviceCard device={mockDevice} onLongPress={mockOnLongPress} />)
  
  const card = screen.getByText('Living Room Light')
  
  // Test long press with pointer events
  await user.pointer([
    { keys: '[MouseLeft>]', target: card },
    { keys: '[/MouseLeft]' }
  ])
  
  await waitFor(() => {
    expect(mockOnLongPress).toHaveBeenCalledWith('light.living_room')
  })
})
```

#### Async State Testing
```javascript
it('should handle async state updates', async () => {
  const mockToggleDevice = vi.fn().mockImplementation(() =>
    new Promise(resolve => setTimeout(resolve, 100))
  )
  
  const { result } = renderHook(() => useHomeAssistant({
    toggleDevice: mockToggleDevice
  }))
  
  // Initial state
  expect(result.current.loading).toBe(true)
  
  await waitFor(() => {
    expect(result.current.loading).toBe(false)
  })
  
  // Perform action
  await act(async () => {
    await result.current.toggleDevice('light.test')
  })
  
  expect(mockToggleDevice).toHaveBeenCalledWith('light.test')
})
```

### 2. Integration Testing

#### Full Workflow Testing
```javascript
it('should complete device control workflow', async () => {
  const user = userEvent.setup()
  
  // Mock all dependencies
  useHomeAssistant.mockReturnValue({
    devices: mockDevices,
    loading: false,
    error: null,
    toggleDevice: vi.fn().mockResolvedValue()
  })
  
  render(<HomeDashboard />)
  
  // Wait for component to load
  await waitFor(() => {
    expect(screen.getByText('Living Room Light')).toBeInTheDocument()
  })
  
  // Interact with device
  await user.click(screen.getByText('Living Room Light'))
  
  // Verify action was called
  expect(mockToggleDevice).toHaveBeenCalledWith('light.living_room')
  
  // Verify UI update
  await waitFor(() => {
    expect(screen.getByText('Off')).toBeInTheDocument()
  })
})
```

## Debugging Tools

### 1. Development Tools

#### Debug Logging
```javascript
// Logger utility with categories
export const Logger = {
  debug: (category, message, data = {}) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${category.toUpperCase()}] ${message}`, data)
    }
  },
  
  performance: (label, fn) => {
    if (process.env.NODE_ENV === 'development') {
      console.time(label)
      const result = fn()
      console.timeEnd(label)
      return result
    }
    return fn()
  }
}

// Usage
Logger.debug('homeassistant', 'Device state updated', { entityId, newState })
Logger.performance('render-dashboard', () => render(<HomeDashboard />))
```

#### React DevTools Integration
```javascript
// Add display names for better debugging
const useHomeAssistant = (config) => {
  // Hook logic...
}
useHomeAssistant.displayName = 'useHomeAssistant'

// Debug context
if (process.env.NODE_ENV === 'development') {
  window.__DEBUG__ = {
    devices: () => devices,
    scenes: () => scenes,
    layout: () => layout,
    connectionState: () => isConnected
  }
}
```

### 2. Performance Monitoring

#### Component Performance
```javascript
// Performance monitoring hook
export function usePerformanceMonitor(componentName) {
  const renderCount = useRef(0)
  const startTime = useRef(performance.now())
  
  useEffect(() => {
    renderCount.current++
    
    const endTime = performance.now()
    const renderTime = endTime - startTime.current
    
    if (renderTime > 16) { // 60fps threshold
      console.warn(`Slow render: ${componentName} (${renderTime.toFixed(2)}ms)`)
    }
    
    if (renderCount.current % 10 === 0) {
      console.log(`${componentName} render count: ${renderCount.current}`)
    }
  })
  
  useEffect(() => {
    startTime.current = performance.now()
  })
}

// Usage in components
function HomeDashboard() {
  usePerformanceMonitor('HomeDashboard')
  // Component logic...
}
```

## Code Quality

### 1. ESLint Configuration
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    'react/prop-types': 'warn',
    'react-hooks/exhaustive-deps': 'error',
    'no-unused-vars': 'error',
    'no-console': 'warn',
    'prefer-const': 'error'
  }
}
```

### 2. Pre-commit Hooks
```bash
# Install husky
npm install --save-dev husky

# Set up pre-commit hook
npx husky add .husky/pre-commit "npm run test && npm run lint"
```

### 3. Code Review Checklist
- [ ] All tests passing
- [ ] No console.log statements in production code  
- [ ] Props validated with PropTypes or TypeScript
- [ ] Components memoized appropriately
- [ ] Hooks follow established patterns
- [ ] Error handling implemented
- [ ] Accessibility considered
- [ ] Performance implications reviewed

## Release Process

### 1. Version Management
```bash
# Update version
npm version patch # or minor/major

# Generate changelog
git log --oneline --since="2024-01-01" > CHANGELOG.md

# Create release tag
git tag -a v1.0.0 -m "Release version 1.0.0"
```

### 2. Deployment Checklist
- [ ] All tests passing (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Error monitoring enabled
- [ ] Health checks implemented

---

This development guide provides a comprehensive foundation for building and maintaining the Home Dashboard. Follow these patterns to ensure code quality, performance, and maintainability.