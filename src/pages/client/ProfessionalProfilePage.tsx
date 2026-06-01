import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  MessageSquare,
  ArrowLeft,
  Award,
  Briefcase,
  ThumbsUp,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { getLocalProfessionals, getLocalServices } from '@/utils/localDb';
import { Service, Professional } from '@/types';
import { formatCurrency } from '@/utils/formatters';

const ProfessionalProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [professional, setProfessional] = React.useState<Professional | null>(null);
  const [services, setServices] = React.useState<Service[]>([]);

  React.useEffect(() => {
    const profs = getLocalProfessionals();
    const foundProf = profs.find(p => p.id === id);
    if (foundProf) {
      setProfessional(foundProf);

      const allServices = getLocalServices();
      const profServices = allServices.filter(s => s.professionalId === id);
      setServices(profServices);
    }
  }, [id]);

  if (!professional) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-muted-foreground text-sm font-bold">Profissional não encontrado</p>
        <Button onClick={() => navigate(-1)} variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
      </div>
    );
  }

  // Realistic mock reviews to look premium
  const reviews = [
    {
      id: 'r1',
      clientName: 'Sofia Spencer',
      rating: 5,
      date: '24/05/2026',
      comment: `Serviço extremamente rápido e limpo! Carlos resolveu o problema de superaquecimento do meu PC Gamer e fez um cable management incrível. Altamente recomendável!`,
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sofia'
    },
    {
      id: 'r2',
      clientName: 'Marcos Oliveira',
      rating: 5,
      date: '12/05/2026',
      comment: `Super atencioso, explicou cada detalhe do diagnóstico do meu notebook. Fez o upgrade de SSD e RAM voando. Nota 10!`,
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Marcos'
    },
    {
      id: 'r3',
      clientName: 'Patrícia Sales',
      rating: 4.8,
      date: '02/05/2026',
      comment: `Excelente profissional. Resolveu a lentidão do computador do escritório muito rápido e com preço justo.`,
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Patricia'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Background radial decorations for premium look */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(6,182,212,0.015),transparent_50%)] pointer-events-none" />

      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors rounded-xl">
          <ArrowLeft className="w-4 h-4" /> Voltar para os Detalhes
        </Button>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-primary animate-pulse" /> Especialista Certificado
        </div>
      </div>

      {/* Main Profile Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left Column: Bio & Core Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8 rounded-3xl border border-white/5 bg-card/15 backdrop-blur-md flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left relative overflow-hidden group">
            {/* Spotlight blur effect */}
            <div className="absolute -left-20 -top-20 w-40 h-40 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all pointer-events-none" />

            <div className="relative shrink-0">
              <img
                src={professional.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(professional.name)}`}
                className="w-28 h-28 md:w-32 md:h-32 rounded-3xl object-cover border-4 border-primary/20 shadow-2xl group-hover:border-primary/45 transition-all duration-300"
                alt={professional.name}
              />
              <span className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-background rounded-full flex items-center justify-center" title="Online Agora">
                <span className="w-3.5 h-3.5 bg-white rounded-full animate-ping absolute opacity-75"></span>
                <span className="w-2 h-2 bg-white rounded-full relative"></span>
              </span>
            </div>

            <div className="space-y-4 flex-1">
              <div className="space-y-1">
                <h1 className="text-3xl font-black tracking-tight">{professional.name}</h1>
                <p className="text-primary font-black text-sm uppercase tracking-wider">{professional.specialty || 'Técnico Especialista'}</p>
                <div className="flex items-center justify-center md:justify-start gap-1.5 text-muted-foreground text-xs font-bold mt-1">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span>{professional.city || 'São Paulo, SP'}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                {professional.bio || 'Profissional altamente qualificado focado em prestar o melhor suporte com transparência, rapidez e peças de altíssima qualidade.'}
              </p>

              {/* Tag Badges */}
              <div className="flex flex-wrap gap-2 justify-center md:justify-start pt-2">
                <Badge className="bg-white/5 text-muted-foreground hover:bg-white/10 border-white/5 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider">Hardware</Badge>
                <Badge className="bg-white/5 text-muted-foreground hover:bg-white/10 border-white/5 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider">Gamer Setup</Badge>
                <Badge className="bg-white/5 text-muted-foreground hover:bg-white/10 border-white/5 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider">Manutenção</Badge>
                <Badge className="bg-white/5 text-muted-foreground hover:bg-white/10 border-white/5 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider">Upgrade</Badge>
              </div>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="p-5 bg-card/20 border-white/5 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 shadow-lg">
              <Star className="w-7 h-7 text-yellow-500 fill-current" />
              <div>
                <p className="text-lg font-black">{professional.rating || '4.9'}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-0.5">{professional.reviewCount || '120'}+ Avaliações</p>
              </div>
            </Card>

            <Card className="p-5 bg-card/20 border-white/5 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 shadow-lg">
              <Briefcase className="w-7 h-7 text-blue-500" />
              <div>
                <p className="text-lg font-black">{professional.jobs || '200'}+</p>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-0.5">Chamados Feitos</p>
              </div>
            </Card>

            <Card className="p-5 bg-card/20 border-white/5 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 shadow-lg">
              <Award className="w-7 h-7 text-primary" />
              <div>
                <p className="text-lg font-black">{professional.yearsExperience || '5'}+ Anos</p>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-0.5">Experiência</p>
              </div>
            </Card>

            <Card className="p-5 bg-card/20 border-white/5 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 shadow-lg">
              <ThumbsUp className="w-7 h-7 text-green-500" />
              <div>
                <p className="text-lg font-black">{professional.satisfaction || '98'}%</p>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-0.5">Satisfação</p>
              </div>
            </Card>
          </div>

          {/* Services Portfolio Offered */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black tracking-tight">Serviços Oferecidos</h2>
              <p className="text-xs text-muted-foreground mt-1">Veja todos os serviços ativos sob responsabilidade técnica do especialista.</p>
            </div>

            {services.length === 0 ? (
              <div className="text-center py-10 glass-card rounded-3xl border border-dashed border-white/10 max-w-md mx-auto p-6 space-y-3">
                <p className="text-sm text-muted-foreground font-bold">Nenhum serviço disponível no momento.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="glass-card rounded-3xl border border-white/5 bg-card/10 backdrop-blur-md flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-1 transition-all duration-300 group relative"
                  >
                    <div className="h-36 overflow-hidden relative">
                      <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {service.category}
                      </span>
                    </div>

                    <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">{service.category}</span>
                          <div className="flex items-center gap-0.5 text-yellow-500 font-bold">
                            <Star className="w-3 h-3 fill-current shrink-0" /> {service.rating}
                          </div>
                        </div>
                        <h3 className="text-sm font-black tracking-tight line-clamp-1 group-hover:text-primary transition-colors">{service.title}</h3>
                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">{service.description}</p>
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                        <div className="flex flex-col text-left">
                          <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest leading-none">A partir de</span>
                          <span className="text-sm font-black text-primary mt-1">{formatCurrency(service.price)}</span>
                        </div>
                        <Link to={`/cliente/servico/${service.id}`}>
                          <Button className="btn-primary h-8 px-4 rounded-lg text-[10px] font-black uppercase flex items-center gap-1">
                            Ver Mais <ChevronRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Customer Reviews Section */}
          <div className="space-y-6 pt-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight">Avaliações do Especialista</h2>
              <p className="text-xs text-muted-foreground mt-1">O que os clientes estão dizendo sobre os serviços concluídos.</p>
            </div>

            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-6 rounded-2xl bg-card/20 border border-white/5 space-y-3 relative group shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={rev.avatar} className="w-10 h-10 rounded-xl border border-white/5" alt={rev.clientName} />
                      <div>
                        <h4 className="font-bold text-xs">{rev.clientName}</h4>
                        <div className="flex items-center gap-0.5 text-yellow-500 font-bold text-[10px] mt-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < Math.floor(rev.rating) ? 'fill-current' : 'text-muted'}`}
                            />
                          ))}
                          <span className="text-foreground ml-1 font-bold">{rev.rating}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-semibold">{rev.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium pl-1">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: CTA Panel (Sticky Card) */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <div className="glass-card p-6 rounded-3xl border border-primary/20 bg-card/30 backdrop-blur-xl space-y-6 shadow-2xl relative overflow-hidden group">
            {/* Visual glow element */}
            <div className="absolute -right-16 -top-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/15 transition-all pointer-events-none" />

            <div className="text-center space-y-2 pb-2 border-b border-white/5">
              <Badge className="bg-primary/20 text-primary border-primary/30 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider mb-2">Disponível para Chamados</Badge>
              <h3 className="text-lg font-black">Fale com {professional.name.split(' ')[0]}</h3>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed">Inicie um bate-papo em tempo real ou envie os detalhes do seu equipamento para um orçamento customizado.</p>
            </div>

            <div className="space-y-3">
              <Link to={`/cliente/chat/${professional.id}`}>
                <Button className="w-full btn-primary h-14 text-sm font-black uppercase tracking-wider gap-2 shadow-lg shadow-primary/25 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 shrink-0" /> Abrir Chat de Suporte
                </Button>
              </Link>

              <Link to={`/cliente/novo-servico?prof=${professional.id}`}>
                <Button variant="outline" className="w-full h-12 rounded-xl text-xs font-black uppercase border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all gap-1.5">
                  <TrendingUp className="w-4 h-4 text-primary shrink-0" /> Solicitar Orçamento Customizado
                </Button>
              </Link>
            </div>

            <div className="pt-2 space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Garantia de 30 dias em todos os reparos</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Pagamento Protegido via TechFix</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                <span>Suporte técnico online e presencial homologado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfilePage;
