import { useState, useEffect } from 'react';
import { useIsMobile } from './useMediaQuery';

export function useNetworkLocation() {
  const [networkStatus, setNetworkStatus] = useState({
    isHomeNetwork: false,
    isDetecting: true,
    lastChecked: null
  });
  
  const isMobile = useIsMobile();
  const isLargeScreen = !isMobile; // Using existing mobile detection logic

  const detectHomeNetwork = () => {
    const hostname = window.location.hostname.toLowerCase();
    const protocol = window.location.protocol;
    
    // Check for local network indicators
    const isLocalHost = hostname === 'localhost' || hostname === '127.0.0.1';
    const isPrivateIP = hostname.startsWith('192.168') || 
                       hostname.startsWith('10.0') || 
                       hostname.startsWith('172.16') ||
                       hostname.startsWith('172.17') ||
                       hostname.startsWith('172.18') ||
                       hostname.startsWith('172.19') ||
                       hostname.startsWith('172.20') ||
                       hostname.startsWith('172.21') ||
                       hostname.startsWith('172.22') ||
                       hostname.startsWith('172.23') ||
                       hostname.startsWith('172.24') ||
                       hostname.startsWith('172.25') ||
                       hostname.startsWith('172.26') ||
                       hostname.startsWith('172.27') ||
                       hostname.startsWith('172.28') ||
                       hostname.startsWith('172.29') ||
                       hostname.startsWith('172.30') ||
                       hostname.startsWith('172.31');
    const isLocalDomain = hostname.includes('.local') || hostname.includes('.lan');
    const isFileProtocol = protocol === 'file:';
    const isGitHubPages = hostname.includes('github.io');
    const isTunnelHostname = hostname === 'ha.kyle-schultz.com' || hostname === 'www.ha.kyle-schultz.com';
    
    // Consider it home network if any local indicators OR GitHub Pages OR tunnel hostname are present
    // GitHub Pages and tunnel deployments should have full access (no "away" message)
    const isHome = isLocalHost || isPrivateIP || isLocalDomain || isFileProtocol || isGitHubPages || isTunnelHostname;
    
    console.log('🏠 Network detection:', {
      hostname,
      protocol,
      isLocalHost,
      isPrivateIP,
      isLocalDomain,
      isFileProtocol,
      isGitHubPages,
      isTunnelHostname,
      isHome
    });
    
    return isHome;
  };

  useEffect(() => {
    const checkNetwork = () => {
      setNetworkStatus(prev => ({ ...prev, isDetecting: true }));
      
      const isHome = detectHomeNetwork();
      
      setNetworkStatus({
        isHomeNetwork: isHome,
        isDetecting: false,
        lastChecked: new Date().toISOString()
      });
    };

    // Initial check
    checkNetwork();
    
    // Check again if the URL changes (for development)
    window.addEventListener('hashchange', checkNetwork);
    window.addEventListener('popstate', checkNetwork);
    
    return () => {
      window.removeEventListener('hashchange', checkNetwork);
      window.removeEventListener('popstate', checkNetwork);
    };
  }, []);

  // Device and network-based capabilities
  // Allow dashboard access when on home network OR when it's the tunnel hostname
  const canAccessDashboard = networkStatus.isHomeNetwork;
  
  console.log('🔧 canAccessDashboard debug:', { 
    isHomeNetwork: networkStatus.isHomeNetwork, 
    canAccessDashboard,
    hostname: window.location.hostname 
  });
  const shouldShowAllTabs = isLargeScreen; // Large screens always show all tabs
  const shouldShowMobileOnly = isMobile; // Mobile devices get limited tabs

  return {
    // Network status
    isHomeNetwork: networkStatus.isHomeNetwork,
    isDetecting: networkStatus.isDetecting,
    lastChecked: networkStatus.lastChecked,
    
    // Device capabilities
    isMobileDevice: isMobile,
    isLargeScreen,
    
    // Combined logic for features
    canAccessDashboard,
    shouldShowAllTabs,
    shouldShowMobileOnly,
    
    // For debugging
    networkInfo: {
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      userAgent: navigator.userAgent
    }
  };
}