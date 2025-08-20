
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Bell, Globe, LogOut, Save } from 'lucide-react';
import { toast } from 'sonner';

const Settings = () => {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSaveSettings = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success(t('profileUpdatedSuccess'));
    setLoading(false);
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

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{t('personalInfo')}</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>{t('notifications') || 'Notificações'}</span>
            </TabsTrigger>
            <TabsTrigger value="language" className="flex items-center space-x-2">
              <Globe className="h-4 w-4" />
              <span>{t('language')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('personalInfo')}</CardTitle>
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
                  />
                </div>

                <div>
                  <Label htmlFor="username">{language === 'pt' ? 'Nome de Usuário' : 'Username'}</Label>
                  <Input
                    id="username"
                    placeholder={language === 'pt' ? '@seuusername' : '@yourusername'}
                  />
                </div>

                <Button 
                  onClick={handleSaveSettings} 
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? t('processing') : t('saveChanges')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'pt' ? 'Preferências de Notificação' : 'Notification Preferences'}</CardTitle>
                <CardDescription>
                  {language === 'pt' ? 'Configure como você deseja receber notificações' : 'Configure how you want to receive notifications'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="text-sm font-medium">
                      {language === 'pt' ? 'Notificações por Email' : 'Email Notifications'}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {language === 'pt' ? 'Receba atualizações importantes por email' : 'Receive important updates by email'}
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="push-notifications" className="text-sm font-medium">
                      {language === 'pt' ? 'Notificações Push' : 'Push Notifications'}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {language === 'pt' ? 'Receba notificações em tempo real no navegador' : 'Receive real-time notifications in the browser'}
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>

                <Button 
                  onClick={handleSaveSettings} 
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? t('processing') : (language === 'pt' ? 'Salvar Preferências' : 'Save Preferences')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="language" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'pt' ? 'Preferências de Idioma' : 'Language Preferences'}</CardTitle>
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

                <Button 
                  onClick={handleSaveSettings} 
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? t('processing') : (language === 'pt' ? 'Salvar Idioma' : 'Save Language')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Logout Section */}
        <Card className="mt-8 border-red-200">
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
              className="w-full sm:w-auto"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('logoutAccount')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
