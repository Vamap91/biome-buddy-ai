
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSecurityLogger } from '@/hooks/useSecurityLogger';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface SecurityEnhancedAuthProps {
  onSuccess?: () => void;
}

const SecurityEnhancedAuth = ({ onSuccess }: SecurityEnhancedAuthProps) => {
  const { signIn, loading } = useAuth();
  const { logFailedLoginAttempt } = useSecurityLogger();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockEndTime, setLockEndTime] = useState<Date | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if account is temporarily locked
    if (isLocked && lockEndTime && new Date() < lockEndTime) {
      const remainingTime = Math.ceil((lockEndTime.getTime() - new Date().getTime()) / 1000 / 60);
      toast.error(`Conta temporariamente bloqueada. Tente novamente em ${remainingTime} minutos.`);
      return;
    }

    // Reset lock if time has passed
    if (isLocked && lockEndTime && new Date() >= lockEndTime) {
      setIsLocked(false);
      setLockEndTime(null);
      setFailedAttempts(0);
    }

    // Validate inputs
    if (!validateEmail(email)) {
      toast.error('Por favor, insira um email válido.');
      return;
    }

    if (!validatePassword(password)) {
      toast.error('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      const { error } = await signIn(email, password);

      if (error) {
        // Log failed login attempt
        await logFailedLoginAttempt(email);
        
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);

        // Lock account after 5 failed attempts for 15 minutes
        if (newFailedAttempts >= 5) {
          setIsLocked(true);
          const lockTime = new Date();
          lockTime.setMinutes(lockTime.getMinutes() + 15);
          setLockEndTime(lockTime);
          toast.error('Muitas tentativas falharam. Conta bloqueada por 15 minutos por segurança.');
        } else {
          toast.error(`Login falhou. ${5 - newFailedAttempts} tentativas restantes.`);
        }
      } else {
        // Reset failed attempts on successful login
        setFailedAttempts(0);
        setIsLocked(false);
        setLockEndTime(null);
        toast.success('Login realizado com sucesso!');
        onSuccess?.();
      }
    } catch (err) {
      console.error('Unexpected login error:', err);
      toast.error('Erro inesperado. Tente novamente.');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Shield className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Login Seguro</CardTitle>
      </CardHeader>
      <CardContent>
        {(failedAttempts >= 3 || isLocked) && (
          <Alert className="mb-4 border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              {isLocked 
                ? 'Conta temporariamente bloqueada por segurança.'
                : `${failedAttempts} tentativas falharam. Cuidado com ataques de força bruta.`
              }
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              disabled={loading || isLocked}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                required
                disabled={loading || isLocked}
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading || isLocked}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={loading || isLocked}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>🔒 Sua conta está protegida por:</p>
          <ul className="mt-1 space-y-1">
            <li>• Política de senhas seguras</li>
            <li>• Detecção de tentativas suspeitas</li>
            <li>• Bloqueio automático após falhas</li>
            <li>• Criptografia de dados</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityEnhancedAuth;
