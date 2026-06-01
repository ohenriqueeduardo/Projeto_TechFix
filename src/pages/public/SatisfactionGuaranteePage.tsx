import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldCheck, HeartHandshake, HelpCircle, CheckCircle2, BadgeCheck } from 'lucide-react';

const SatisfactionGuaranteePage = () => {
  return (
    <div className="min-h-screen py-16 bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-4xl space-y-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-black uppercase tracking-widest mb-2 animate-pulse-glow">
            <HeartHandshake className="w-4 h-4 text-primary" /> Compromisso Total
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">Garantia de Satisfação</h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
            Seu setup e sua segurança em primeiro lugar. Oferecemos suporte humanizado e cobertura de garantia estendida em todos os serviços.
          </p>
        </div>

        {/* Core Guarantees Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-8 rounded-3xl border border-foreground/5 space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Garantia Estendida de 90 Dias</h3>
            <p className="text-muted-foreground text-xs leading-relaxed font-medium">
              Todo e qualquer reparo ou configuração contratado e pago pela TechFix conta com garantia legal estendida de 90 dias contra reincidência de defeitos nas mesmas peças ou escopo de suporte.
            </p>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-foreground/5 space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <BadgeCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">Resolução de Impasses</h3>
            <p className="text-muted-foreground text-xs leading-relaxed font-medium">
              Caso você não fique inteiramente satisfeito com o resultado técnico, nossa ouvidoria atua diretamente para mediar o reatendimento imediato sem custos extras ou prosseguir com o reembolso proporcional.
            </p>
          </div>
        </div>

        {/* Policy list */}
        <div className="glass-card p-10 rounded-3xl border border-foreground/5 space-y-6">
          <h2 className="text-2xl font-bold text-center">Nossa Política de Qualidade</h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground block mb-0.5">Suporte Dedicado 7 Dias por Semana:</strong>
                <p className="text-xs">Central de ajuda ativa para sanar dúvidas, mediar conversas no chat e prestar esclarecimentos sobre transações financeiras.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground block mb-0.5">Reposição de Peças com Nota Fiscal:</strong>
                <p className="text-xs">Técnicos parceiros são instruídos a utilizar e documentar apenas componentes novos e com procedência comercial assegurada.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-6">
          <h3 className="text-xl font-bold">Precisa de esclarecimentos ou mediação imediata?</h3>
          <div className="flex justify-center gap-4">
            <Link to="/cliente/ajuda">
              <Button className="btn-primary h-12 px-8 font-black">Central de Ajuda</Button>
            </Link>
            <Link to="/">
              <Button variant="outline" className="h-12 px-8 rounded-xl border-foreground/10">Voltar para a Home</Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SatisfactionGuaranteePage;
