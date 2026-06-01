import React from 'react';
import { Briefcase, ShieldCheck, DollarSign, Award, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BeATechnicianPage = () => {
  return (
    <div className="min-h-screen py-16 bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-4xl space-y-16">
        
        {/* Hero */}
        <div className="text-center space-y-4 max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-black uppercase tracking-widest mb-2 animate-pulse-glow">
            <Briefcase className="w-4 h-4 text-primary" /> Renda com Tecnologia
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">Seja um Técnico Parceiro</h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
            Rentabilize seu conhecimento técnico de computadores, redes e softwares. Tenha flexibilidade de horários, fluxo contínuo de clientes e total garantia de recebimentos.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-6 rounded-2xl border border-foreground/5 space-y-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <DollarSign className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm">Garantia Financeira</h4>
            <p className="text-muted-foreground text-[11px] leading-relaxed font-medium">
              Esqueça calotes. O cliente efetua o pagamento em custódia na plataforma antes de você começar o serviço. Terminou, recebeu.
            </p>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-foreground/5 space-y-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm">Flexibilidade Total</h4>
            <p className="text-muted-foreground text-[11px] leading-relaxed font-medium">
              Defina sua própria agenda, dias de atendimento e horários. Aceite apenas as ordens de serviço que se encaixem no seu dia a dia.
            </p>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-foreground/5 space-y-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm">Escalabilidade de Renda</h4>
            <p className="text-muted-foreground text-[11px] leading-relaxed font-medium">
              Aumente seu faturamento e reputação digital com avaliações premium de clientes satisfeitos e seja recomendado automaticamente na Home.
            </p>
          </div>
        </div>

        {/* Requirements */}
        <div className="glass-card p-10 rounded-3xl border border-foreground/5 space-y-6">
          <h2 className="text-2xl font-bold text-center">O que é preciso para ser parceiro?</h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground block mb-0.5">Conhecimento Técnico Comprovado:</strong>
                <p className="text-xs">Ter formação acadêmica, certificações reconhecidas no mercado (CISCO, Microsoft, ITIL, LPI) ou portfólio robusto demonstrando experiência anterior.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground block mb-0.5">Equipamento de Diagnóstico Próprio:</strong>
                <p className="text-xs">Possuir kits de ferramentas físicos e softwares adequados para efetuar testes de stress, limpeza de hardware e diagnósticos complexos.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Register CTA */}
        <div className="text-center space-y-6">
          <h3 className="text-xl font-bold">Inicie sua trajetória com a TechFix agora mesmo</h3>
          <Link to="/cadastro">
            <Button className="btn-primary h-12 px-8 font-black">Cadastrar-se como Técnico</Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default BeATechnicianPage;
