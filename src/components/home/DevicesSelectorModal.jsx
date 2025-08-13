import { useState, useEffect } from 'react';
import { haClient } from '../../services/homeAssistantClient';
import { Lightbulb, ToggleLeft, Lock, Wind, Home, Wifi } from 'lucide-react';

const SUPPORTED_DOMAINS = ['light', 'switch', 'cover', 'lock', 'fan', 'binary_sensor'];

const getDomainIcon = (domain) => {
  switch (domain) {
    case 'light':
      return <Lightbulb className="w-5 h-5" />;
    case 'switch':
      return <ToggleLeft className="w-5 h-5" />;
    case 'cover':
      return <Home className="w-5 h-5" />;
    case 'lock':
      return <Lock className="w-5 h-5" />;
    case 'fan':
      return <Wind className="w-5 h-5" />;
    case 'binary_sensor':
      return <Wifi className="w-5 h-5" />;
    default:
      return <Home className="w-5 h-5" />;
  }
};

const getDomainColor = (domain) => {
  switch (domain) {
    case 'light':
      return 'bg-yellow-100 text-yellow-700';
    case 'switch':
      return 'bg-blue-100 text-blue-700';
    case 'cover':
      return 'bg-green-100 text-green-700';
    case 'lock':
      return 'bg-red-100 text-red-700';
    case 'fan':
      return 'bg-purple-100 text-purple-700';
    case 'binary_sensor':
      return 'bg-gray-100 text-gray-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

export function DevicesSelectorModal({ isOpen, onClose, selectedDevices = [], onDevicesChange }) {
  const [availableDevices, setAvailableDevices] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set(selectedDevices.map(d => d.id)));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDomain, setFilterDomain] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    const fetchDevices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const allStates = await haClient.getStates();
        
        // Filter for supported device types
        const devices = allStates.filter(entity => 
          SUPPORTED_DOMAINS.includes(entity.type) &&
          !entity.id.includes('_battery') && // Exclude battery sensors
          !entity.id.includes('_signal_strength') // Exclude signal strength sensors
        );
        
        setAvailableDevices(devices);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching devices:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [isOpen]);

  const handleDeviceToggle = (deviceId) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(deviceId)) {
      newSelectedIds.delete(deviceId);
    } else {
      newSelectedIds.add(deviceId);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleAddSelected = () => {
    const newSelectedDevices = availableDevices.filter(device => selectedIds.has(device.id));
    onDevicesChange(newSelectedDevices);
    onClose();
  };

  const handleCancel = () => {
    setSelectedIds(new Set(selectedDevices.map(d => d.id)));
    onClose();
  };

  // Filter devices based on domain and search term
  const filteredDevices = availableDevices.filter(device => {
    const matchesDomain = filterDomain === 'all' || device.type === filterDomain;
    const matchesSearch = searchTerm === '' || 
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  // Group devices by domain for better organization
  const devicesByDomain = filteredDevices.reduce((acc, device) => {
    if (!acc[device.type]) acc[device.type] = [];
    acc[device.type].push(device);
    return acc;
  }, {});

  // Get unique domains for filter dropdown
  const availableDomains = [...new Set(availableDevices.map(d => d.type))];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Select Devices</h2>
        
        {/* Filters */}
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {availableDomains.map(domain => (
                <option key={domain} value={domain}>
                  {domain.charAt(0).toUpperCase() + domain.slice(1)}s
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error loading devices: {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="flex-1 overflow-y-auto mb-4">
              {filteredDevices.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  {searchTerm || filterDomain !== 'all' ? 'No devices match your filters' : 'No devices available'}
                </p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(devicesByDomain).map(([domain, devices]) => (
                    <div key={domain} className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wider">
                        {domain}s ({devices.length})
                      </h3>
                      <div className="space-y-2">
                        {devices.map((device) => (
                          <label
                            key={device.id}
                            className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedIds.has(device.id)}
                              onChange={() => handleDeviceToggle(device.id)}
                              className="h-4 w-4 text-blue-600 rounded border-gray-300 mr-3"
                            />
                            
                            <div className={`flex items-center justify-center w-10 h-10 rounded-lg mr-3 ${getDomainColor(device.type)}`}>
                              {getDomainIcon(device.type)}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {device.name}
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-500 truncate">{device.id}</span>
                                {device.state && (
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                    device.state === 'on' || device.state === 'open' 
                                      ? 'bg-green-100 text-green-800' 
                                      : device.state === 'unavailable'
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {device.state}
                                  </span>
                                )}
                              </div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">
                  {selectedIds.size} device{selectedIds.size !== 1 ? 's' : ''} selected
                </span>
                <div className="flex space-x-2">
                  {selectedIds.size > 0 && (
                    <button
                      onClick={() => setSelectedIds(new Set())}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSelected}
                  disabled={selectedIds.size === 0}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Add Selected ({selectedIds.size})
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}