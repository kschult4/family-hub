import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Navigation, ZoomIn, ZoomOut, Maximize2, Users } from 'lucide-react';

export default function LocationMapModal({ person, isOpen, onClose }) {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(null);

  // Initialize map when modal opens
  useEffect(() => {
    if (!isOpen || !person || !window.google) return;

    const initMap = () => {
      try {
        const latitude = person.attributes.latitude;
        const longitude = person.attributes.longitude;

        if (!latitude || !longitude) {
          setMapError('Location coordinates not available');
          return;
        }

        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: { lat: latitude, lng: longitude },
          zoom: 16,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ],
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false
        });

        // Add marker for person's location
        new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: mapInstance,
          title: person.attributes.friendly_name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#4F46E5',
            fillOpacity: 1,
            strokeWeight: 3,
            strokeColor: '#FFFFFF'
          }
        });

        // Add accuracy circle if available
        if (person.attributes.gps_accuracy) {
          new window.google.maps.Circle({
            strokeColor: '#4F46E5',
            strokeOpacity: 0.3,
            strokeWeight: 2,
            fillColor: '#4F46E5',
            fillOpacity: 0.1,
            map: mapInstance,
            center: { lat: latitude, lng: longitude },
            radius: person.attributes.gps_accuracy
          });
        }

        setMap(mapInstance);
        setIsMapLoaded(true);
        setMapError(null);
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Failed to load map');
      }
    };

    // Load Google Maps if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      script.onerror = () => setMapError('Failed to load Google Maps');
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      setMap(null);
      setIsMapLoaded(false);
      setMapError(null);
    };
  }, [isOpen, person]);

  // Map control functions
  const zoomIn = () => {
    if (map) {
      map.setZoom(map.getZoom() + 1);
    }
  };

  const zoomOut = () => {
    if (map) {
      map.setZoom(map.getZoom() - 1);
    }
  };

  const centerOnPerson = () => {
    if (map && person) {
      map.setCenter({
        lat: person.attributes.latitude,
        lng: person.attributes.longitude
      });
      map.setZoom(16);
    }
  };

  const openInGoogleMaps = () => {
    if (person) {
      const url = `https://www.google.com/maps?q=${person.attributes.latitude},${person.attributes.longitude}`;
      window.open(url, '_blank');
    }
  };

  if (!person) return null;

  const formatLastUpdated = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl overflow-hidden w-full max-w-4xl h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {person.attributes.friendly_name}'s Location
                  </h2>
                  <p className="text-sm text-gray-600">
                    Updated {formatLastUpdated(person.last_updated)}
                    {person.attributes.gps_accuracy && (
                      <span className="ml-2">• ±{person.attributes.gps_accuracy}m accuracy</span>
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Map Container */}
            <div className="flex-1 relative">
              {mapError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium">Map Unavailable</p>
                    <p className="text-sm text-gray-500 mt-1">{mapError}</p>
                    <button
                      onClick={openInGoogleMaps}
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Open in Google Maps
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div ref={mapRef} className="w-full h-full" />
                  
                  {!isMapLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading map...</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Map Controls */}
              {isMapLoaded && (
                <div className="absolute top-4 right-4 space-y-2">
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <button
                      onClick={zoomIn}
                      className="block w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors border-b border-gray-200"
                    >
                      <ZoomIn className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={zoomOut}
                      className="block w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <ZoomOut className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  
                  <button
                    onClick={centerOnPerson}
                    className="w-10 h-10 bg-primary text-white rounded-lg shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-colors"
                  >
                    <Navigation className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
                  Current Location
                </span>
                {person.state !== 'home' && (
                  <span>Status: {person.state}</span>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={openInGoogleMaps}
                  className="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Maximize2 className="w-4 h-4" />
                  <span>Open in Maps</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}