
import React from 'react';
import { useCapacitor } from '@/hooks/useCapacitor';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Globe, Tablet } from 'lucide-react';

const PlatformInfo = () => {
  const { isNative, platform, isWeb, isAndroid, isIOS } = useCapacitor();

  // Só mostra no desenvolvimento para debug
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getIcon = () => {
    if (isAndroid || isIOS) return <Smartphone className="h-3 w-3" />;
    if (isWeb) return <Globe className="h-3 w-3" />;
    return <Tablet className="h-3 w-3" />;
  };

  const getVariant = () => {
    if (isNative) return 'default';
    return 'secondary';
  };

  return (
    <div className="fixed top-2 right-2 z-50">
      <Badge variant={getVariant()} className="flex items-center space-x-1">
        {getIcon()}
        <span className="text-xs">
          {isNative ? `App ${platform}` : 'Web'}
        </span>
      </Badge>
    </div>
  );
};

export default PlatformInfo;
