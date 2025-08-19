import { useState } from 'react';
import { Shield, ShieldAlert, ShieldCheck, ShieldX, Clock, Home, Users, Siren, Lock, Unlock, KeyRound, X } from 'lucide-react';
import { useHomeAssistantEntity } from '../../hooks/useHomeAssistantEntity';
import { useRingAlarmMqtt } from '../../hooks/useRingAlarmMqtt';
import AlarmSoundingModal from './AlarmSoundingModal';

export default function RingAlarmWidget({ 
  alarmPanelId,
  alarmData = {}, 
  onArmHome, 
  onArmAway, 
  onDisarm,
  onShowStatus 
}) {
  // Use Home Assistant integration if alarmPanelId is provided
  const {
    entity: haAlarm,
    loading: haLoading,
    error: haError,
    callService: haCallService,
    isConnected: haConnected
  } = useHomeAssistantEntity(alarmPanelId, !!alarmPanelId);
  
  // Use Ring MQTT integration for additional alarm data
  const {
    alarmStatus: mqttAlarmStatus,
    isConnected: mqttConnected,
    lastAlarmEvent,
    sensorStatuses,
    hasActiveMotion,
    getAlarmSummary
  } = useRingAlarmMqtt();
  
  const [isChanging, setIsChanging] = useState(false);
  const [localStatus, setLocalStatus] = useState(null);
  const [iconAnimating, setIconAnimating] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pendingAction, setPendingAction] = useState(null);
  const [pinError, setPinError] = useState('');
  
  const DEFAULT_PIN = '7870';

  // Use HA entity if available, otherwise fall back to legacy props
  const currentEntity = haAlarm || alarmData;
  const {
    state: status = 'disarmed',
    isConnected = haAlarm ? haConnected : false,
    lastChanged = null,
    batteryStatus = {},
    sensorStatuses: haSensorStatuses = [],
    codeArmRequired = false,
    codeFormat = null
  } = currentEntity;

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
      case 'armed_night':
        return 'Armed (Night)';
      case 'pending':
        return 'Arming...';
      case 'triggered':
        return 'TRIGGERED!';
      default:
        return 'Disarmed';
    }
  };

  const handleAction = async (action, code = null) => {
    if (isChanging) return;
    
    // Check if PIN is required and not provided
    if ((codeArmRequired || action === 'disarm') && !code && !haAlarm) {
      setPendingAction(action);
      setShowPinModal(true);
      return;
    }
    
    setIsChanging(true);
    setIconAnimating(true);
    
    try {
      // Update local state immediately for visual feedback
      const targetStatus = action === 'home' ? 'armed_home' : 
                          action === 'away' ? 'armed_away' : 
                          action === 'night' ? 'armed_night' : 'disarmed';
      setLocalStatus(targetStatus);
      
      let success = false;
      
      // Try MQTT first if connected, then fall back to Home Assistant
      if (mqttConnected) {
        console.log('🔄 Attempting Ring alarm command via MQTT...');
        const { ringMqttClient } = await import('../../services/ringMqttClient');
        success = await ringMqttClient.sendAlarmCommand(`arm_${action === 'disarm' ? 'disarm' : action}`);
        
        if (success) {
          console.log('✅ Ring alarm command sent via MQTT');
        } else {
          console.log('⚠️ MQTT command failed, trying Home Assistant fallback...');
        }
      }
      
      // Fall back to Home Assistant if MQTT failed or not connected
      if (!success && haAlarm) {
        console.log('🔄 Using Home Assistant alarm service...');
        switch (action) {
          case 'home':
            await haCallService('alarm_arm_home', code ? { code } : {});
            success = true;
            break;
          case 'away':
            await haCallService('alarm_arm_away', code ? { code } : {});
            success = true;
            break;
          case 'night':
            await haCallService('alarm_arm_night', code ? { code } : {});
            success = true;
            break;
          case 'disarm':
            await haCallService('alarm_disarm', code ? { code } : {});
            success = true;
            break;
        }
        
        if (success) {
          console.log('✅ Ring alarm command sent via Home Assistant');
        }
      }
      
      // Final fallback to legacy callback props
      if (!success) {
        console.log('🔄 Using legacy callback props...');
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
        success = true;
        console.log('✅ Ring alarm command sent via legacy callbacks');
      }
      
    } catch (error) {
      console.error('❌ Failed to change alarm status:', error);
      // Reset local status on error
      setLocalStatus(null);
    } finally {
      setTimeout(() => {
        setIsChanging(false);
        setIconAnimating(false);
      }, 2000);
    }
  };
  
  const handlePinSubmit = () => {
    if (!pendingAction) return;
    
    // Validate PIN (use DEFAULT_PIN if no specific validation needed)
    if (pinInput === DEFAULT_PIN || !codeFormat) {
      setShowPinModal(false);
      setPinInput('');
      setPinError('');
      handleAction(pendingAction, pinInput || DEFAULT_PIN);
      setPendingAction(null);
    } else {
      setPinError('Invalid PIN code');
    }
  };
  
  const closePinModal = () => {
    setShowPinModal(false);
    setPinInput('');
    setPinError('');
    setPendingAction(null);
  };

  const isArmed = ['armed_home', 'armed_away', 'armed_night'].includes(currentStatus);
  
  // Loading state for HA integration
  if (alarmPanelId && haLoading) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 h-full flex flex-col">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <Siren className="w-8 h-8 text-gray-400 mx-auto mb-2 animate-pulse" />
            <p className="text-xs text-gray-500">Loading alarm status...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state for HA integration
  if (alarmPanelId && haError) {
    return (
      <div className="bg-red-50 rounded-lg p-4 border border-red-200 h-full flex flex-col">
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <ShieldAlert className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-xs text-red-600">Error loading alarm</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 h-full flex flex-col">
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
    <>
      {/* Alarm Sounding Modal */}
      <AlarmSoundingModal 
        isVisible={currentStatus === 'triggered' || showTestModal} 
        onDisarm={() => {
          setShowTestModal(false);
          handleAction('disarm');
        }}
      />
      
      {/* PIN Input Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 max-w-sm mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <KeyRound className="w-5 h-5" />
                Enter PIN
              </h3>
              <button
                onClick={closePinModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError('');
                }}
                onKeyPress={(e) => e.key === 'Enter' && handlePinSubmit()}
                placeholder="Enter PIN code"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              {pinError && (
                <p className="text-sm text-red-600 mt-1">{pinError}</p>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={closePinModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePinSubmit}
                disabled={!pinInput}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div 
      className={`rounded-lg p-4 border h-full flex flex-col cursor-pointer transition-all duration-200 active:scale-95 ${getCardStyles()}`}
      onClick={handleCardClick}
    >
      <style jsx>{`
        @keyframes lockOpen {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-10deg) scale(1.1); }
          50% { transform: rotate(10deg) scale(1.2); }
          75% { transform: rotate(-5deg) scale(1.1); }
          100% { transform: rotate(0deg) scale(1); }
        }
        
        @keyframes lockClose {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(10deg) scale(1.1); }
          50% { transform: rotate(-10deg) scale(1.2); }
          75% { transform: rotate(5deg) scale(1.1); }
          100% { transform: rotate(0deg) scale(1); }
        }
        
        .lock-animating-open {
          animation: lockOpen 600ms ease-in-out;
        }
        
        .lock-animating-close {
          animation: lockClose 600ms ease-in-out;
        }
      `}</style>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Siren className="w-8 h-8" />
          {/* MQTT Connection Indicator */}
          {mqttConnected && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Ring MQTT Connected" />
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Temporary Test Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTestModal(true);
            }}
            className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Test Modal
          </button>
        </div>
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
          <>
            {isArmed ? (
              <Unlock 
                className={`w-5 h-5 ${
                  iconAnimating && localStatus === 'disarmed' 
                    ? 'lock-animating-open' 
                    : ''
                }`} 
              />
            ) : (
              <Lock 
                className={`w-5 h-5 ${
                  iconAnimating && (localStatus === 'armed_home' || localStatus === 'armed_away') 
                    ? 'lock-animating-close' 
                    : ''
                }`} 
              />
            )}
            {isArmed ? 'Disarm' : 'Arm'}
          </>
        </button>
      </div>
      </div>
    </>
  );
}