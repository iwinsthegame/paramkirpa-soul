import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function PWADebug() {
  const [pwaInfo, setPwaInfo] = useState({
    isServiceWorkerSupported: false,
    isManifestSupported: false,
    isInstallPromptAvailable: false,
    isStandalone: false,
    userAgent: '',
    installPromptCalled: false
  });

  useEffect(() => {
    const checkPWASupport = () => {
      const info = {
        isServiceWorkerSupported: 'serviceWorker' in navigator,
        isManifestSupported: 'onbeforeinstallprompt' in window,
        isInstallPromptAvailable: false,
        isStandalone: window.matchMedia('(display-mode: standalone)').matches,
        userAgent: navigator.userAgent,
        installPromptCalled: false
      };

      // Listen for install prompt
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        info.isInstallPromptAvailable = true;
        setPwaInfo({...info});
        console.log('PWA install prompt available!');
      });

      setPwaInfo(info);
    };

    checkPWASupport();
  }, []);

  const triggerInstallPrompt = () => {
    // Manual install prompt
    console.log('Trying to trigger install prompt manually...');
    setPwaInfo(prev => ({...prev, installPromptCalled: true}));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-20 left-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-h-40 overflow-y-auto z-50"
    >
      <div className="space-y-2">
        <h4 className="font-bold text-green-400">PWA Debug Info:</h4>
        <div>SW Support: {pwaInfo.isServiceWorkerSupported ? '✅' : '❌'}</div>
        <div>Manifest Support: {pwaInfo.isManifestSupported ? '✅' : '❌'}</div>
        <div>Install Prompt Available: {pwaInfo.isInstallPromptAvailable ? '✅' : '❌'}</div>
        <div>Running Standalone: {pwaInfo.isStandalone ? '✅' : '❌'}</div>
        <div>Browser: {pwaInfo.userAgent.includes('Chrome') ? 'Chrome ✅' : pwaInfo.userAgent.includes('Safari') ? 'Safari' : 'Other'}</div>
        
        <button 
          onClick={triggerInstallPrompt}
          className="bg-blue-600 px-3 py-1 rounded text-white mt-2 w-full"
        >
          Force Install Check
        </button>
        
        <div className="text-yellow-400 text-xs">
          📱 For install prompt: Use Chrome/Edge on Android or Safari on iOS
          <br />
          🌐 Must be served via HTTPS (deploy first)
          <br />
          ⏰ Some browsers delay the prompt by 30+ seconds
        </div>
      </div>
    </motion.div>
  );
}