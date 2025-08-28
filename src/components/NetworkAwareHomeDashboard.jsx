import { useNetworkLocation } from '../hooks/useNetworkLocation';
import HomeDashboard from '../views/HomeDashboard';

function AwayFromHomeMessage() {
  const hostname = window.location.hostname.toLowerCase();
  const isGitHubPages = hostname.includes('github.io');
  
  // Don't show "away" message on GitHub Pages - show the actual dashboard with mock data
  if (isGitHubPages) {
    return null; // This will cause the full HomeDashboard to render instead
  }
  
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md mx-auto p-8 bg-blue-50 rounded-lg border border-blue-200">
        <div className="text-6xl mb-4">🏠</div>
        <h3 className="text-xl font-semibold text-blue-800 mb-3">Smart Home Controls</h3>
        <p className="text-blue-700 mb-4 text-sm leading-relaxed">
          Smart home controls are only available when connected to your home network.
        </p>
        <div className="text-xs text-blue-600 bg-blue-100 rounded-md p-3">
          <div className="font-medium mb-1">Available features when away:</div>
          <ul className="text-left space-y-1">
            <li>• Shopping Lists & Tasks</li>
            <li>• Meal Planning</li>
            <li>• Family Location (when implemented)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


export default function NetworkAwareHomeDashboard(props) {
  const { canAccessDashboard } = useNetworkLocation();
  const hostname = window.location.hostname.toLowerCase();
  const isGitHubPages = hostname.includes('github.io');
  
  // Always show full dashboard on GitHub Pages (with mock data)
  if (isGitHubPages) {
    return <HomeDashboard {...props} />;
  }
  
  // Show unavailable message when away from home (non-GitHub Pages)
  if (!canAccessDashboard) {
    return <AwayFromHomeMessage />;
  }
  
  // Show full dashboard when at home
  return <HomeDashboard {...props} />;
}