
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import AuthForm from './auth/AuthForm';

interface SecurityEnhancedAuthProps {
  onSuccess?: () => void;
}

const SecurityEnhancedAuth = ({ onSuccess }: SecurityEnhancedAuthProps) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Shield className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Login Seguro</CardTitle>
        <p className="text-sm text-gray-600">
          Entre na sua conta da plataforma Dr_C
        </p>
      </CardHeader>
      <CardContent>
        <AuthForm onSuccess={onSuccess} />
      </CardContent>
    </Card>
  );
};

export default SecurityEnhancedAuth;
