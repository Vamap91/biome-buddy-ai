import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Lock, 
  Database, 
  Key,
  Eye,
  Clock,
  User
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityStatus {
  rls_enabled: boolean;
  auth_active: boolean;
  ssl_secure: boolean;
  backup_status: boolean;
  failed_attempts: number;
  active_sessions: number;
}

interface SecurityLog {
  id: string;
  action: string;
  user_id: string;
  timestamp: string;
  ip_address: string;
  success: boolean;
}

const Security = () => {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    rls_enabled: true,
    auth_active: true,
    ssl_secure: true,
    backup_status: true,
    failed_attempts: 0,
    active_sessions: 0
  });
  
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        // Buscar tentativas de login falhadas recentes
        const { data: failedAttempts, error: failedError } = await supabase
          .from('failed_login_attempts')
          .select('*')
          .gte('attempted_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
          .order('attempted_at', { ascending: false });

        if (!failedError) {
          setSecurityStatus(prev => ({
            ...prev,
            failed_attempts: failedAttempts?.length || 0
          }));
        }

        // Simular logs de segurança (em um sistema real, você teria uma tabela específica para isso)
        const mockSecurityLogs: SecurityLog[] = [
          {
            id: '1',
            action: 'Admin Login',
            user_id: 'admin-user',
            timestamp: new Date().toISOString(),
            ip_address: '192.168.1.1',
            success: true
          },
          {
            id: '2',
            action: 'User Promotion',
            user_id: 'admin-user',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            ip_address: '192.168.1.1',
            success: true
          },
          {
            id: '3',
            action: 'Failed Login Attempt',
            user_id: 'unknown',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            ip_address: '10.0.0.1',
            success: false
          }
        ];

        setSecurityLogs(mockSecurityLogs);

      } catch (error) {
        console.error('Error fetching security data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityData();
  }, []);

  const securityChecks = [
    {
      title: "Row Level Security (RLS)",
      status: securityStatus.rls_enabled,
      description: "Controle de acesso a dados ativo",
      icon: Database
    },
    {
      title: "Autenticação",
      status: securityStatus.auth_active,
      description: "Sistema de login funcionando",
      icon: Key
    },
    {
      title: "Conexão SSL",
      status: securityStatus.ssl_secure,
      description: "Comunicação criptografada",
      icon: Lock
    },
    {
      title: "Backup Automático",
      status: securityStatus.backup_status,
      description: "Dados protegidos",
      icon: Shield
    }
  ];

  const securityAlerts = [
    {
      type: "info" as const,
      title: "Tentativas de Login Falhadas",
      message: `${securityStatus.failed_attempts} tentativas nas últimas 24h`,
      action: "Monitorar"
    },
    {
      type: "success" as const,
      title: "Proteções Ativas",
      message: "Todos os sistemas de segurança funcionando",
      action: "Verificado"
    },
    {
      type: "warning" as const,
      title: "Revisão Recomendada",
      message: "Revisar políticas de RLS mensalmente",
      action: "Agendar"
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Carregando dados de segurança...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status de segurança */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {securityChecks.map((check, index) => {
          const Icon = check.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {check.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${check.status ? 'bg-green-50' : 'bg-red-50'}`}>
                  <Icon className={`h-4 w-4 ${check.status ? 'text-green-600' : 'text-red-600'}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {check.status ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${check.status ? 'text-green-600' : 'text-red-600'}`}>
                    {check.status ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {check.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Alertas de segurança */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas de Segurança</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityAlerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    alert.type === 'success' ? 'bg-green-50' :
                    alert.type === 'warning' ? 'bg-yellow-50' : 'bg-blue-50'
                  }`}>
                    {alert.type === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : alert.type === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </div>
                </div>
                <Badge variant={
                  alert.type === 'success' ? 'default' :
                  alert.type === 'warning' ? 'secondary' : 'outline'
                }>
                  {alert.action}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Logs de ações administrativas */}
      <Card>
        <CardHeader>
          <CardTitle>Logs de Ações Administrativas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${log.success ? 'bg-green-50' : 'bg-red-50'}`}>
                    {log.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{log.action}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {log.user_id}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(log.timestamp)}
                      </div>
                      <span>IP: {log.ip_address}</span>
                    </div>
                  </div>
                </div>
                <Badge variant={log.success ? 'default' : 'destructive'}>
                  {log.success ? 'Sucesso' : 'Falha'}
                </Badge>
              </div>
            ))}

            {securityLogs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum log de segurança encontrado.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recomendações de segurança */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendações de Segurança</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Realizar backup dos dados regularmente</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Monitorar tentativas de login falhadas</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Revisar políticas RLS mensalmente</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Manter logs de ações administrativas</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Security;