
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Globe, LogOut, Save, Crown, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import UpgradeModal from '@/components/UpgradeModal';

const Settings = () => {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');

  // Load user profile data when component mounts
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user?.id) return;

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading profile:', error);
          return;
        }

        if (profile) {
          setFullName(profile.full_name || '');
          setUsername(profile.username || '');
        }
      } catch (error) {
        console.error('Unexpected error loading profile:', error);
      }
    };

    loadUserProfile();
  }, [user?.id]);

  const handleSaveSettings = async () => {
    if (!user?.id) {
      toast.error(t('errorUpdatingProfile'));
      return;
    }

    setLoading(true);
    
    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: fullName,
            username: username,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (error) throw error;
      } else {
        // Insert new profile
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: fullName,
            username: username
          });

        if (error) throw error;
      }

      toast.success(t('profileUpdatedSuccess'));
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(t('errorUpdatingProfile'));
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success(t('logoutAccount'));
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const handleLanguageChange = (newLanguage: 'pt' | 'en') => {
    setLanguage(newLanguage);
    toast.success(language === 'pt' ? 'Idioma alterado com sucesso!' : 'Language changed successfully!');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t('settings')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('managePreferences')}
          </p>
        </div>

        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{t('personalInfo')}</span>
              </CardTitle>
              <CardDescription>
                {t('updatePersonalInfo')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  {language === 'pt' ? 'O email não pode ser alterado por motivos de segurança' : 'Email cannot be changed for security reasons'}
                </p>
              </div>
              
              <div>
                <Label htmlFor="name">{t('fullName')}</Label>
                <Input
                  id="name"
                  placeholder={t('enterFullName')}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="username">{language === 'pt' ? 'Nome de Usuário' : 'Username'}</Label>
                <Input
                  id="username"
                  placeholder={language === 'pt' ? '@seuusername' : '@yourusername'}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>{t('language')}</span>
              </CardTitle>
              <CardDescription>
                {t('chooseLanguage')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="language-select">{t('language')}</Label>
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('selectLanguage')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt">{t('portuguese')}</SelectItem>
                    <SelectItem value="en">{t('english')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Current Plan */}
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-700">
                <Crown className="h-5 w-5" />
                <span>{t('currentPlan')}</span>
              </CardTitle>
              <CardDescription>
                {t('subscriptionInfo')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200">
                <div>
                  <h3 className="font-semibold text-green-800">{t('freePlan')}</h3>
                  <p className="text-sm text-green-600">{t('limitedAccess')}</p>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p>• {t('conversationsPerMonth')}</p>
                    <p>• {t('basicSupport')}</p>
                    <p>• {t('essentialFeatures')}</p>
                  </div>
                </div>
                <UpgradeModal
                  trigger={
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Zap className="h-4 w-4 mr-2" />
                      {t('upgrade')}
                    </Button>
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Card>
            <CardContent className="pt-6">
              <Button 
                onClick={handleSaveSettings} 
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? t('processing') : t('saveChanges')}
              </Button>
            </CardContent>
          </Card>

          {/* Logout Section */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-700">{t('logoutAccount')}</CardTitle>
              <CardDescription>
                {language === 'pt' ? 'Desconecte-se da sua conta Dr_C' : 'Disconnect from your Dr_C account'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive" 
                onClick={handleSignOut}
                className="w-full"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t('logoutAccount')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
