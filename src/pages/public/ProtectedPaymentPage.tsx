import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldCheck, CreditCard, Landmark, CheckCircle, RefreshCcw, Sparkles } from 'lucide-react';

const ProtectedPaymentPage = () => {
  return (
    <div className="min-h-screen py-16 bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-4xl space-y-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-black uppercase tracking-widest mb-2 animate-pulse-glow">
            <ShieldCheck className="w-4 h-4 text-primary" /> Segurança Garantida
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">Pagamento Protegido</h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
            Seu investimento fica guardado em nossa plataforma e só é liberado para o técnico especialista após você aprovar a entrega completa do serviço.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          {[
            { 
              icon: CreditCard, 
              title: "1. Pagamento Seguro", 
              desc: "Você realiza o pagamento via PIX ou Cartão de Crédito de forma totalmente encriptada. A TechFix retém os valores temporariamente." 
            },
            { 
              icon: Landmark, 
              title: "2. Execução do Reparo", 
              desc: "O técnico parceiro se desloca ou conecta remotamente para efetuar o serviço acordado, sabendo que o saldo está integralmente reservado." 
            },
            { 
              icon: CheckCircle, 
              title: "3. Liberação de Saldo", 
              desc: "Você testa e aprova o funcionamento. Com sua confirmação em um único clique, liberamos a transferência do dinheiro para o profissional." 
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="glass-card p-8 rounded-3xl border border-foreground/5 space-y-4 hover:border-primary/25 transition-all">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed font-medium">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Highlights Section */}
        <div className="glass-card p-10 rounded-3xl border border-foreground/5 relative overflow-hidden space-y-6">
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
          
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> Proteção ao Consumidor de Ponta a Ponta
          </h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Na TechFix, entendemos que reparos de hardware de computadores e notebooks são investimentos significativos. Por isso, construímos uma infraestrutura financeira de custódia segura (escrow).
            </p>
            <p className="flex items-start gap-2 text-xs">
              <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              <span><strong>Reembolso Facilitado:</strong> Caso ocorra algum imprevisto incontornável ou o serviço não possa ser realizado por limitação técnica, o valor retorna 100% à sua conta com agilidade.</span>
            </p>
            <p className="flex items-start gap-2 text-xs">
              <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              <span><strong>Proteção Integral a Dados:</strong> Não armazenamos senhas de cartão ou dados sensíveis em nossos servidores. Tudo é processado por gateways que operam de acordo com as normas PCI-DSS e LGPD.</span>
            </p>
          </div>
        </div>

        {/* Action CTA */}
        <div className="text-center space-y-6">
          <h3 className="text-xl font-bold">Precisa de um suporte profissional agora?</h3>
          <div className="flex justify-center gap-4">
            <Link to="/cliente/dashboard">
              <Button className="btn-primary h-12 px-8 font-black">Contratar Técnico</Button>
            </Link>
            <Link to="/como-funciona">
              <Button variant="outline" className="h-12 px-8 rounded-xl border-foreground/10">Como Funciona</Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProtectedPaymentPage;
