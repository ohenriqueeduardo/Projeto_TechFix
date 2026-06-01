import React from 'react';
import { ShieldCheck, EyeOff, Lock, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const SecurityPage = () => {
  return (
    <div className="min-h-screen py-16 bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-4xl space-y-16">
        
        {/* Hero */}
        <div className="text-center space-y-4 max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-black uppercase tracking-widest mb-2 animate-pulse-glow">
            <Lock className="w-4 h-4 text-primary" /> Criptografia Forte
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">Segurança da Informação</h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
            Segurança de ponta a ponta. Adotamos padrões globais para blindar sua conta, seus dados cadastrais e suas transações financeiras.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-6 rounded-2xl border border-foreground/5 space-y-3">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <h4 className="font-bold text-sm">Autenticação JWT</h4>
            <p className="text-muted-foreground text-[11px] leading-relaxed font-medium">
              Sessões criptografadas de ponta a ponta. Seu login gera um token JWT intransferível para preservar a integridade do seu painel de controle.
            </p>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-foreground/5 space-y-3">
            <EyeOff className="w-8 h-8 text-primary" />
            <h4 className="font-bold text-sm">Conformidade LGPD</h4>
            <p className="text-muted-foreground text-[11px] leading-relaxed font-medium">
              Transparência legal. Suas informações pessoais e fotos enviadas em chamados são salvas apenas para fins de suporte, com opção de remoção imediata.
            </p>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-foreground/5 space-y-3">
            <Lock className="w-8 h-8 text-primary" />
            <h4 className="font-bold text-sm">Custódia Financeira</h4>
            <p className="text-muted-foreground text-[11px] leading-relaxed font-medium">
              Garantia bancária. Nenhuma transação ou dado bancário sensível é armazenado pela TechFix, delegando a operação a gateways seguros.
            </p>
          </div>
        </div>

        {/* Detailed Guidelines */}
        <div className="glass-card p-10 rounded-3xl border border-foreground/5 space-y-6">
          <h2 className="text-2xl font-bold text-center">Protocolo de Proteção ao Usuário</h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground block mb-0.5">Sem SPAM ou Venda de Dados:</strong>
                <p className="text-xs">Não comercializamos nem expomos e-mails ou contatos telefônicos de clientes e prestadores para campanhas publicitárias externas.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground block mb-0.5">Monitoramento de Chat:</strong>
                <p className="text-xs">As conversas entre clientes e técnicos na nossa central são registradas e auditadas para garantir acordos claros e segurança comercial total.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home CTA */}
        <div className="text-center">
          <Link to="/">
            <Button className="btn-primary h-12 px-8 font-black">Voltar para a Página Inicial</Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default SecurityPage;
