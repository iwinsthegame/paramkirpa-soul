// PWA Registration and Installation
export class PWAManager {
  private deferredPrompt: any = null;
  private isInstalled = false;

  constructor() {
    this.init();
  }

  private async init() {
    // Register service worker
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully:', registration);
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available
                this.showUpdateAvailable();
              }
            });
          }
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }

    // Handle install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallButton();
    });

    // Check if already installed
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.hideInstallButton();
      console.log('PWA was installed');
    });

    // Check if launched as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
      console.log('Running as installed PWA');
    }
  }

  public async installApp() {
    if (!this.deferredPrompt) {
      console.log('Install prompt not available');
      return false;
    }

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        this.isInstalled = true;
      } else {
        console.log('User dismissed the install prompt');
      }
      
      this.deferredPrompt = null;
      return outcome === 'accepted';
    } catch (error) {
      console.error('Error during installation:', error);
      return false;
    }
  }

  private showInstallButton() {
    // Create install button
    const installButton = document.createElement('button');
    installButton.id = 'pwa-install-button';
    installButton.innerHTML = '📱 Install App';
    installButton.className = 'fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 hover:bg-blue-700 transition-colors';
    installButton.onclick = () => this.installApp();
    
    // Only add if not already present
    if (!document.getElementById('pwa-install-button')) {
      document.body.appendChild(installButton);
    }
  }

  private hideInstallButton() {
    const installButton = document.getElementById('pwa-install-button');
    if (installButton) {
      installButton.remove();
    }
  }

  private showUpdateAvailable() {
    // Create update notification
    const updateNotification = document.createElement('div');
    updateNotification.id = 'pwa-update-notification';
    updateNotification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    updateNotification.innerHTML = `
      <div class="flex items-center space-x-3">
        <span>🔄 App update available!</span>
        <button onclick="window.location.reload()" class="bg-white text-green-600 px-3 py-1 rounded text-sm hover:bg-gray-100">
          Update
        </button>
      </div>
    `;
    
    // Only add if not already present
    if (!document.getElementById('pwa-update-notification')) {
      document.body.appendChild(updateNotification);
      
      // Auto remove after 10 seconds
      setTimeout(() => {
        updateNotification.remove();
      }, 10000);
    }
  }

  public get isAppInstalled() {
    return this.isInstalled;
  }

  public get canInstall() {
    return !!this.deferredPrompt;
  }
}

// Initialize PWA manager
export const pwaManager = new PWAManager();