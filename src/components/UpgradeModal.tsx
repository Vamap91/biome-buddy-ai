
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { CreditCard, Check, Star, Zap } from 'lucide-react';

interface UpgradeModalProps {
  trigger: React.ReactNode;
}

const UpgradeModal = ({ trigger }: UpgradeModalProps) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const plans = [
    {
      id: 'premium',
      name: 'Premium',
      price: 29.99,
      interval: 'mensal',
      features: [
        'Conversas ilimitadas',
        'Suporte prioritário',
        'Recursos avançados de IA',
        'Análise de biodiversidade detalhada',
        'Exportação de dados'
      ],
      popular: true,
      icon: <Star className="h-5 w-5" />
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99.99,
      interval: 'mensal',
      features: [
        'Tudo do Premium',
        'API personalizada',
        'Suporte 24/7',
        'Integração com sistemas externos',
        'Treinamento personalizado',
        'Relatórios customizados'
      ],
      popular: false,
      icon: <Zap className="h-5 w-5" />
    }
  ];

  const handleUpgrade = async (planId: string, price: number) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          planId,
          price: Math.round(price * 100), // Convert to cents
          interval: 'month'
        }
      });

      if (error) throw error;

      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: 'Erro ao processar upgrade',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard className="h-6 w-6" />
            <span>Escolha seu Plano</span>
          </DialogTitle>
          <DialogDescription>
            Selecione o plano ideal para suas necessidades e faça upgrade agora.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                    Mais Popular
                  </span>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {plan.icon}
                  <span>{plan.name}</span>
                </CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-foreground">
                    R$ {plan.price.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground">/{plan.interval}</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={() => handleUpgrade(plan.id, plan.price)}
                  disabled={isLoading}
                  className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {isLoading ? 'Processando...' : `Escolher ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Informações Importantes:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Cobrança mensal recorrente</li>
            <li>• Cancele a qualquer momento</li>
            <li>• Suporte completo incluído</li>
            <li>• Garantia de 30 dias</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeModal;
