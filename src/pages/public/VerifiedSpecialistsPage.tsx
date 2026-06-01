import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Award, UserCheck, ShieldCheck, CheckCircle2, Star, Sparkles } from 'lucide-react';
import { getLocalProfessionals } from '@/utils/localDb';
import { Professional } from '@/types';

const VerifiedSpecialistsPage = () => {
  const [localProfs, setLocalProfs] = React.useState<Professional[]>([]);

  React.useEffect(() => {
    setLocalProfs(getLocalProfessionals() || []);
  }, []);

  return (
    <div className="min-h-screen py-16 bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-4xl space-y-16">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto animate-in fade-in zoom-in-95 duration-500">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-black uppercase tracking-widest mb-2 animate-pulse-glow">
            <Award className="w-4 h-4 text-primary" /> Credibilidade de Alto Nível
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">Especialistas Verificados</h1>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-medium">
            Rigorosa curadoria e testes de aptidão técnica para assegurar que apenas os melhores técnicos do país cuidem da sua tecnologia.
          </p>
        </div>

        {/* Verification Criteria */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-center">Nosso Selo de Homologação em 4 Etapas</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Análise Cadastral", desc: "Verificação detalhada de identidade, antecedentes civis e conformidade cadastral total." },
              { step: "02", title: "Prova Técnica", desc: "Avaliamos qualificações acadêmicas, certificações (CompTIA, Cisco) e experiência de mercado." },
              { step: "03", title: "Entrevista Interna", desc: "Alinhamento de diretrizes de atendimento premium e padrões éticos exigidos pela TechFix." },
              { step: "04", title: "Período Monitorado", desc: "Os primeiros chamados do técnico parceiro são monitorados de perto pela nossa equipe de qualidade." }
            ].map((item, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-foreground/5 relative overflow-hidden space-y-3">
                <span className="text-3xl font-black text-primary/20 absolute right-4 top-4">{item.step}</span>
                <h4 className="font-bold text-sm text-foreground pt-4">{item.title}</h4>
                <p className="text-muted-foreground text-[11px] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Professionals List Showcase */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> Especialistas em Destaque
          </h2>
          <div className="space-y-6">
            {(localProfs || []).map((prof) => (
              <div key={prof.id} className="glass-card p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-6 hover:border-primary/25 transition-all">
                <img 
                  src={prof.avatar} 
                  className="w-16 h-16 rounded-2xl object-cover border border-primary/20 shrink-0" 
                  alt={prof.name} 
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-lg">{prof.name}</h3>
                    <span className="flex items-center gap-1 text-[9px] bg-green-500/10 text-green-500 border border-green-500/20 font-black uppercase px-2 py-0.5 rounded">
                      <UserCheck className="w-3 h-3" /> Verificado
                    </span>
                  </div>
                  <p className="text-xs text-primary font-bold">{prof.specialty} • {prof.city}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{prof.bio}</p>
                </div>
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-4 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-foreground/5 shrink-0">
                  <div className="flex items-center gap-1.5 text-yellow-500 font-bold text-sm">
                    <Star className="w-4 h-4 fill-current" /> {prof.rating} ({prof.reviewCount} reviews)
                  </div>
                  <Link to={`/cliente/busca?prof=${prof.id}`}>
                    <Button className="btn-primary h-9 text-xs rounded-xl">Ver Serviços</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-6 pt-6">
          <h3 className="text-xl font-bold">Você é técnico e quer oferecer suporte de excelência?</h3>
          <Link to="/seja-um-tecnico">
            <Button className="btn-primary h-12 px-8 font-black">Quero me Cadastrar como Técnico</Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default VerifiedSpecialistsPage;
