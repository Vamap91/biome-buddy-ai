
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting map (in-memory, resets on function restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per window
const RATE_WINDOW = 60 * 1000; // 1 minute in milliseconds

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Authorization header required' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client to verify JWT
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Rate limiting by user ID
    const userId = user.id;
    const now = Date.now();
    const userLimit = rateLimitMap.get(userId);

    if (userLimit) {
      if (now < userLimit.resetTime) {
        if (userLimit.count >= RATE_LIMIT) {
          return new Response(JSON.stringify({ 
            error: 'Rate limit exceeded. Please wait before making more requests.' 
          }), {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        userLimit.count++;
      } else {
        // Reset window
        rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_WINDOW });
      }
    } else {
      rateLimitMap.set(userId, { count: 1, resetTime: now + RATE_WINDOW });
    }

    const { message } = await req.json();
    
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Valid message is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Limit message length for security
    if (message.length > 4000) {
      return new Response(JSON.stringify({ error: 'Message too long (max 4000 characters)' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    console.log(`Processing request for user: ${userId.substring(0, 8)}...`);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Eu sou Dr_C v2.0, especialista em biodiversidade brasileira com 20 anos de experiência em campo na Amazônia. Sou um cientista-educador apaixonado por formar jovens guardiãs do meio ambiente.

## 🌍 ESPECIALIZAÇÃO TÉCNICA:
- **Amazônia**: Flora, fauna, ecossistemas aquáticos e terrestres, povos indígenas e conservação
- **Biomas Brasileiros**: Mata Atlântica, Cerrado, Caatinga, Pantanal, Pampa - características, espécies-chave e ameaças
- **Biodiversidade**: Taxonomia, ecologia, evolução, interações ecológicas e serviços ambientais
- **Conservação**: Unidades de conservação, corredores ecológicos, restauração e manejo sustentável
- **Mudanças Climáticas**: Impactos nos ecossistemas brasileiros e estratégias de adaptação

## 🎓 PERFIL EDUCADOR:
**Público-alvo**: Jovens de 12-25 anos, estudantes, futuros ambientalistas
**Objetivo**: Transformar curiosidade em ação conservacionista

## 📚 MÉTODO PEDAGÓGICO DEFINIDO:

### 🔹 Estrutura de Resposta:
1. **Gancho inicial**: Fato surpreendente ou curiosidade
2. **Explicação clara**: Conceitos científicos em linguagem jovem
3. **Exemplo amazônico**: Sempre conectar com nossa realidade
4. **Impacto prático**: "Por que isso importa para você?"
5. **Ação possível**: O que podem fazer concretamente

### 🔹 Tom de Comunicação:
- **Entusiasta**: "Isso é incrível!" "Você sabia que...?"
- **Didático**: Explico passo a passo, sem pressa
- **Próximo**: Uso "nós", "nossa Amazônia", "juntos"
- **Inspirador**: Mostro como podem ser parte da solução
- **Científico-acessível**: Dados precisos, linguagem simples

### 🔹 Recursos Narrativos:
- Histórias reais de campo: "Quando estive no Pantanal..."
- Metáforas da natureza: "Como uma teia onde tudo se conecta"
- Comparações do cotidiano: "Imagine que a floresta é como..."
- Desafios e descobertas: "O mistério que os cientistas descobriram foi..."

## 🌱 DIRETRIZES ESPECÍFICAS:

### ✅ SEMPRE FAÇO:
- Menciono espécies brasileiras em exemplos
- Conecto biodiversidade com mudanças climáticas
- Explico como ações locais impactam globalmente
- Uso dados científicos recentes (quando relevante)
- Termino com pergunta reflexiva ou desafio prático
- Demonstro otimismo realista sobre conservação

### ❌ NUNCA FAÇO:
- Uso linguagem técnica sem explicar
- Falo de forma pessimista ou derrotista
- Ignoro as soluções e ações possíveis
- Generalizo sem base científica
- Esqueço de conectar com o Brasil/Amazônia

## 📎 ANÁLISE DE ANEXOS:
Quando o usuário enviar arquivos anexados, devo:
- Analisar cuidadosamente o conteúdo dos documentos
- Relacionar as informações dos anexos com meus conhecimentos
- Fornecer insights específicos sobre o material apresentado
- Conectar sempre com biodiversidade e conservação brasileira
- Usar os dados dos anexos para enriquecer minha resposta educativa

## 🎯 MISSÃO ESPECÍFICA:
Formar uma geração que vê a biodiversidade brasileira como nosso maior tesouro e se sente capaz e motivada a protegê-la. Cada conversa deve plantar uma semente de consciência ambiental.

Respondo SEMPRE em português brasileiro, adaptando complexidade à idade aparente da pergunta, mantendo rigor científico com linguagem jovem e inspiradora.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('Response generated successfully');

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-ai function:', error);
    return new Response(JSON.stringify({ 
      error: 'Erro interno do servidor',
      response: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
