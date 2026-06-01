import React from 'react';
import { HelpCircle, Search, Calendar, CheckCircle2, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen py-16 bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-4xl space-y-16">
        
        {/* Hero */}
        <div className="text-center space-y-4 max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-black uppercase tracking-widest mb-2 animate-pulse-glow">
            <HelpCircle className="w-4 h-4 text-primary" /> Simplificando TI
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">Como Funciona</h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
            Entenda como a TechFix conecta de forma ágil, segura e totalmente digital clientes e profissionais técnicos em hardware, redes e software.
          </p>
        </div>

        {/* Client Workflow */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold border-l-4 border-primary pl-4">Para quem busca Serviços (Cliente)</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Search, title: "1. Encontre a solução", desc: "Navegue pelo nosso catálogo especializado ou busque o reparo ou configuração exata para seu setup." },
              { icon: Calendar, title: "2. Agende o horário", desc: "Selecione o melhor dia e hora para o atendimento, seja ele presencial em seu local ou 100% suporte remoto." },
              { icon: DollarSign, title: "3. Pague em custódia", desc: "Realize o pagamento seguro via PIX ou em até 12x no cartão. O saldo fica retido de forma blindada." },
              { icon: CheckCircle2, title: "4. Aprove e conclua", desc: "Com o reparo finalizado e testado, você autoriza o repasse do dinheiro para a carteira do técnico parceiro." }
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="glass-card p-6 rounded-2xl border border-foreground/5 space-y-3 hover:border-primary/20 transition-all">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-foreground">{step.title}</h4>
                  <p className="text-muted-foreground text-[11px] leading-relaxed font-medium">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technician Workflow */}
        <div className="space-y-8 pt-6">
          <h2 className="text-2xl font-bold border-l-4 border-cyan-500 pl-4">Para quem oferece Serviços (Técnico)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "1. Crie seu perfil", desc: "Cadastre-se na nossa plataforma, anexe seus dados e portfólio. Passando na curadoria técnica, seu perfil é listado online." },
              { title: "2. Aceite chamados", desc: "Receba propostas diretas de clientes em sua cidade ou chamados remotos e agende na sua grade de horários." },
              { title: "3. Fature com segurança", desc: "Faça o reparo sabendo que o pagamento do cliente já está retido em nossa plataforma. Finalize o job e saque via PIX." }
            ].map((step, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-foreground/5 space-y-2 hover:border-cyan-500/25 transition-all">
                <h4 className="font-bold text-sm text-foreground">{step.title}</h4>
                <p className="text-muted-foreground text-[11px] leading-relaxed font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-6 pt-6">
          <h3 className="text-xl font-bold">Pronto para dar o primeiro passo?</h3>
          <div className="flex justify-center gap-4">
            <Link to="/cliente/dashboard">
              <Button className="btn-primary h-12 px-8 font-black">Contratar Técnico</Button>
            </Link>
            <Link to="/cadastro">
              <Button variant="outline" className="h-12 px-8 rounded-xl border-foreground/10">Quero Ser um Técnico</Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HowItWorksPage;
