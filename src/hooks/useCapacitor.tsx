
import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export const useCapacitor = () => {
  const [isNative, setIsNative] = useState(false);
  const [platform, setPlatform] = useState<string>('web');

  useEffect(() => {
    const checkPlatform = () => {
      const native = Capacitor.isNativePlatform();
      const currentPlatform = Capacitor.getPlatform();
      
      setIsNative(native);
      setPlatform(currentPlatform);
      
      console.log('Platform detected:', currentPlatform);
      console.log('Is native app:', native);
    };

    checkPlatform();
  }, []);

  return {
    isNative,
    platform,
    isWeb: platform === 'web',
    isAndroid: platform === 'android',
    isIOS: platform === 'ios'
  };
};
