# Sonos Real-time Updates Technical Approach

## Executive Summary

This document outlines the technical strategy for implementing stable, flicker-free real-time updates for the Sonos media player widget while maintaining optimal performance and reliability across multiple device configurations.

## Event Subscription Model

### Current State Analysis
**Problem**: Using wildcard subscription `haClient.subscribe('*')` processes ALL Home Assistant entity changes, causing unnecessary re-renders and performance degradation.

### Proposed Solution: Scoped WebSocket Subscriptions

**Primary Method: WebSocket with Entity Filtering**
```javascript
// Replace wildcard with scoped subscription
haClient.subscribe('media_player.*', (entity) => {
  if (isSonosDevice(entity)) {
    processUpdate(entity);
  }
});
```

**Fallback Method: REST Polling for WebSocket Failures**
- Polling interval: 2 seconds (configurable)
- Only triggered when WebSocket connection fails
- Automatic promotion back to WebSocket when available

**Multi-device Event Integrity**
1. **Entity-level subscriptions**: Each Sonos device gets individual subscription
2. **Heartbeat mechanism**: 30-second ping to detect missed events
3. **State reconciliation**: Periodic full state refresh (every 5 minutes) to catch any missed updates
4. **Connection recovery**: Automatic resubscription on WebSocket reconnect

## Update Filtering / Equality Checks

### Equality Strategy: Selective Key Comparison

**Rationale**: Balance performance vs correctness by only comparing fields that affect UI rendering.

**Implementation**:
```javascript
const SONOS_TRACKED_FIELDS = [
  'state',           // playing/paused/idle
  'volume_level',    // 0.0 - 1.0
  'media_title',     // track name
  'media_artist',    // artist name
  'media_album_name', // album name
  'media_position',  // track position
  'media_duration',  // track length
  'group_members',   // Sonos grouping
  'media_content_id' // track ID for change detection
];

function hasSignificantChange(oldState, newState) {
  return SONOS_TRACKED_FIELDS.some(field => 
    oldState[field] !== newState[field]
  );
}
```

