
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.2b60706aa9fa419eaa7e6c163a542f4d',
  appName: 'Dr_C - Biodiversidade IA',
  webDir: 'dist',
  server: {
    url: 'https://2b60706a-a9fa-419e-aa7e-6c163a542f4d.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#16a34a',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      iosSpinnerStyle: 'small',
      spinnerColor: '#ffffff'
    }
  }
};

export default config;
