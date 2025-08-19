
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
    <div className={`min-h-screen flex items-center justify-center bg-hero-gradient p-4 ${className}`}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Dr_C v2.0</span>
          </div>
          <p className="text-white/80 text-sm">Plataforma de Biodiversidade com IA</p>
        </div>

        {/* Card Principal */}
        <Card className="glass shadow-strong border-white/20">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            {description && (
              <CardDescription className="text-base">{description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="pt-0">
            {children}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-white/60 text-sm">
          <p>© 2024 Dr_C v2.0. Feito com 💚 para a biodiversidade.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
