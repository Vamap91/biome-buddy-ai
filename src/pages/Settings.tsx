
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { EnhancedCalendar } from '@/components/ui/enhanced-calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Settings as SettingsIcon, Trash2, Globe, User, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [isClearing, setIsClearing] = useState(false);
  
  const profileSchema = z.object({
    fullName: z.string().min(2, language === 'pt' ? 'Nome deve ter pelo menos 2 caracteres' : 'Name must have at least 2 characters'),
    birthDate: z.date({ required_error: language === 'pt' ? 'Data de nascimento é obrigatória' : 'Birth date is required' }),
  });

  type ProfileFormData = z.infer<typeof profileSchema>;
  
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.user_metadata?.full_name || '',
      birthDate: user?.user_metadata?.birth_date ? new Date(user.user_metadata.birth_date) : undefined,
    },
  });

  const handleProfileUpdate = async (data: ProfileFormData) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: data.fullName,
          birth_date: data.birthDate.toISOString(),
        }
      });

      if (error) throw error;

      toast({
        title: t('profileUpdatedSuccess'),
        description: t('informationSaved'),
      });
    } catch (error) {
      toast({
        title: t('errorUpdatingProfile'),
        description: t('tryAgainLater'),
        variant: 'destructive',
      });
    }
  };

  const handleClearHistory = async () => {
    setIsClearing(true);
    try {
      // Delete all messages first
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .in('conversation_id', 
          await supabase
            .from('conversations')
            .select('id')
            .eq('user_id', user?.id)
            .then(({ data }) => data?.map(conv => conv.id) || [])
        );

      if (messagesError) throw messagesError;

      // Delete all conversations
      const { error: conversationsError } = await supabase
        .from('conversations')
        .delete()
        .eq('user_id', user?.id);

      if (conversationsError) throw conversationsError;

      toast({
        title: t('historyCleared'),
        description: t('allConversationsRemoved'),
      });
    } catch (error) {
      toast({
        title: t('errorClearingHistory'),
        description: t('tryAgainLater'),
        variant: 'destructive',
      });
    } finally {
      setIsClearing(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as 'pt' | 'en');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-hero-gradient rounded-lg flex items-center justify-center">
              <SettingsIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-hero-gradient bg-clip-text text-transparent">
                {t('settings')}
              </h1>
              <p className="text-muted-foreground">{t('managePreferences')}</p>
            </div>
          </div>
          <Button onClick={() => navigate('/dashboard')} variant="outline">
            {t('backToDashboard')}
          </Button>
        </div>

        <div className="space-y-6">
          {/* Informações Pessoais */}
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
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleProfileUpdate)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('fullName')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('enterFullName')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{t('birthDate')}</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy")
                                ) : (
                                  <span>{t('selectDate')}</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <EnhancedCalendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Plano Atual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>{t('currentPlan')}</span>
              </CardTitle>
              <CardDescription>
                {t('subscriptionInfo')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <h3 className="font-semibold">{t('freePlan')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('limitedAccess')}
                    </p>
                  </div>
                  <Button variant="outline">
                    {t('upgrade')}
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>• {t('conversationsPerMonth')}</p>
                  <p>• {t('basicSupport')}</p>
                  <p>• {t('essentialFeatures')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Idioma */}
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
            <CardContent>
              <div className="space-y-4">
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

          {/* Gerenciar Dados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trash2 className="h-5 w-5" />
                <span>{t('manageData')}</span>
              </CardTitle>
              <CardDescription>
                {t('clearHistory')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
                  <h3 className="font-semibold text-destructive mb-2">{t('dangerZone')}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('clearHistoryWarning')}
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" disabled={isClearing}>
                        {isClearing ? t('clearing') : t('clearAllHistory')}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('areYouSure')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('clearHistoryConfirmation')}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearHistory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          {t('yesClearAll')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões de Ação - Movidos para o final */}
          <div className="space-y-4">
            <Button 
              onClick={form.handleSubmit(handleProfileUpdate)} 
              className="w-full"
              size="lg"
            >
              {t('saveChanges')}
            </Button>
            
            <Button onClick={handleLogout} variant="outline" className="w-full">
              {t('logoutAccount')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
