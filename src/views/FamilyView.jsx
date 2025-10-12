import { useState } from 'react';

export default function FamilyView() {
  // Family location tracking has been removed along with Home Assistant integration
  // This view is now a placeholder for future family-related features

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto p-12 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-8xl mb-6">👨‍👩‍👧‍👦</div>
        <h2 className="text-3xl font-semibold text-blue-800 mb-4">Family Features</h2>
        <p className="text-blue-700 mb-6 text-lg">
          Family location tracking has been removed along with the smart home integration.
        </p>
        <div className="text-sm text-blue-600 bg-blue-100 rounded-md p-6 text-left">
          <div className="font-medium mb-3 text-base">This tab can be used for:</div>
          <ul className="space-y-2">
            <li>• Family calendar and schedules</li>
            <li>• Photo sharing and memories</li>
            <li>• Family messages and notes</li>
            <li>• Shared contacts and information</li>
          </ul>
        </div>
      </div>
    </div>
  );
}