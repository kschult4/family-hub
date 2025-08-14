export const mockDevices = [
  {
    entity_id: "light.living_room",
    state: "on",
    attributes: {
      friendly_name: "Living Room Light",
      brightness: 200,
      rgb_color: [255, 255, 255],
      supported_features: 63
    },
    last_changed: "2024-01-15T14:30:00.000000+00:00",
    last_updated: "2024-01-15T14:30:00.000000+00:00"
  },
  {
    entity_id: "light.bedroom",
    state: "off",
    attributes: {
      friendly_name: "Bedroom Light",
      brightness: 150,
      rgb_color: [255, 200, 150],
      supported_features: 63
    },
    last_changed: "2024-01-15T12:15:00.000000+00:00",
    last_updated: "2024-01-15T12:15:00.000000+00:00"
  },
  {
    entity_id: "light.kitchen",
    state: "on",
    attributes: {
      friendly_name: "Kitchen Light",
      brightness: 255,
      rgb_color: [255, 255, 255],
      supported_features: 63
    },
    last_changed: "2024-01-15T08:00:00.000000+00:00",
    last_updated: "2024-01-15T08:00:00.000000+00:00"
  },
  {
    entity_id: "switch.kitchen_coffee_maker",
    state: "off",
    attributes: {
      friendly_name: "Coffee Maker",
      icon: "mdi:coffee"
    },
    last_changed: "2024-01-15T06:30:00.000000+00:00",
    last_updated: "2024-01-15T06:30:00.000000+00:00"
  },
  {
    entity_id: "switch.porch_light",
    state: "on",
    attributes: {
      friendly_name: "Porch Light",
      icon: "mdi:lightbulb"
    },
    last_changed: "2024-01-15T18:00:00.000000+00:00",
    last_updated: "2024-01-15T18:00:00.000000+00:00"
  },
  {
    entity_id: "switch.garage_door_opener",
    state: "off",
    attributes: {
      friendly_name: "Garage Door Opener",
      icon: "mdi:garage"
    },
    last_changed: "2024-01-15T16:00:00.000000+00:00",
    last_updated: "2024-01-15T16:00:00.000000+00:00"
  },
  {
    entity_id: "light.bathroom",
    state: "off",
    attributes: {
      friendly_name: "Bathroom Light",
      brightness: 180,
      rgb_color: [255, 240, 200],
      supported_features: 63
    },
    last_changed: "2024-01-15T11:00:00.000000+00:00",
    last_updated: "2024-01-15T11:00:00.000000+00:00"
  },
  {
    entity_id: "light.hallway",
    state: "on",
    attributes: {
      friendly_name: "Hallway Light",
      brightness: 120,
      rgb_color: [255, 255, 255],
      supported_features: 63
    },
    last_changed: "2024-01-15T13:45:00.000000+00:00",
    last_updated: "2024-01-15T13:45:00.000000+00:00"
  },
  {
    entity_id: "switch.living_room_fan",
    state: "on",
    attributes: {
      friendly_name: "Living Room Fan",
      icon: "mdi:fan"
    },
    last_changed: "2024-01-15T14:20:00.000000+00:00",
    last_updated: "2024-01-15T14:20:00.000000+00:00"
  },
  {
    entity_id: "switch.bedroom_fan",
    state: "off",
    attributes: {
      friendly_name: "Bedroom Fan",
      icon: "mdi:fan"
    },
    last_changed: "2024-01-15T09:15:00.000000+00:00",
    last_updated: "2024-01-15T09:15:00.000000+00:00"
  },
  {
    entity_id: "climate.upstairs_thermostat",
    state: "heat",
    attributes: {
      friendly_name: "Upstairs Thermostat",
      current_temperature: 72,
      temperature: 74,
      target_temp_high: 76,
      target_temp_low: 68,
      hvac_modes: ["off", "heat", "cool", "auto"],
      supported_features: 59
    },
    last_changed: "2024-01-15T10:00:00.000000+00:00",
    last_updated: "2024-01-15T10:15:00.000000+00:00"
  },
  {
    entity_id: "climate.downstairs_thermostat",
    state: "cool",
    attributes: {
      friendly_name: "Downstairs Thermostat",
      current_temperature: 70,
      temperature: 68,
      target_temp_high: 72,
      target_temp_low: 65,
      hvac_modes: ["off", "heat", "cool", "auto"],
      supported_features: 59
    },
    last_changed: "2024-01-15T09:30:00.000000+00:00",
    last_updated: "2024-01-15T09:45:00.000000+00:00"
  },
  {
    entity_id: "media_player.spotify",
    state: "playing",
    attributes: {
      friendly_name: "Spotify",
      media_title: "Bohemian Rhapsody",
      media_artist: "Queen",
      media_album: "A Night at the Opera",
      volume_level: 0.6,
      is_volume_muted: false,
      supported_features: 149463
    },
    last_changed: "2024-01-15T14:30:00.000000+00:00",
    last_updated: "2024-01-15T14:30:00.000000+00:00"
  },
  {
    entity_id: "alarm_control_panel.ring_alarm",
    state: "disarmed",
    attributes: {
      friendly_name: "Ring Alarm",
      code_arm_required: false,
      supported_features: 15
    },
    last_changed: "2024-01-15T07:00:00.000000+00:00",
    last_updated: "2024-01-15T07:00:00.000000+00:00"
  },
  {
    entity_id: "camera.front_door",
    state: "idle",
    attributes: {
      friendly_name: "Front Door Camera",
      motion_detection: true,
      brand: "Ring",
      model: "Video Doorbell",
      supported_features: 1,
      last_motion: null
    },
    last_changed: "2024-01-15T13:20:00.000000+00:00",
    last_updated: "2024-01-15T13:20:00.000000+00:00"
  },
  {
    entity_id: "camera.back_door",
    state: "idle",
    attributes: {
      friendly_name: "Back Door Camera",
      motion_detection: true,
      brand: "Ring",
      model: "Security Camera",
      supported_features: 1,
      last_motion: null
    },
    last_changed: "2024-01-15T13:20:00.000000+00:00",
    last_updated: "2024-01-15T13:20:00.000000+00:00"
  },
  {
    entity_id: "camera.garage",
    state: "idle",
    attributes: {
      friendly_name: "Garage Camera",
      motion_detection: true,
      brand: "Ring",
      model: "Security Camera",
      supported_features: 1,
      last_motion: null
    },
    last_changed: "2024-01-15T13:20:00.000000+00:00",
    last_updated: "2024-01-15T13:20:00.000000+00:00"
  },
  {
    entity_id: "climate.main_thermostat",
    state: "heat",
    attributes: {
      friendly_name: "Main Thermostat",
      current_temperature: 72,
      temperature: 74,
      hvac_modes: ["off", "heat", "cool", "auto"],
      hvac_mode: "heat",
      preset_mode: "home",
      preset_modes: ["home", "away", "sleep"],
      supported_features: 17
    },
    last_changed: "2024-01-15T14:00:00.000000+00:00",
    last_updated: "2024-01-15T14:00:00.000000+00:00"
  }
];

