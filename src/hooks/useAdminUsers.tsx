import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AdminUser {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
  role?: string;
  posts_count?: number;
  conversations_count?: number;
}

export interface UserStats {
  total_users: number;
  active_users: number;
  blocked_users: number;
  new_users_today: number;
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total_users: 0,
    active_users: 0,
    blocked_users: 0,
    new_users_today: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Buscar perfis de usuários
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          full_name,
          avatar_url,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Buscar roles dos usuários
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      // Combinar dados
      const enrichedUsers = profiles?.map(profile => {
        const userRole = userRoles?.find(role => role.user_id === profile.id);
        return {
          ...profile,
          role: userRole?.role || 'user',
          posts_count: 0, // Será atualizado abaixo
          conversations_count: 0 // Será atualizado abaixo
        };
      }) || [];

      // Buscar contagem de posts para cada usuário
      for (const user of enrichedUsers) {
        const { count: postsCount } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        const { count: conversationsCount } = await supabase
          .from('conversations')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        
        user.posts_count = postsCount || 0;
        user.conversations_count = conversationsCount || 0;
      }

      setUsers(enrichedUsers);

      // Calcular estatísticas
      const today = new Date().toISOString().split('T')[0];
      const newUsersToday = enrichedUsers.filter(user => 
        user.created_at.startsWith(today)
      ).length;

      setStats({
        total_users: enrichedUsers.length,
        active_users: enrichedUsers.length, // Por enquanto, todos são considerados ativos
        blocked_users: 0, // Implementar quando houver sistema de bloqueio
        new_users_today: newUsersToday
      });

    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os usuários",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const makeAdmin = async (userId: string) => {
    try {
      // Verificar se o usuário já é admin
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();

      if (existingRole) {
        toast({
          title: "Informação",
          description: "Usuário já é administrador"
        });
        return;
      }

      // Adicionar role de admin
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: 'admin'
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Usuário promovido a administrador"
      });

      fetchUsers(); // Recarregar lista
    } catch (error) {
      console.error('Error making user admin:', error);
      toast({
        title: "Erro",
        description: "Não foi possível promover o usuário",
        variant: "destructive"
      });
    }
  };

  const removeAdmin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin');

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Privilégios de administrador removidos"
      });

      fetchUsers(); // Recarregar lista
    } catch (error) {
      console.error('Error removing admin role:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover privilégios",
        variant: "destructive"
      });
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // Verificar se não é o próprio usuário
      const { data: currentUser } = await supabase.auth.getUser();
      if (currentUser.user?.id === userId) {
        toast({
          title: "Erro",
          description: "Você não pode deletar sua própria conta",
          variant: "destructive"
        });
        return;
      }

      // Deletar perfil (cascata vai deletar user_roles)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Usuário deletado com sucesso"
      });

      fetchUsers(); // Recarregar lista
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Erro",
        description: "Não foi possível deletar o usuário",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    users: filteredUsers,
    stats,
    loading,
    searchTerm,
    setSearchTerm,
    makeAdmin,
    removeAdmin,
    deleteUser,
    refetch: fetchUsers
  };
};