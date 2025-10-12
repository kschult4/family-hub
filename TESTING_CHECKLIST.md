# Testing Checklist - Smart Home Removal

## Post-Removal Testing Checklist

### ✅ Navigation & Layout
- [ ] Only "ALERTS" and "FAMILY" tabs visible in footer
- [ ] No "HOME" tab present
- [ ] Default tab is "ALERTS" on page load
- [ ] Tab switching works smoothly
- [ ] No console errors on page load

### ✅ Alerts Dashboard
- [ ] Shopping list displays correctly
- [ ] Can add new grocery items via "+" button
- [ ] Can check/uncheck grocery items
- [ ] Can delete grocery items
- [ ] Tasks list displays correctly
- [ ] Can add new tasks
- [ ] Can edit tasks
- [ ] Can delete tasks
- [ ] Calendar widget displays
- [ ] Weather widget works (if configured)
- [ ] Meal plan displays current week

### ✅ Family Tab
- [ ] Shows placeholder message about removed features
- [ ] Message explains smart home removal
- [ ] Displays suggestions for future features
- [ ] No errors in console when viewing Family tab

### ✅ Modals & Interactions
- [ ] Add Grocery modal opens and works
- [ ] Add Task modal opens and works
- [ ] Meals modal opens and works
- [ ] Voice control button works (desktop only)
- [ ] All modals close properly

### ✅ Console Checks (Browser DevTools)
- [ ] No errors about missing Home Assistant modules
- [ ] No errors about missing home components
- [ ] No errors about useHomeAssistant hook
- [ ] No errors about useMotionDetection hook
- [ ] No MQTT connection errors
- [ ] Firebase connection works (if configured)

### ✅ Mobile Responsive
- [ ] Layout adapts to mobile screen
- [ ] Footer navigation works on mobile
- [ ] Modals display properly on mobile
- [ ] Touch interactions work

### ✅ Build & Production
- [ ] `npm run build` completes successfully
- [ ] No build errors or warnings (except Tailwind deprecation warnings)
- [ ] Production build runs with `npm run preview`

## Expected Behavior

### What Should Work:
✅ Grocery list management
✅ Task management
✅ Meal planning
✅ Calendar integration (if API key configured)
✅ Voice commands
✅ Firebase sync (if configured)
✅ PWA installation

### What Should NOT Be Present:
❌ HOME tab
❌ Smart home device controls
❌ Ring alarm/camera widgets
❌ Sonos media player
❌ Motion detection alerts
❌ Home Assistant references in console

## Testing URL
- Development: http://localhost:5173/
- Run: `npm run dev`

## Known Limitations After Removal:
1. Family location tracking is no longer available (was dependent on Home Assistant)
2. Motion detection camera alerts removed
3. No smart device controls

## If You Find Issues:
1. Check browser console for errors
2. Verify environment variables are set correctly (Firebase, Google APIs)
3. Clear browser cache if seeing old cached versions
4. Try incognito/private browsing mode
