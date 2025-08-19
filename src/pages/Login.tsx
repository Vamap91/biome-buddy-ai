import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AuthCard from "@/components/AuthCard";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const [error, setError] = useState("");

  const { signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError("");
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");

    try {
      console.log("Iniciando login com Google...");
      const { error } = await signInWithGoogle();
      
      if (error) {
        console.log("Erro detalhado do Google OAuth:", error);
        
        // Melhor tratamento de erros específicos do Google OAuth
        if (error.message?.includes("403") || error.message?.includes("access")) {
          setError("Erro de configuração do Google OAuth. Verifique se o domínio está autorizado no Google Cloud Console e se as URLs de redirecionamento estão configuradas corretamente no Supabase.");
        } else if (error.message?.includes("popup")) {
          setError("Popup bloqueado pelo navegador. Permita popups para este site e tente novamente.");
        } else if (error.message?.includes("network")) {
          setError("Erro de conexão. Verifique sua internet e tente novamente.");
        } else {
          setError(`Erro ao fazer login com Google: ${error.message || "Erro desconhecido"}`);
        }
      } else {
        console.log("Login com Google bem-sucedido!");
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao Dr_C v2.0",
        });
        // Não redirecionamos aqui pois o useAuth já vai gerenciar o estado
      }
    } catch (err) {
      console.error("Erro inesperado no login do Google:", err);
      setError("Erro inesperado. Tente novamente em alguns momentos.");
    }
    
    setGoogleLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await signIn(formData.email, formData.password);
    
    if (error) {
      console.log("Erro de login:", error);
      
      // Verificar se o erro é de email não confirmado
      if (error.message?.includes("Email not confirmed") || error.code === "email_not_confirmed") {
        setError("Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada e spam.");
      } else if (error.message?.includes("Invalid login credentials")) {
        setError("Email ou senha incorretos");
      } else {
        setError("Erro ao fazer login. Tente novamente.");
      }
    } else {
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao Dr_C v2.0",
      });
      navigate("/chat");
    }
    
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.fullName) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await signUp(formData.email, formData.password, formData.fullName);
    
    if (error) {
      console.log("Erro de cadastro:", error);
      
      if (error.message?.includes("User already registered")) {
        setError("Este email já está cadastrado. Tente fazer login ou use outro email.");
      } else {
        setError(error.message || "Erro ao criar conta");
      }
    } else {
      toast({
        title: "Conta criada com sucesso!",
        description: "Verifique seu email para confirmar a conta antes de fazer login",
      });
      // Limpar o formulário após sucesso
      setFormData({ email: "", password: "", fullName: "" });
    }
    
    setLoading(false);
  };

  return (
    <AuthCard 
      title="Acesse sua conta"
      description="Entre com suas credenciais ou crie uma nova conta"
    >
      {/* Botão do Google no topo */}
      <Button 
        variant="outline" 
        className="w-full mb-4" 
        onClick={handleGoogleSignIn}
        disabled={googleLoading || loading}
      >
        {googleLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : (
          <>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar com Google
          </>
        )}
      </Button>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
        </div>
      </div>

      <Tabs defaultValue="login" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Entrar</TabsTrigger>
          <TabsTrigger value="register">Cadastrar</TabsTrigger>
        </TabsList>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <TabsContent value="login" className="space-y-4">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="seu@email.com"
                disabled={loading || googleLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="login-password">Senha</Label>
              <div className="relative">
                <Input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Sua senha"
                  disabled={loading || googleLoading}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || googleLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading || googleLoading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="register" className="space-y-4">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="register-name">Nome completo</Label>
              <Input
                id="register-name"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Seu nome completo"
                disabled={loading || googleLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="seu@email.com"
                disabled={loading || googleLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="register-password">Senha</Label>
              <div className="relative">
                <Input
                  id="register-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Mínimo 6 caracteres"
                  disabled={loading || googleLoading}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || googleLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading || googleLoading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                'Criar conta'
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <p className="text-center text-sm text-muted-foreground mt-4">
        Ao continuar, você concorda com nossos{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Termos de Serviço
        </a>{" "}
        e{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Política de Privacidade
        </a>
      </p>
    </AuthCard>
  );
};

export default Login;
