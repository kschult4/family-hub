# Family Hub Codebase Audit & Refactoring Workplan

## Overview

This workplan addresses critical issues found in the React + Vite smart home dashboard that affect performance, stability, and maintainability. The primary focus is eliminating console spam, removing dead code, optimizing bundle size, and restoring stable real-time updates for Sonos/media players without UI flicker.

## Key Findings Summary

- **Bundle Size**: 682.68 kB (184.80 kB gzipped) - significantly oversized
- **Console Spam**: 140+ console.log/error calls, many in render paths
- **Mock Data Leakage**: Mock data imported in production code paths
- **Over-broad Subscriptions**: Wildcard subscriptions (`'*'`) causing unnecessary re-renders
- **Test Failures**: 57/126 tests failing, primarily WebSocket/HA integration
- **Mega-modules**: 6 files >500 lines, largest being SonosMediaPlayerCard (710 lines)

## Proposed Change Sets (Ordered by Risk/Impact)

### PR #1: Console Log Cleanup (Low Risk, ~150 lines)
**Timeline**: 1-2 hours  
**Risk Level**: 🟢 Low

**Changes**:
- Remove debug console.log statements from production paths
- Replace remaining logging with environment-gated logger
- Add VITE_DEBUG environment variable support

**Files**:
- `src/hooks/useHomeAssistant.js` (12 console calls)
- `src/components/home/SonosMediaPlayerCard.jsx` (20 console calls)
- `src/hooks/useRingAlarmMqtt.js` (9 console calls)
- `src/services/ringMqttClient.js` (25 console calls)

### PR #2: Bundle Optimization - Mock Data Isolation (Medium Risk, ~200 lines)
**Timeline**: 2-3 hours  
**Risk Level**: 🟡 Medium

**Changes**:
- Move mock imports to dynamic imports with environment guards
- Ensure mock data doesn't ship in production bundles
- Configure Vite for better tree-shaking

**Files**:
- `src/hooks/useHomeAssistant.js`
- `src/hooks/useHomeAssistantEntity.js`
- `src/services/homeAssistantClient.js`
- `vite.config.js`

### PR #3: Sonos Real-time Optimization (High Risk, ~300 lines)
**Timeline**: 4-6 hours  
**Risk Level**: 🟠 High

**Changes**:
- Replace wildcard subscription `'*'` with scoped `media_player.*` subscriptions
- Implement debouncing/batching for state updates (500ms window)
- Add optimistic UI for user interactions
- Use shallow comparison instead of JSON.stringify

**Files**:
- `src/components/home/SonosMediaPlayerCard.jsx`
- `src/hooks/useHomeAssistantEntity.js`
- `src/services/homeAssistantClient.js`

### PR #4: Mega-module Decomposition (Medium Risk, ~250 lines)
**Timeline**: 3-4 hours  
**Risk Level**: 🟡 Medium

**Changes**:
- Split SonosMediaPlayerCard into smaller components
- Extract reusable hooks from large components
- Break down homeAssistantClient service

**Files**:
- `src/components/home/SonosMediaPlayerCard.jsx` → multiple files
- `src/services/homeAssistantClient.js` → service + normalizers

### PR #5: Test Infrastructure Fixes (Low Risk, ~100 lines)
**Timeline**: 2-3 hours  
**Risk Level**: 🟢 Low

**Changes**:
- Fix WebSocket mocking in test environment
- Add missing environment variables for tests
- Update test timeout configurations

**Files**:
- `src/__tests__/services/haWebSocket.test.js`
- `src/__tests__/hooks/useHomeAssistant.test.js`
- `vitest.config.js`

## Test Strategy

### Unit Tests
- **Pre-change**: Snapshot current render counts with React Profiler
- **Post-change**: Verify ≤1 re-render per 500ms in idle state
- **Coverage**: Maintain >80% line coverage for modified files

### Integration Tests
- **Sonos Widget**: No flicker during track/volume changes
- **Real-time Updates**: 300-700ms response time to HA events
- **Mock vs Live**: Environment switching works correctly

### E2E Tests
- **Bundle Size**: Verify <600kB total, <150kB gzipped
- **Performance**: Lighthouse performance score >90
- **WebSocket**: Connection stability with auto-reconnect

## Rollback Plan

Each PR includes:
1. **Git tags** before/after changes for quick rollback
2. **Feature flags** for new real-time logic (can disable via env var)
3. **Backward compatibility** maintained for existing API contracts
4. **Staging verification** before production deployment

## Success Metrics

### Performance Targets
- **Bundle Size**: <600kB total (<150kB gzipped)
- **Render Count**: ≤1 React re-render per 500ms in idle
- **Memory Usage**: <50MB heap growth per hour
- **Console Output**: Zero production console.log statements

### Real-time Targets
- **Sonos Updates**: 300-700ms latency from HA event to UI
- **Connection Stability**: <5s reconnect time on disconnect
- **UI Responsiveness**: No visible flicker during state changes
- **Subscription Efficiency**: Only relevant entity updates processed

### Quality Targets
- **Test Success**: >95% test pass rate
- **TypeScript**: Zero type errors, optional strict mode
- **Lighthouse**: >90 performance, >95 accessibility
- **Bundle Analysis**: Zero mock/test code in production chunks

## Logging Policy

### What to Keep
- Error logging for user-facing failures
- Performance metrics (startup time, API latency)
- Security events (auth failures, rate limiting)

### What to Remove
- Debug logs in render cycles
- Verbose state change logging
- Development-only diagnostics

### Implementation
- Environment-gated logger: `VITE_DEBUG=sonos,ha npm run dev`
- Structured logging with levels (error, warn, info, debug)
- Automatic PII redaction for tokens/credentials

## Quick Wins (≤30 min each, Zero Risk)

1. **Remove console.log from render paths** (5 occurrences identified)
2. **Fix Tailwind deprecated color warnings** (lightBlue → sky, etc.)
3. **Remove unused import statements** (lint will catch these)
4. **Add missing TypeScript strict checks** to tsconfig.json
5. **Clean up empty/commented code blocks** in service files

These can be applied immediately without approval for instant performance gains.