import React from 'react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MessageCircle, Mail, Phone, LifeBuoy } from "lucide-react";

const HelpPage = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-page-entrance">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <LifeBuoy className="text-primary w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold">Como podemos ajudar?</h1>
        <p className="text-muted-foreground text-lg">Busque por temas ou navegue pelas dúvidas frequentes.</p>
        
        <div className="relative max-w-xl mx-auto mt-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input placeholder="Ex: Como funciona o pagamento?" className="h-14 pl-12 rounded-2xl bg-card/50 border-white/10" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: MessageCircle, title: "Chat ao Vivo", desc: "Fale agora com um consultor", color: "text-green-500" },
          { icon: Mail, title: "E-mail", desc: "suporte@techfix.com", color: "text-blue-500" },
          { icon: Phone, title: "Telefone", desc: "0800 123 4567", color: "text-purple-500" },
        ].map((item, i) => (
          <div key={i} className="glass-card p-6 rounded-3xl text-center hover:border-primary/30 transition-all cursor-pointer group">
            <item.icon className={`w-8 h-8 mx-auto mb-4 ${item.color} group-hover:scale-110 transition-transform`} />
            <h3 className="font-bold mb-1">{item.title}</h3>
            <p className="text-sm text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Perguntas Frequentes</h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {[
            { q: "Como é feita a verificação dos técnicos?", a: "Todos os profissionais passam por uma análise rigorosa de documentos, antecedentes criminais e testes técnicos de competência antes de serem aprovados na plataforma." },
            { q: "O pagamento é seguro?", a: "Sim! Utilizamos um sistema de garantia onde o valor fica retido na plataforma e só é liberado para o técnico após você confirmar que o serviço foi concluído com sucesso." },
            { q: "E se o problema persistir após o conserto?", a: "Todos os serviços realizados via TechFix possuem garantia mínima de 30 dias. Caso o problema retorne, você pode abrir uma disputa e solicitar o reatendimento sem custo adicional." },
            { q: "Posso cancelar um agendamento?", a: "Sim, cancelamentos feitos com até 24h de antecedência possuem reembolso integral. Após esse prazo, uma taxa de deslocamento pode ser aplicada." }
          ].map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="glass-card px-6 rounded-2xl border-white/5">
              <AccordionTrigger className="hover:no-underline font-bold text-left">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default HelpPage;