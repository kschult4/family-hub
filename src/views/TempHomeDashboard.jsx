import { useState } from 'react';

export default function TempHomeDashboard() {
  const [isConnected] = useState(false);
  
  return (
    <div className="p-2 sm:p-4">
      {!isConnected && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800 text-sm">
            ⚠️ Home Dashboard is not yet configured. Connect to Home Assistant to get started.
          </p>
        </div>
      )}
      
      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center justify-center h-64 text-center">
          <div>
            <p className="text-xl text-gray-600 mb-2">Home Dashboard</p>
            <p className="text-gray-500 mb-4">Control your smart home devices here</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Setup Required</h3>
              <p className="text-blue-700 text-sm mb-3">
                Configure your Home Assistant connection to enable device controls.
              </p>
              <div className="text-left text-sm text-blue-600">
                <p className="mb-1">• Set VITE_HA_BASE_URL in environment</p>
                <p className="mb-1">• Set VITE_HA_TOKEN with long-lived access token</p>
                <p>• Install missing Home Dashboard components</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}