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

### ✅ PR #1: Console Log Cleanup (COMPLETED)
**Timeline**: ✅ 1 hour completed  
**Risk Level**: 🟢 Low  
**Results**: Bundle reduced 1.53 kB, console calls reduced 32%

### PR #2: Test Infrastructure Fixes (Low Risk, ~100 lines)
**Timeline**: 2-3 hours  
**Risk Level**: 🟢 Low  
**Priority**: High - Need green baseline before high-risk changes

**Changes**:
- Fix WebSocket mocking in test environment  
- Add missing environment variables for tests
- Update test timeout configurations
- Resolve 57/126 failing tests

**Files**:
- `src/__tests__/services/haWebSocket.test.js`
- `src/__tests__/hooks/useHomeAssistant.test.js`
- `vitest.config.js`
- `.env.test` (create)

### PR #3: Bundle Optimization - Mock Data Isolation (Medium Risk, ~200 lines)
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

### PR #4: Sonos Real-time Optimization (High Risk, ~300 lines)
**Timeline**: 4-6 hours  
**Risk Level**: 🟠 High  
**Prerequisite**: Technical Approach Doc required before implementation

**Changes**:
- Replace wildcard subscription `'*'` with scoped `media_player.*` subscriptions
- Implement debouncing/batching for state updates (500ms window)
- Add optimistic UI for user interactions
- Use shallow comparison instead of JSON.stringify

**Files**:
- `src/components/home/SonosMediaPlayerCard.jsx`
- `src/hooks/useHomeAssistantEntity.js`
- `src/services/homeAssistantClient.js`

### PR #5: SonosMediaPlayerCard Incremental Refactor (Medium Risk, broken into sub-PRs)
**Timeline**: 6-8 hours total across multiple PRs  
**Risk Level**: 🟡 Medium  
**Approach**: Small incremental changes for safe review

#### PR #5a: Extract Sonos Hooks (~100 lines)
- Extract `useSonosDevices` hook
- Extract `useSonosGrouping` hook  
- No UI changes, pure logic extraction

#### PR #5b: Split UI Components (~100 lines)
- Extract `SonosPlayerControls` component
- Extract `SonosVolumeControl` component
- Extract `SonosGroupManager` component

#### PR #5c: Extract Sonos Services (~100 lines)
- Create `sonosService.js` for business logic
- Move group management logic out of component
- Add proper error boundaries

**Files**:
- `src/components/home/SonosMediaPlayerCard.jsx` → decomposed
- `src/hooks/useSonosDevices.js` (new)
- `src/hooks/useSonosGrouping.js` (new)
- `src/components/home/SonosPlayerControls.jsx` (new)
- `src/components/home/SonosVolumeControl.jsx` (new)
- `src/components/home/SonosGroupManager.jsx` (new)
- `src/services/sonosService.js` (new)

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

### Logger Library Recommendations

**Recommended: Custom Minimal Logger** (preferred for bundle size)
```javascript
// src/utils/logger.js (~50 lines)
const isDev = import.meta.env.DEV;
const debugCategories = import.meta.env.VITE_DEBUG?.split(',') || [];

export const logger = {
  debug: (category, ...args) => isDev && debugCategories.includes(category) && console.debug(`[${category}]`, ...args),
  info: (...args) => console.info(...args),
  warn: (...args) => console.warn(...args),
  error: (...args) => console.error(...args)
};
```

**Alternative: debug library** (if more features needed)
- Bundle impact: +2.5kB minified
- Mature, widely used
- Built-in namespace filtering

**Implementation Plan**:
1. Environment-gated logger: `VITE_DEBUG=sonos,ha npm run dev`
2. Structured logging with levels (error, warn, info, debug)  
3. Automatic PII redaction for tokens/credentials
4. Production builds strip debug calls automatically

## Quick Wins (≤30 min each, Zero Risk)

1. ✅ **Remove console.log from render paths** (COMPLETED - 32% reduction)
2. **Fix Tailwind deprecated color warnings** (lightBlue → sky, etc.)
3. **Remove unused import statements** (lint will catch these)
4. **Add missing TypeScript strict checks** to tsconfig.json
5. **Clean up empty/commented code blocks** in service files

Remaining quick wins can be applied immediately for additional performance gains.