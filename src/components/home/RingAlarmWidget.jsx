import { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, ShieldX, Clock, Home, Users, X } from 'lucide-react';

export default function RingAlarmWidget({ 
  alarmData = {}, 
  onArmHome, 
  onArmAway, 
  onDisarm,
  onShowStatus 
}) {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  const {
    status = 'disarmed', // 'disarmed', 'armed_home', 'armed_away', 'pending', 'triggered'
    isConnected = false,
    lastChanged = null,
    batteryStatus = {},
    sensorStatuses = []
  } = alarmData;

  const getStatusIcon = () => {
    switch (status) {
      case 'armed_home':
        return <Home className="w-6 h-6 text-blue-600" />;
      case 'armed_away':
        return <ShieldCheck className="w-6 h-6 text-green-600" />;
      case 'pending':
        return <Clock className="w-6 h-6 text-yellow-600" />;
      case 'triggered':
        return <ShieldAlert className="w-6 h-6 text-red-600" />;
      default:
        return <ShieldX className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'armed_home':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'armed_away':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'triggered':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'armed_home':
        return 'Armed (Home)';
      case 'armed_away':
        return 'Armed (Away)';
      case 'pending':
        return 'Arming...';
      case 'triggered':
        return 'TRIGGERED!';
      default:
        return 'Disarmed';
    }
  };

  const handleAction = async (action) => {
    if (isChanging) return;
    
    setIsChanging(true);
    try {
      switch (action) {
        case 'home':
          await onArmHome?.();
          break;
        case 'away':
          await onArmAway?.();
          break;
        case 'disarm':
          await onDisarm?.();
          break;
      }
    } catch (error) {
      console.error('Failed to change alarm status:', error);
    } finally {
      setTimeout(() => setIsChanging(false), 2000);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 h-full flex flex-col">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <Shield className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 font-medium">Ring Alarm</p>
            <p className="text-xs text-gray-500">Not connected</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`rounded-lg p-4 border-2 h-full flex flex-col ${getStatusColor()}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="font-semibold text-sm">Ring Alarm</span>
          </div>
          <button
            onClick={() => setShowStatusModal(true)}
            className="p-1 hover:bg-black/10 rounded-full transition-colors"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>

        {/* Status */}
        <div className="text-center mb-4 flex-1 flex flex-col justify-center">
          <h3 className="text-lg font-bold">{getStatusText()}</h3>
          {lastChanged && (
            <p className="text-xs opacity-75">
              Last changed: {new Date(lastChanged).toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Quick Actions - Home and Away only */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <button
            onClick={() => handleAction('home')}
            disabled={isChanging || status === 'armed_home'}
            className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              status === 'armed_home' || isChanging
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200 active:scale-95'
            }`}
          >
            <Home className="w-5 h-5 mx-auto mb-1" />
            Home
          </button>
          
          <button
            onClick={() => handleAction('away')}
            disabled={isChanging || status === 'armed_away'}
            className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              status === 'armed_away' || isChanging
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-green-100 text-green-700 hover:bg-green-200 active:scale-95'
            }`}
          >
            <Users className="w-5 h-5 mx-auto mb-1" />
            Away
          </button>
        </div>

        {/* Loading Indicator */}
        {isChanging && (
          <div className="mt-3 flex items-center justify-center">
            <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-60" />
          </div>
        )}
      </div>

      {/* Status Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Ring Alarm Status</h2>
              <button
                onClick={() => setShowStatusModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Status Details */}
            <div className="p-4 space-y-4">
              {/* Current Status */}
              <div className={`p-4 rounded-lg ${getStatusColor()}`}>
                <div className="flex items-center gap-3">
                  {getStatusIcon()}
                  <div>
                    <h3 className="font-semibold">{getStatusText()}</h3>
                    {lastChanged && (
                      <p className="text-sm opacity-75">
                        Changed: {new Date(lastChanged).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Battery Status */}
              {Object.keys(batteryStatus).length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Battery Status</h4>
                  <div className="space-y-2">
                    {Object.entries(batteryStatus).map(([device, level]) => (
                      <div key={device} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{device}</span>
                        <span className={`text-sm font-medium ${
                          level > 20 ? 'text-green-600' : level > 10 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {level}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sensor Statuses */}
              {sensorStatuses.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Sensors</h4>
                  <div className="grid gap-2">
                    {sensorStatuses.map((sensor, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{sensor.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          sensor.status === 'ok' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {sensor.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}