
import { Turnstile } from '@marsidev/react-turnstile';

interface CaptchaWidgetProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  className?: string;
}

const CaptchaWidget = ({ onVerify, onError, onExpire, className }: CaptchaWidgetProps) => {
  return (
    <div className={`flex justify-center ${className}`}>
      <Turnstile
        siteKey="0x4AAAAAAAkX4EzKkWyZ6rJZ" // Chave pública padrão para desenvolvimento
        onSuccess={onVerify}
        onError={onError}
        onExpire={onExpire}
        options={{
          theme: 'light',
          size: 'normal',
        }}
      />
    </div>
  );
};

export default CaptchaWidget;
