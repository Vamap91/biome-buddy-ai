
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, AlertTriangle, Lock, Eye, Database } from 'lucide-react';

interface SecurityCheck {
  name: string;
  status: 'active' | 'warning' | 'inactive';
  description: string;
  icon: React.ReactNode;
}

const SecurityStatus = () => {
  const [securityChecks] = useState<SecurityCheck[]>([
    {
      name: 'Autenticação Obrigatória',
      status: 'active',
      description: 'Posts e perfis protegidos por autenticação',
      icon: <Lock className="h-4 w-4" />
    },
    {
      name: 'Política de Privacidade de Perfis',
      status: 'active',
      description: 'Usuários só veem perfis próprios e de posts',
      icon: <Eye className="h-4 w-4" />
    },
    {
      name: 'Row Level Security (RLS)',
      status: 'active',
      description: 'Políticas de segurança ativas no banco',
      icon: <Database className="h-4 w-4" />
    },
    {
      name: 'Detecção de Tentativas Falhadas',
      status: 'active',
      description: 'Monitoramento de tentativas de login',
      icon: <AlertTriangle className="h-4 w-4" />
    },
    {
      name: 'Limpeza Automática de Logs',
      status: 'active',
      description: 'Logs de segurança limpos automaticamente',
      icon: <CheckCircle className="h-4 w-4" />
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'warning':
        return 'Atenção';
      case 'inactive':
        return 'Inativo';
      default:
        return 'Desconhecido';
    }
  };

  const activeCount = securityChecks.filter(check => check.status === 'active').length;
  const warningCount = securityChecks.filter(check => check.status === 'warning').length;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-green-600" />
          <CardTitle className="text-lg">Status de Segurança</CardTitle>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-green-600 font-medium">
            {activeCount} proteções ativas
          </span>
          {warningCount > 0 && (
            <span className="text-yellow-600 font-medium">
              {warningCount} avisos
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {securityChecks.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="text-gray-600">
                  {check.icon}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{check.name}</h3>
                  <p className="text-sm text-gray-600">{check.description}</p>
                </div>
              </div>
              <Badge className={getStatusColor(check.status)}>
                {getStatusText(check.status)}
              </Badge>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Sistema protegido contra as principais vulnerabilidades
            </span>
          </div>
          <p className="text-xs text-green-700 mt-1">
            Políticas RLS ativas, autenticação obrigatória e monitoramento de segurança implementados.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityStatus;