export const mockScenes = [
  {
    entity_id: "scene.movie_time",
    state: "scening",
    attributes: {
      friendly_name: "Movie Time",
      icon: "mdi:movie"
    },
    last_changed: "2024-01-15T19:00:00.000000+00:00",
    last_updated: "2024-01-15T19:00:00.000000+00:00"
  },
  {
    entity_id: "scene.good_morning",
    state: "scening",
    attributes: {
      friendly_name: "Good Morning",
      icon: "mdi:weather-sunny"
    },
    last_changed: "2024-01-15T06:00:00.000000+00:00",
    last_updated: "2024-01-15T06:00:00.000000+00:00"
  },
  {
    entity_id: "scene.good_night",
    state: "scening",
    attributes: {
      friendly_name: "Good Night",
      icon: "mdi:weather-night"
    },
    last_changed: "2024-01-14T22:30:00.000000+00:00",
    last_updated: "2024-01-14T22:30:00.000000+00:00"
  },
  {
    entity_id: "scene.dinner_time",
    state: "scening",
    attributes: {
      friendly_name: "Dinner Time",
      icon: "mdi:food"
    },
    last_changed: "2024-01-15T17:30:00.000000+00:00",
    last_updated: "2024-01-15T17:30:00.000000+00:00"
  },
  {
    entity_id: "scene.romantic_evening",
    state: "scening",
    attributes: {
      friendly_name: "Romantic Evening",
      icon: "mdi:heart"
    },
    last_changed: "2024-01-13T20:00:00.000000+00:00",
    last_updated: "2024-01-13T20:00:00.000000+00:00"
  }
];

export const mockStates = [...mockDevices, ...mockScenes];

export function getMockDevicesByDomain(domain) {
  return mockStates.filter(device => device.entity_id.startsWith(`${domain}.`));
}

export function getMockDeviceById(entityId) {
  return mockStates.find(device => device.entity_id === entityId);
}

export function updateMockDeviceState(entityId, newState, newAttributes = {}) {
  const device = getMockDeviceById(entityId);
  if (device) {
    device.state = newState;
    device.attributes = { ...device.attributes, ...newAttributes };
    device.last_updated = new Date().toISOString();
    device.last_changed = new Date().toISOString();
  }
  return device;
}