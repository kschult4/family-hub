import { createContext, useContext, useState, useEffect } from 'react';
import { useRingAlarmMqtt } from '../hooks/useRingAlarmMqtt';
import AlarmSoundingModal from '../components/home/AlarmSoundingModal';

const AlarmContext = createContext({});

export const useAlarmContext = () => {
  const context = useContext(AlarmContext);
  if (!context) {
    throw new Error('useAlarmContext must be used within AlarmProvider');
  }
  return context;
};

export function AlarmProvider({ children }) {
  const [isAlarmModalVisible, setIsAlarmModalVisible] = useState(false);
  const { alarmStatus, isConnected } = useRingAlarmMqtt();

  useEffect(() => {
    // Show alarm modal instantly when alarm is triggered
    if (alarmStatus === 'triggered' && isConnected) {
      console.log('🚨 ALARM TRIGGERED - Showing global alarm modal');
      setIsAlarmModalVisible(true);
    } else if (alarmStatus !== 'triggered') {
      // Hide modal when alarm is no longer triggered
      setIsAlarmModalVisible(false);
    }
  }, [alarmStatus, isConnected]);

  const handleDisarm = async () => {
    console.log('🔴 Emergency disarm from global alarm modal');
    try {
      const { ringMqttClient } = await import('../services/ringMqttClient');
      const success = await ringMqttClient.sendAlarmCommand('arm_disarm');
      
      if (success) {
        console.log('✅ Emergency disarm command sent via MQTT');
        // Modal will close automatically when alarmStatus changes
      } else {
        console.warn('⚠️ Emergency disarm command failed');
      }
    } catch (error) {
      console.error('❌ Error sending emergency disarm:', error);
    }
  };

  return (
    <AlarmContext.Provider value={{
      isAlarmModalVisible,
      setIsAlarmModalVisible,
      alarmStatus,
      isConnected
    }}>
      {children}
      
      {/* Global Alarm Modal - appears over everything when triggered */}
      <AlarmSoundingModal 
        isVisible={isAlarmModalVisible} 
        onDisarm={handleDisarm}
      />
    </AlarmContext.Provider>
  );
}