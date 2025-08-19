import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, 
  MessageCircle, 
  Users, 
  BarChart3, 
  Shield, 
  Zap,
  ChevronRight,
  Play,
  Star,
  CheckCircle,
  ArrowRight,
  Globe,
  BookOpen,
  Brain
} from "lucide-react";

const Index = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "IA Avançada",
      description: "Conversas inteligentes sobre biodiversidade com tecnologia GPT-4 e Claude"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Base de Conhecimento", 
      description: "Milhares de artigos, papers e recursos científicos atualizados"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Comunidade",
      description: "Conecte-se com pesquisadores, educadores e conservacionistas"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Analytics",
      description: "Métricas avançadas para acompanhar o progresso do aprendizado"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Segurança",
      description: "Dados protegidos com criptografia e compliance LGPD"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Recursos Educacionais",
      description: "Materiais didáticos e ferramentas para educadores"
    }
  ];

  const testimonials = [
    {
      name: "Dra. Maria Santos",
      role: "Pesquisadora USP",
      content: "O Dr_C revolucionou minha pesquisa sobre polinizadores. A IA entende contextos complexos e oferece insights valiosos.",
      rating: 5
    },
    {
      name: "Prof. Carlos Silva",
      role: "Educador UFRJ", 
      content: "Minhas aulas ficaram muito mais interativas. Os alunos adoram conversar com o Dr_C sobre biodiversidade.",
      rating: 5
    },
    {
      name: "Ana Costa",
      role: "Gestora ONG Verde",
      content: "O painel administrativo nos ajuda a acompanhar o impacto dos nossos projetos de conservação em tempo real.",
      rating: 5
    }
  ];

  const plans = [
    {
      name: "Free",
      price: "R$ 0",
      period: "/mês",
      description: "Para estudantes e curiosos",
      features: [
        "20 mensagens/dia com Dr_C",
        "Acesso à biblioteca básica",
        "Perfil personalizado",
        "Suporte por email"
      ],
      cta: "Começar Grátis",
      popular: false
    },
    {
      name: "Pro",
      price: "R$ 29",
      period: "/mês", 
      description: "Para profissionais e pesquisadores",
      features: [
        "Chat ilimitado com IA avançada",
        "Upload de documentos",
        "API access (100 calls/mês)",
        "Histórico completo",
        "Suporte prioritário"
      ],
      cta: "Começar Teste Grátis",
      popular: true
    },
    {
      name: "Education",
      price: "R$ 99",
      period: "/mês",
      description: "Para educadores e instituições",
      features: [
        "Todos os recursos Pro",
        "Gestão de turmas",
        "Analytics educacionais",
        "Templates de aulas",
        "Suporte telefônico"
      ],
      cta: "Solicitar Demo",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-hero-gradient rounded-lg flex items-center justify-center">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">Dr_C v2.0</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">Recursos</a>
            <a href="#testimonials" className="text-muted-foreground hover:text-primary transition-colors">Depoimentos</a>
            <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Planos</a>
          </nav>

          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/login')}
            >
              Entrar
            </Button>
            <Button 
              size="sm" 
              className="bg-hero-gradient hover:opacity-90"
              onClick={() => navigate('/dashboard')}
            >
              Começar Grátis
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-5"></div>
        <div className="container mx-auto px-4 text-center relative">
          <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20">
            🎉 Nova versão 2.0 disponível
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            Explore a{" "}
            <span className="text-gradient">Biodiversidade</span>
            <br />
            com Inteligência Artificial
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-slide-up">
            O Dr_C v2.0 é sua plataforma completa para pesquisa, educação e conservação da biodiversidade. 
            Converse com IA especializada, analise documentos científicos e conecte-se com uma comunidade global.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slide-up">
            <Button 
              size="lg" 
              className="bg-hero-gradient hover:opacity-90 text-white px-8"
              onClick={() => navigate('/dashboard')}
            >
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="group"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              Ver Demonstração
            </Button>
          </div>

          {/* Demo Preview */}
          <div className="max-w-4xl mx-auto animate-fade-in">
            <Card className="glass shadow-strong hover-lift">
              <CardContent className="p-1">
                <div className="bg-card rounded-lg p-6 min-h-[300px] flex items-center justify-center">
                  {isPlaying ? (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-hero-gradient rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                        <MessageCircle className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Dr_C em Ação</h3>
                      <p className="text-muted-foreground">
                        Demonstração interativa do chat com IA sobre biodiversidade
                      </p>
                      <Button 
                        className="mt-4 bg-hero-gradient hover:opacity-90"
                        onClick={() => navigate('/dashboard')}
                      >
                        Testar Agora
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Play className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Clique para ver o Dr_C</h3>
                      <p className="text-muted-foreground">
                        Descubra como a IA pode transformar seu aprendizado sobre biodiversidade
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Recursos <span className="text-gradient">Avançados</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tudo que você precisa para pesquisar, ensinar e conservar a biodiversidade
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover-lift bg-card-gradient border-0 shadow-soft">
                <CardHeader>
                  <div className="w-12 h-12 bg-hero-gradient rounded-lg flex items-center justify-center text-white mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              O que dizem nossos <span className="text-gradient">usuários</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Pesquisadores, educadores e conservacionistas já usam o Dr_C
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Planos para cada <span className="text-gradient">necessidade</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Escolha o plano ideal para sua jornada na biodiversidade
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`hover-lift ${plan.popular ? 'ring-2 ring-primary shadow-strong' : ''}`}>
                {plan.popular && (
                  <div className="bg-hero-gradient text-white text-center py-2 text-sm font-medium">
                    Mais Popular
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-hero-gradient hover:opacity-90' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => navigate('/dashboard')}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-hero-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para explorar a biodiversidade?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de pesquisadores, educadores e conservacionistas que já usam o Dr_C v2.0
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-primary"
              onClick={() => navigate('/dashboard')}
            >
              Começar Grátis Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="ghost" className="text-white border-white hover:bg-white/10">
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface py-16 border-t border-border/40">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-hero-gradient rounded-lg flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient">Dr_C v2.0</span>
              </div>
              <p className="text-muted-foreground">
                Plataforma inteligente de biodiversidade com IA avançada para pesquisa, educação e conservação.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-primary transition-colors">Recursos</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Planos</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Integrações</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Atualizações</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Guias</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Comunidade</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Sobre nós</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacidade</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/40 pt-8 mt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Dr_C v2.0. Todos os direitos reservados. Feito com 💚 para a biodiversidade.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
