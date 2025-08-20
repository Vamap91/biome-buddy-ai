
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
    <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4 ${className}`}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Dr_C</span>
          </div>
          <p className="text-gray-600 text-sm">Plataforma de Biodiversidade com IA</p>
        </div>

        {/* Card Principal */}
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">{title}</CardTitle>
            {description && (
              <CardDescription className="text-base text-gray-600">{description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="pt-0">
            {children}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>© 2024 Dr_C. Feito com 💚 para a biodiversidade.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
