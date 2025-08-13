import { useState, useEffect, useCallback } from 'react';

const DEFAULT_LAYOUTS = {
  pi: [
    { id: 'lights', type: 'lights', x: 0, y: 0, w: 6, h: 4 },
    { id: 'scenes', type: 'scenes', x: 6, y: 0, w: 6, h: 4 },
    { id: 'climate', type: 'climate', x: 0, y: 4, w: 6, h: 3 },
    { id: 'media', type: 'media', x: 6, y: 4, w: 6, h: 3 },
    { id: 'security', type: 'security', x: 0, y: 7, w: 12, h: 2 }
  ],
  pwa: [
    { id: 'lights', type: 'lights', x: 0, y: 0, w: 12, h: 3 },
    { id: 'scenes', type: 'scenes', x: 0, y: 3, w: 12, h: 3 },
    { id: 'climate', type: 'climate', x: 0, y: 6, w: 12, h: 2 },
    { id: 'media', type: 'media', x: 0, y: 8, w: 12, h: 2 },
    { id: 'security', type: 'security', x: 0, y: 10, w: 12, h: 2 }
  ]
};

const WIDGET_TYPES = {
  lights: {
    name: 'Lights',
    description: 'Control smart lights',
    minW: 4, minH: 2, maxW: 8, maxH: 6
  },
  scenes: {
    name: 'Scenes',
    description: 'Activate Home Assistant scenes',
    minW: 4, minH: 2, maxW: 8, maxH: 6
  },
  climate: {
    name: 'Climate',
    description: 'Thermostat controls',
    minW: 4, minH: 2, maxW: 8, maxH: 4
  },
  media: {
    name: 'Media Player',
    description: 'Spotify and media controls',
    minW: 4, minH: 2, maxW: 12, maxH: 4
  },
  security: {
    name: 'Security',
    description: 'Ring Alarm and cameras',
    minW: 6, minH: 2, maxW: 12, maxH: 4
  },
  switches: {
    name: 'Switches',
    description: 'Smart switches and outlets',
    minW: 3, minH: 2, maxW: 6, maxH: 4
  }
};

function getStorageKey(interfaceType) {
  return `home-dashboard-layout-${interfaceType}`;
}

function loadLayoutFromStorage(interfaceType) {
  try {
    const stored = localStorage.getItem(getStorageKey(interfaceType));
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : DEFAULT_LAYOUTS[interfaceType];
    }
  } catch (error) {
    console.error('Error loading widget layout:', error);
  }
  return DEFAULT_LAYOUTS[interfaceType];
}

function saveLayoutToStorage(interfaceType, layout) {
  try {
    localStorage.setItem(getStorageKey(interfaceType), JSON.stringify(layout));
  } catch (error) {
    console.error('Error saving widget layout:', error);
  }
}

export function useWidgetConfig(interfaceType = 'pi') {
  const [layout, setLayout] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const loadedLayout = loadLayoutFromStorage(interfaceType);
      setLayout(loadedLayout);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  }, [interfaceType]);

  const saveLayout = useCallback((newLayout) => {
    try {
      setLayout(newLayout);
      saveLayoutToStorage(interfaceType, newLayout);
      setError(null);
    } catch (err) {
      console.error('Error saving layout:', err);
      setError(err);
    }
  }, [interfaceType]);

  const addWidget = useCallback((widgetType, position = {}) => {
    const widgetConfig = WIDGET_TYPES[widgetType];
    if (!widgetConfig) {
      setError(new Error(`Unknown widget type: ${widgetType}`));
      return;
    }

    const newWidget = {
      id: `${widgetType}-${Date.now()}`,
      type: widgetType,
      x: position.x || 0,
      y: position.y || 0,
      w: position.w || widgetConfig.minW,
      h: position.h || widgetConfig.minH,
      ...position
    };

    const newLayout = [...layout, newWidget];
    saveLayout(newLayout);
  }, [layout, saveLayout]);

  const removeWidget = useCallback((widgetId) => {
    const newLayout = layout.filter(widget => widget.id !== widgetId);
    saveLayout(newLayout);
  }, [layout, saveLayout]);

  const updateWidget = useCallback((widgetId, updates) => {
    const newLayout = layout.map(widget => 
      widget.id === widgetId 
        ? { ...widget, ...updates }
        : widget
    );
    saveLayout(newLayout);
  }, [layout, saveLayout]);

  const resetLayout = useCallback(() => {
    const defaultLayout = DEFAULT_LAYOUTS[interfaceType];
    saveLayout(defaultLayout);
  }, [interfaceType, saveLayout]);

  const getAvailableWidgetTypes = useCallback(() => {
    return Object.entries(WIDGET_TYPES).map(([type, config]) => ({
      type,
      ...config
    }));
  }, []);

  const validateWidget = useCallback((widget) => {
    const config = WIDGET_TYPES[widget.type];
    if (!config) return false;

    return (
      widget.w >= config.minW && 
      widget.w <= config.maxW &&
      widget.h >= config.minH && 
      widget.h <= config.maxH
    );
  }, []);

  const getWidgetConfig = useCallback((widgetType) => {
    return WIDGET_TYPES[widgetType] || null;
  }, []);

  return {
    layout,
    loading,
    error,
    saveLayout,
    addWidget,
    removeWidget,
    updateWidget,
    resetLayout,
    getAvailableWidgetTypes,
    validateWidget,
    getWidgetConfig
  };
}