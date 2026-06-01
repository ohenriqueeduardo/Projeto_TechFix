import React from 'react';
import { ScrollText, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const TermsOfUsePage = () => {
  return (
    <div className="min-h-screen py-16 bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-4xl space-y-16">
        
        {/* Hero */}
        <div className="text-center space-y-4 max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-black uppercase tracking-widest mb-2 animate-pulse-glow">
            <ScrollText className="w-4 h-4 text-primary" /> Acordo de Licença
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">Termos de Uso</h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
            Regras gerais e responsabilidades comerciais aplicáveis a todos os clientes, técnicos parceiros e administradores que utilizam a plataforma TechFix.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-foreground">1. Cadastro e Elegibilidade</h3>
            <p>
              Ao criar uma conta na TechFix, você declara ter no mínimo 18 anos e estar em pleno gozo de sua capacidade civil legal. O fornecimento de informações cadastrais falsas enseja o bloqueio imediato e sem aviso prévio da conta do usuário.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold text-foreground">2. Custódia Financeira e Taxas</h3>
            <p>
              A TechFix atua exclusivamente como agente de facilitação comercial e custódia segura de pagamentos. Nenhuma cobrança deve ser efetuada "por fora" da plataforma. Serviços combinados externamente não contam com nossa Garantia de Satisfação de 90 dias ou suporte a reembolsos. Uma taxa de serviço administrativa de R$ 15,00 é aplicada sobre cada agendamento efetuado.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold text-foreground">3. Cancelamentos e Prazos</h3>
            <p>
              O cliente pode solicitar o cancelamento integral sem multas em até 24 horas antes do horário de atendimento agendado. Após esse prazo, caso o técnico parceiro já tenha iniciado deslocamento, uma taxa básica de comparecimento proporcional poderá ser retida.
            </p>
          </div>
        </div>

        {/* Highlights */}
        <div className="glass-card p-8 rounded-3xl border border-foreground/5 space-y-4">
          <h4 className="font-bold text-base text-foreground flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-primary" /> Ponto Importante
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Tentativas de violar a privacidade de outros usuários, contornar as taxas administrativas da plataforma, proferir discursos ofensivos no chat ou burlar a curadoria técnica acarretarão banimento irrevogável da plataforma TechFix.
          </p>
        </div>

        {/* Back CTA */}
        <div className="text-center">
          <Link to="/">
            <Button className="btn-primary h-12 px-8 font-black">Eu Compreendo e Aceito</Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default TermsOfUsePage;