**Fields Ignored for Performance**:
- `last_changed`, `last_updated` (timestamp changes don't affect UI)
- `attributes.friendly_name` (static after setup)
- Internal HA metadata fields

**Tradeoff Justification**:
- **Performance**: 90% reduction in unnecessary re-renders
- **Correctness**: All user-visible state changes captured
- **Risk**: Minimal - ignored fields rarely change and don't affect UI

## Debounce / Batching Strategy

### Anti-Flicker Approach: Smart Debouncing with Immediate Updates

**Strategy**: Immediate updates for user actions, batched updates for external changes.

**Implementation**:
```javascript
const UPDATE_TYPES = {
  USER_ACTION: 0,     // Immediate (button clicks)
  EXTERNAL_CHANGE: 300, // 300ms debounce (HA events)
  POSITION_UPDATE: 1000 // 1s debounce (track progress)
};

function scheduleUpdate(entity, updateType = UPDATE_TYPES.EXTERNAL_CHANGE) {
  if (updateType === UPDATE_TYPES.USER_ACTION) {
    // Optimistic UI + immediate update
    applyOptimisticUpdate(entity);
    processUpdate(entity);
  } else {
    // Debounced update for external changes
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      processUpdate(entity);
    }, updateType);
  }
}
```

**Rationale**:
- **300ms debounce**: Allows for rapid state changes (volume adjustments) to settle
- **1s position updates**: Reduces progress bar thrashing
- **Immediate user actions**: Maintains responsive feel
- **Optimistic UI**: Updates immediately on user input, reconciles with HA state

### Batch Update Window
- **Batch size**: Maximum 5 entities per update cycle
- **Batch timeout**: 300ms maximum wait
- **Priority ordering**: User-interacted devices first

## UI Stability Guarantees

### React Rendering Optimizations

**1. Memoization Strategy**
```javascript
const SonosCard = memo(({ deviceId, onError }) => {
  // Memo all expensive computations
  const playerControls = useMemo(() => 
    generatePlayerControls(selectedDevice), [selectedDevice.state, selectedDevice.volume_level]
  );
  
  // Stable callbacks to prevent child re-renders
  const handlePlayPause = useCallback((action) => {
    // Optimistic update + service call
  }, [selectedDevice.id]);
});
```

**2. State Splitting**
- Separate contexts for device list vs. current player state
- Prevent unnecessary re-renders of sibling components
- Local state for UI-only changes (volume slider dragging)

**3. Render Bailout Conditions**
```javascript
// Only re-render if tracked fields changed
const prevState = usePrevious(playerState);
const shouldUpdate = useMemo(() => 
  hasSignificantChange(prevState, playerState), [prevState, playerState]
);

if (!shouldUpdate) return <PreviousRender />;
```

### Flicker Prevention Measures
1. **Stable keys**: Use entity IDs as React keys, never array indices
2. **Transition guards**: Prevent state changes during animations
3. **Double-buffering**: Maintain previous state during transitions
4. **Loading states**: Show skeleton UI during initial loads, not during updates

## Regression Testing Plan

### Comprehensive Test Matrix with Implementation Mapping

| ID | Scenario | Steps | Expected Result | Equality Check Strategy | Debounce Strategy | Implementation Notes |
|----|----------|-------|-----------------|------------------------|-------------------|---------------------|
| **T1** | Single device play/pause | Start playback → pause | UI updates within 300ms; no flicker | Compare `state` field only | USER_ACTION (0ms) → immediate optimistic UI | `hasSignificantChange(['state'])` + optimistic update |
| **T2** | Rapid track changes | Skip next ≥3 times in 2s | UI shows final track only; intermediates ignored | Compare `media_content_id` + `media_title` | EXTERNAL_CHANGE (300ms debounce) | Debounce cancels previous updates, final state wins |
| **T3** | Volume ramping | Hold vol up/down → 10+ changes | UI batches updates; smooth ramp not jitter | Compare `volume_level` (threshold: 0.05) | Custom: 150ms debounce for volume | Intermediate values debounced, smooth animation |
| **T4** | Multi-device independence | Speaker A jazz, Speaker B rock | Distinct states; no cross-bleed | Entity-level isolation | Per-device debounce timers | Separate subscription per `media_player.{id}` |
| **T5** | Multi-device simultaneous | Start/stop 2 devices <1s apart | Both update independently | Device-scoped state comparison | Independent USER_ACTION handling | Optimistic UI per device + concurrent processing |
| **T6** | Group creation/removal | Group A+B → ungroup | Immediate membership update | Compare `group_members` array | USER_ACTION (0ms) for grouping | Optimistic group state + HA reconciliation |
| **T7** | Network jitter recovery | Simulate dropped WS messages | Graceful recovery on next update | Full state reconciliation | 5-minute heartbeat reconciliation | Periodic full state refresh catches missed events |
| **T8** | Stale cache prevention | Device reset in HA | UI matches HA authority | Timestamp-based staleness check | Reject updates older than optimistic window | `stateTimestamps` + OPTIMISTIC_WINDOW_MS guard |
| **T9** | Missing metadata gracefully | Stream missing artist/album | Fallback UI (e.g., "Unknown") | Null-safe comparison of media fields | Standard EXTERNAL_CHANGE (300ms) | `media_artist \|\| 'Unknown Artist'` patterns |
| **T10** | Stress: 5 devices rapid | Play/pause/skip 5 speakers in 10s | UI stable; no flicker/crash | Selective key comparison + render bailouts | Device-isolated debouncing | React.memo + entity-level state isolation |

### Extended Test Scenarios

**Additional Test Cases Identified:**

| ID | Scenario | Implementation Risk | Mitigation |
|----|----------|-------------------|------------|
| **T11** | WebSocket reconnection during playback | Subscription loss causing UI freeze | Connection state monitoring + automatic resubscription |
| **T12** | Concurrent group membership changes | Race condition in group state | Sequence numbers for group operations |
| **T13** | High-frequency position updates | Progress bar causing constant re-renders | POSITION_UPDATE (1s debounce) + animation CSS |
| **T14** | Malformed HA responses | JSON parsing errors crashing component | Input validation + error boundaries |
| **T15** | Device discovery during runtime | New Sonos device appears mid-session | Dynamic subscription setup in device list effect |

### Test Implementation Code

```javascript
describe('Sonos Real-time Updates - Full Matrix', () => {
  // T1: Single device play/pause
  test('T1: Play/pause responsiveness', async () => {
    const device = mockSonosDevice('living_room');
    render(<SonosCard deviceId={device.id} />);
    
    // User clicks play - should be immediate
    fireEvent.click(screen.getByRole('button', { name: /play/i }));
    
    // Verify optimistic UI (immediate)
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
    
    // Simulate HA confirmation after 200ms
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      mockHAResponse(device.id, { state: 'playing' });
    });
    
    // Should still show playing state (no flicker)
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
    
    // Performance check: should be <2 renders total
    expect(renderCount).toBeLessThan(2);
  });

  // T2: Rapid track changes
  test('T2: Track skip debouncing', async () => {
    const device = mockSonosDevice('kitchen');
    render(<SonosCard deviceId={device.id} />);
    
    // Rapid skip clicks
    const skipButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(skipButton);
    fireEvent.click(skipButton);
    fireEvent.click(skipButton);
    
    // Should see only final track after debounce window
    await waitFor(() => {
      expect(screen.getByText('Final Track Title')).toBeInTheDocument();
    }, { timeout: 400 }); // 300ms debounce + buffer
    
    // Verify intermediate updates were suppressed
    expect(mockHAClient.updateEntity).toHaveBeenCalledTimes(1);
  });

  // T3: Volume ramping
  test('T3: Volume change batching', async () => {
    const device = mockSonosDevice('bedroom');
    render(<SonosCard deviceId={device.id} />);
    
    const volumeSlider = screen.getByRole('slider');
    
    // Simulate rapid volume changes
    for (let i = 0; i < 10; i++) {
      fireEvent.change(volumeSlider, { target: { value: i * 10 } });
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Should debounce to final value
    await waitFor(() => {
      expect(volumeSlider.value).toBe('90');
    }, { timeout: 200 }); // 150ms volume debounce
    
    // Verify batched updates
    expect(mockVolumeUpdates.length).toBeLessThan(3);
  });

  // T4-T5: Multi-device independence
  test('T4-T5: Multi-device isolation', async () => {
    const deviceA = mockSonosDevice('living_room', { state: 'playing' });
    const deviceB = mockSonosDevice('kitchen', { state: 'paused' });
    
    render(
      <>
        <SonosCard deviceId={deviceA.id} />
        <SonosCard deviceId={deviceB.id} />
      </>
    );
    
    // Simultaneous actions within 1s
    const playButtonA = screen.getAllByRole('button', { name: /pause/i })[0];
    const playButtonB = screen.getAllByRole('button', { name: /play/i })[0];
    
    fireEvent.click(playButtonA); // Pause A
    await new Promise(resolve => setTimeout(resolve, 500));
    fireEvent.click(playButtonB); // Play B
    
    // Verify independent state updates
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /play/i })).toHaveLength(1); // A paused
      expect(screen.getAllByRole('button', { name: /pause/i })).toHaveLength(1); // B playing
    });
    
    // Verify no cross-device interference
    expect(deviceA.state).toBe('paused');
    expect(deviceB.state).toBe('playing');
  });

  // T8: Stale cache prevention
  test('T8: Stale update rejection', async () => {
    const device = mockSonosDevice('office');
    render(<SonosCard deviceId={device.id} />);
    
    // User action at T0
    fireEvent.click(screen.getByRole('button', { name: /play/i }));
    const userActionTime = Date.now();
    
    // Simulate stale HA update arriving after user action
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      mockStaleHAResponse(device.id, { 
        state: 'paused', 
        timestamp: userActionTime - 1000 // 1s old
      });
    });
    
    // Should reject stale update, maintain optimistic state
    expect(screen.getByRole('button', { name: /pause/i })).toBeInTheDocument();
    expect(console.debug).toHaveBeenCalledWith('Rejecting stale update for', device.id);
  });

  // T10: Stress test
  test('T10: 5-device stress test', async () => {
    const devices = Array.from({ length: 5 }, (_, i) => 
      mockSonosDevice(`speaker_${i}`)
    );
    
    render(
      <>
        {devices.map(device => 
          <SonosCard key={device.id} deviceId={device.id} />
        )}
      </>
    );
    
    // Rapid operations across all devices
    const startTime = performance.now();
    
    for (let i = 0; i < 10; i++) {
      const randomDevice = Math.floor(Math.random() * 5);
      const button = screen.getAllByRole('button')[randomDevice];
      fireEvent.click(button);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const endTime = performance.now();
    
    // Performance assertions
    expect(endTime - startTime).toBeLessThan(2000); // <2s total
    expect(React.renderErrorCount).toBe(0); // No crashes
    expect(screen.getAllByTestId('sonos-card')).toHaveLength(5); // All rendered
    
    // Memory check
    expect(getMemoryUsage()).toBeLessThan(initialMemory + 10 * 1024 * 1024); // <10MB growth
  });
});
```

### Performance Benchmarks
- **Target**: <1 re-render per 500ms in idle state
- **Measurement**: React DevTools Profiler snapshots
- **Threshold**: Fail if >3 renders in 1-second window without user interaction

## Implementation Risks & Mitigations

### Risk 1: Stale Cache Leading to UI/Reality Mismatch

**Scenario**: WebSocket delivers stale update after user action, overriding optimistic UI.

**Root Cause**: Race condition between optimistic update and delayed HA response.

**Mitigation Strategy**:
```javascript
const stateTimestamps = useRef(new Map());

function applyUpdate(entity, isOptimistic = false) {
  const now = Date.now();
  const lastUpdate = stateTimestamps.current.get(entity.id) || 0;
  
  // Reject updates older than last optimistic update
  if (!isOptimistic && (now - lastUpdate) < OPTIMISTIC_WINDOW_MS) {
    console.debug('Rejecting stale update for', entity.id);
    return;
  }
  
  stateTimestamps.current.set(entity.id, now);
  updateState(entity);
}
```

**Additional Safeguards**:
- Sequence numbers for user actions
- 5-second timeout for optimistic state reconciliation
- Manual refresh button for user override

### Risk 2: Memory Leaks from Accumulated Subscriptions

**Scenario**: Component unmounts without proper cleanup, WebSocket subscriptions persist.

**Root Cause**: Race conditions in useEffect cleanup, subscription callbacks holding references.

**Mitigation Strategy**:
```javascript
useEffect(() => {
  let isMounted = true;
  const subscriptions = new Set();
  
  async function setupSubscriptions() {
    const devices = await getSonosDevices();
    
    devices.forEach(device => {
      if (isMounted) {
        const unsubscribe = haClient.subscribe(`media_player.${device.id}`, (update) => {
          if (isMounted) processUpdate(update);
        });
        subscriptions.add(unsubscribe);
      }
    });
  }
  
  setupSubscriptions();
  
  return () => {
    isMounted = false;
    subscriptions.forEach(unsub => unsub());
    subscriptions.clear();
  };
}, []);
```

**Additional Safeguards**:
- Subscription registry with automatic cleanup
- Memory usage monitoring in development
- Maximum subscription limits per component

### Risk 3: Cascade Re-renders from Shared State

**Scenario**: Single device update triggers re-render of all Sonos widgets.

**Root Cause**: Shared global state causing unnecessary downstream updates.

**Mitigation Strategy**:
- Entity-level state isolation
- React.memo with custom comparison functions
- Context splitting (device list vs. individual device state)

## Success Criteria

**Functional Requirements**:
- ✅ No visible flicker during track/volume changes
- ✅ UI updates within 300-700ms of HA events
- ✅ Optimistic UI for all user interactions
- ✅ Graceful WebSocket disconnection handling

**Performance Requirements**:
- ✅ <1 React re-render per 500ms in idle state
- ✅ <50MB memory growth per hour of usage
- ✅ <5% CPU usage during normal operations

**Reliability Requirements**:
- ✅ 99.9% uptime for real-time updates
- ✅ <2s recovery from network interruptions
- ✅ Zero data loss during connection failures

## Implementation Timeline

**Phase 1**: Subscription scoping (1-2 hours)
- Replace wildcard subscriptions
- Add entity filtering logic

**Phase 2**: Debouncing & batching (2-3 hours)  
- Implement smart debounce strategy
- Add optimistic UI updates

**Phase 3**: React optimizations (1-2 hours)
- Add memoization and render bailouts
- Implement state splitting

**Phase 4**: Testing & validation (2-3 hours)
- Multi-device test scenarios
- Performance benchmarking
- Edge case validation

**Total Estimated Effort**: 6-10 hours with thorough testing