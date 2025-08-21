
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, AlertTriangle, UserPlus, LogIn } from 'lucide-react';
import { toast } from 'sonner';

interface AuthFormProps {
  onSuccess?: () => void;
}

const AuthForm = ({ onSuccess }: AuthFormProps) => {
  const { signIn, signUp, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockEndTime, setLockEndTime] = useState<Date | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);

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

    // Additional validation for sign up
    if (isSignUp && password !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    try {
      if (isSignUp) {
        console.log('Tentando cadastrar usuário:', email);
        const { error } = await signUp(email, password);
        
        if (error) {
          console.error('Erro no cadastro:', error);
          if (error.message.includes('already registered')) {
            toast.error('Este email já está cadastrado. Tente fazer login.');
          } else {
            toast.error(`Erro no cadastro: ${error.message}`);
          }
        } else {
          console.log('Cadastro realizado com sucesso');
          toast.success('Conta criada com sucesso! Verifique seu email para confirmar.');
          setIsSignUp(false);
          setPassword('');
          setConfirmPassword('');
        }
      } else {
        console.log('Tentando fazer login:', email);
        const { error } = await signIn(email, password);

        if (error) {
          console.error('Erro no login:', error);
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
          console.log('Login realizado com sucesso');
          // Reset failed attempts on successful login
          setFailedAttempts(0);
          setIsLocked(false);
          setLockEndTime(null);
          toast.success('Login realizado com sucesso!');
          onSuccess?.();
        }
      }
    } catch (err) {
      console.error('Erro inesperado na autenticação:', err);
      toast.error('Erro inesperado. Tente novamente.');
    }
  };

  return (
    <>
      {(failedAttempts >= 3 || isLocked) && !isSignUp && (
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
            disabled={loading || (!isSignUp && isLocked)}
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
              disabled={loading || (!isSignUp && isLocked)}
              className="w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              disabled={loading || (!isSignUp && isLocked)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {isSignUp && (
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Senha
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua senha"
                required
                disabled={loading}
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={loading || (!isSignUp && isLocked)}
        >
          {loading ? (
            'Processando...'
          ) : (
            <>
              {isSignUp ? (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar Conta
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar
                </>
              )}
            </>
          )}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setPassword('');
            setConfirmPassword('');
            setFailedAttempts(0);
            setIsLocked(false);
            setLockEndTime(null);
          }}
          className="text-green-600 hover:text-green-700 text-sm font-medium"
          disabled={loading}
        >
          {isSignUp 
            ? 'Já tem uma conta? Fazer login' 
            : 'Não tem uma conta? Criar conta'
          }
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>🔒 Sua conta está protegida por:</p>
        <ul className="mt-1 space-y-1">
          <li>• Política de senhas seguras</li>
          <li>• Detecção de tentativas suspeitas</li>
          <li>• Bloqueio automático após falhas</li>
          <li>• Criptografia de dados</li>
        </ul>
      </div>
    </>
  );
};

export default AuthForm;
