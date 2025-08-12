import { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, ShieldX, Clock, Home, Users, Siren, Lock, Unlock } from 'lucide-react';

export default function RingAlarmWidget({ 
  alarmData = {}, 
  onArmHome, 
  onArmAway, 
  onDisarm,
  onShowStatus 
}) {
  const [isChanging, setIsChanging] = useState(false);
  const [localStatus, setLocalStatus] = useState(null);

  const {
    status = 'disarmed', // 'disarmed', 'armed_home', 'armed_away', 'pending', 'triggered'
    isConnected = false,
    lastChanged = null,
    batteryStatus = {},
    sensorStatuses = []
  } = alarmData;

  // Use local status if available, otherwise use prop status
  const currentStatus = localStatus || status;

  const getStatusIcon = () => {
    switch (currentStatus) {
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
    switch (currentStatus) {
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
    switch (currentStatus) {
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
      // Update local state immediately for visual feedback
      switch (action) {
        case 'home':
          setLocalStatus('armed_home');
          await onArmHome?.();
          break;
        case 'away':
          setLocalStatus('armed_away');
          await onArmAway?.();
          break;
        case 'disarm':
          setLocalStatus('disarmed');
          await onDisarm?.();
          break;
      }
    } catch (error) {
      console.error('Failed to change alarm status:', error);
      // Reset local status on error
      setLocalStatus(null);
    } finally {
      setTimeout(() => setIsChanging(false), 2000);
    }
  };

  const isArmed = currentStatus === 'armed_home' || currentStatus === 'armed_away';

  if (!isConnected) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 h-full flex flex-col">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <Siren className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Not connected</p>
          </div>
        </div>
      </div>
    );
  }

  const handleCardClick = () => {
    if (isChanging) return;
    
    if (isArmed) {
      handleAction('disarm');
    } else {
      // Default to arm away when clicking to arm
      handleAction('away');
    }
  };

  const getCardStyles = () => {
    if (isArmed) {
      return 'border-red-500 bg-red-50';
    }
    return 'border-green-500 bg-green-50';
  };

  return (
    <div 
      className={`rounded-lg p-4 border-2 h-full flex flex-col cursor-pointer transition-all duration-200 active:scale-95 ${getCardStyles()}`}
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-center mb-3">
        <Siren className="w-8 h-8" />
      </div>

      {/* Status Label - Center of Card */}
      <div className="flex-1 flex items-center justify-center mt-3">
        <h2 className={`text-3xl font-bold ${
          isArmed ? 'text-red-500' : 'text-green-500'
        }`}>
          {isArmed ? 'Armed' : 'Disarmed'}
        </h2>
      </div>

      {/* Bottom Section - Action Button */}
      <div className="flex-1 flex items-end justify-center pb-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          className={`w-full py-4 rounded-lg text-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            isArmed 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-green-500 text-white hover:bg-green-600'
          } ${isChanging ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isChanging}
        >
          {isChanging ? (
            <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              {isArmed ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              {isArmed ? 'Disarm' : 'Arm'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}