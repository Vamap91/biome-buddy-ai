
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf } from "lucide-react";

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

const AuthCard = ({ title, description, children, className = "" }: AuthCardProps) => {
  return (
    <div className={`min-h-screen flex items-center justify-center relative p-4 ${className}`}>
      {/* Fundo da Amazônia */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(/lovable-uploads/bd1f1350-25f3-4954-acce-c832ab8613db.png)`
        }}
      />
      
      {/* Overlay para melhorar a legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 via-green-800/30 to-green-700/40 backdrop-blur-[1px]" />
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white drop-shadow-lg">Dr_C v2.0</span>
          </div>
          <p className="text-white/90 text-sm drop-shadow-md">Plataforma de Biodiversidade com IA</p>
        </div>

        {/* Card Principal */}
        <Card className="glass shadow-strong border-white/20 backdrop-blur-md bg-white/10">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-white drop-shadow-md">{title}</CardTitle>
            {description && (
              <CardDescription className="text-base text-white/80 drop-shadow-sm">{description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="pt-0">
            {children}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-white/80 text-sm drop-shadow-sm">
          <p>© 2024 Dr_C v2.0. Feito com 💚 para a biodiversidade.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
