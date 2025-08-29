# Family Location Tracker Feature

A real-time family location tracking system integrated with Home Assistant, providing visual status and interactive maps.

## Overview

The Family Location Tracker displays family members as colored avatar circles in a two-column layout:
- **Home Column**: Shows family members currently at home
- **Away Column**: Shows family members who are away from home

## Features

### Visual Design
- **Circular Avatars**: 96px circles with thick colored borders from the app's color palette
- **Smooth Animations**: Framer Motion animations for column transitions and interactions
- **Status Indicators**: Small home/away badges on each avatar
- **Responsive Layout**: Two-column grid that works on desktop and mobile

### Interactive Elements
- **Tap to View Map**: Clicking any avatar opens a full-screen map modal
- **Real-time Updates**: WebSocket connections provide instant location changes
- **Map Controls**: Zoom, pan, center on person, and external Google Maps links

### Home Assistant Integration
- **Person Entities**: Tracks `person.*` entities from Home Assistant
- **Device Trackers**: Uses device tracker data for location accuracy
- **Zone Detection**: Automatically detects home/away status using HA zones
- **Real-time Sync**: WebSocket subscriptions for instant updates

## Technical Implementation

### Components
- `FamilyView.jsx` - Main family tracker dashboard
- `LocationMapModal.jsx` - Interactive map modal component
- Extended `useHomeAssistant.js` hook with person entity support

### Data Model
```javascript
// Person Entity Structure
{
  entity_id: "person.mom",
  state: "home" | "away" | "unknown",
  attributes: {
    friendly_name: "Mom",
    latitude: 40.7829,
    longitude: -73.9654,
    gps_accuracy: 12,
    source: "device_tracker.mom_phone",
    picture: "/api/image/path"
  }
}
```

### Mock Data
Includes sample person entities for development:
- `person.mom` (home)
- `person.dad` (away)
- `zone.home` configuration

## Setup Requirements

### Home Assistant Configuration
1. **Person Entities**: Configure person entities in HA
2. **Device Trackers**: Set up phone tracking (HA Companion App recommended)
3. **Home Zone**: Define home zone with appropriate radius

### Environment Variables
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_HA_BASE_URL=your_ha_instance_url
VITE_HA_TOKEN=your_ha_long_lived_token
```

## Usage

1. **Mock Data Mode**: Works immediately with sample family members
2. **Production Mode**: Requires Home Assistant setup with person entities
3. **Map Integration**: Requires Google Maps API key for map modal

## Color Palette

Family members are assigned colors from a rotating palette:
- Blue (`border-blue-500`)
- Green (`border-green-500`) 
- Purple (`border-purple-500`)
- Orange (`border-orange-500`)
- Pink (`border-pink-500`)

## Future Enhancements

- [ ] Multiple children support with expandable family list
- [ ] Location history and timeline views
- [ ] Geofence notifications and alerts
- [ ] Battery level indicators from device trackers
- [ ] Custom location nicknames (Work, School, etc.)
- [ ] Family member groups and shared locations

## Development Notes

- Uses existing Home Assistant infrastructure
- Leverages Framer Motion for smooth animations
- Follows the app's existing design patterns and color scheme
- Fully responsive design with mobile-first approach
- Error handling for missing location data or API failures