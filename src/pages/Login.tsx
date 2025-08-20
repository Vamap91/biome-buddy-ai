
import SecurityEnhancedAuth from '@/components/SecurityEnhancedAuth';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const Login = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
              Dr_C
            </h1>
          </div>
          <p className="text-gray-600">Plataforma de Biodiversidade com IA</p>
        </div>

        {/* Enhanced Auth Component */}
        <SecurityEnhancedAuth />
        
        {/* Security Notice */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>🔐 Login protegido com criptografia de ponta a ponta</p>
          <p>Seus dados estão seguros conosco</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
