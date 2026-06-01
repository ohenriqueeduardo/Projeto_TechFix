import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  ShieldCheck,
  Star,
  Users,
  Zap,
  ArrowRight,
  CheckCircle2,
  Wrench,
  Monitor,
  Network,
  Settings,
  ShieldAlert,
  MessageSquare,
  Sparkles,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  Briefcase,
  MapPin
} from 'lucide-react';
import { getLocalServices, getLocalProfessionals } from '@/utils/localDb';
import { Service, Professional } from '@/types';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatters';
import backgroundImg from '@/assets/background_home.png';

const getSkillTags = (id: string, specialty: string) => {
  if (id === 'p1' || specialty.toLowerCase().includes('hardware')) {
    return ["Hardware", "Setup Gamer", "Watercooling", "Windows"];
  }
  if (id === 'p2' || specialty.toLowerCase().includes('rede')) {
    return ["Redes", "Wi-Fi", "Segurança", "Linux"];
  }
  return ["Hardware", "Redes", "Configuração"];
};

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [localServices, setLocalServices] = React.useState<Service[]>([]);
  const [localProfs, setLocalProfs] = React.useState<Professional[]>([]);
  const [activeProfile, setActiveProfile] = React.useState<'technician' | 'client'>('technician');

  const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  }, []);

  // Infinite slider states
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    setLocalServices(getLocalServices() || []);
    setLocalProfs(getLocalProfessionals() || []);
  }, []);

  // Track window size for responsive translation calculations
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cliente/busca?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Infinite slider variables: slice first 6 items
  const originalItems = (localServices || []).slice(0, 6);
  // Clone the first 3 items to append them at the end for the seamless loop
  const sliderItems = [...originalItems, ...originalItems.slice(0, 3)];

  // Infinite loop reset logic
  React.useEffect(() => {
    if (originalItems.length === 0) return;

    if (currentIndex === originalItems.length) {
      // Reached the cloned items. Wait for transition (500ms) then jump back instantly to index 0.
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, originalItems.length]);

  React.useEffect(() => {
    if (!isTransitioning) {
      // Re-enable transition in the next tick
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const handlePrevPage = () => {
    if (!isTransitioning || originalItems.length === 0) return;

    setCurrentIndex((prev) => {
      if (prev === 0) {
        setIsTransitioning(false);
        setCurrentIndex(originalItems.length);
        setTimeout(() => {
          setIsTransitioning(true);
          setCurrentIndex(originalItems.length - 1);
        }, 50);
        return originalItems.length;
      }
      return prev - 1;
    });
  };

  const handleNextPage = React.useCallback(() => {
    if (!isTransitioning || originalItems.length === 0) return;
    setCurrentIndex((prev) => prev + 1);
  }, [isTransitioning, originalItems.length]);

  // Autoplay slider: advance 1-by-1 every 3 seconds, looping infinitely
  React.useEffect(() => {
    if (originalItems.length <= 1) return;

    const timer = setInterval(() => {
      handleNextPage();
    }, 3000);

    return () => clearInterval(timer);
  }, [originalItems.length, handleNextPage]);

  return (
    <div className="flex flex-col bg-background text-foreground transition-colors duration-300">

      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center py-12 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={backgroundImg}
            alt="Fundo Tecnológico"
            className="w-full h-full object-cover opacity-55 dark:opacity-25 scale-125 translate-y-12 object-right animate-in fade-in zoom-in-105 duration-1000 ease-out"
          />
          {/* Morphing premium mesh gradient spots */}
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-mesh-gradient-1 pointer-events-none opacity-50 dark:opacity-40" />
          <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[140px] animate-mesh-gradient-2 pointer-events-none opacity-45 dark:opacity-35" />
          {/* Multi-directional gradient masks to blend the background image seamlessly into the page without covering key elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-l from-background/80 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/15 via-transparent to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-xs font-black mb-6 tracking-widest animate-pulse-glow">
              <Zap className="w-4 h-4 text-primary" />
              A SOLUÇÃO DEFINITIVA PARA SEUS PROBLEMAS DE TI
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 leading-[0.95] drop-shadow-2xl animate-in fade-in slide-in-from-bottom-6 delay-100 duration-700 fill-mode-both">
              Serviços de TI com <br />
              <span className="gradient-text">Excelência Técnica.</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-6 delay-300 duration-700 fill-mode-both">
              Conectamos você aos melhores especialistas para manutenção, montagem e suporte tecnológico de alto nível com total segurança.
            </p>

            {/* Reduced & Premium Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-lg mb-12 animate-in fade-in slide-in-from-bottom-6 delay-500 duration-700 fill-mode-both">
              <div className="relative group flex items-center">
                <div className="absolute left-4 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Search className="w-5 h-5" />
                </div>
                <Input
                  placeholder="O que você precisa resolver hoje?"
                  className="h-14 pl-12 pr-32 bg-card/60 backdrop-blur-2xl border-foreground/10 rounded-2xl text-sm focus:ring-primary/50 transition-all shadow-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" className="absolute right-2 h-10 rounded-xl px-6 btn-primary text-xs font-bold">
                  Buscar
                </Button>
              </div>
            </form>

            <div className="flex flex-wrap gap-8 md:gap-12">
              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="text-primary w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="text-xl font-black block">+230</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Serviços</span>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Star className="text-yellow-500 w-6 h-6 fill-yellow-500" />
                </div>
                <div className="text-left">
                  <span className="text-xl font-black block">4.9</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Avaliação</span>
                </div>
              </div>
              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck className="text-green-500 w-6 h-6" />
                </div>
                <div className="text-left">
                  <span className="text-xl font-black block">100%</span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Seguro</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section - SaaS Premium Vertical Redesign */}
      <section className="py-24 relative overflow-hidden bg-card/5 border-y border-foreground/5">
        {/* Ambient background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.02),transparent_70%)] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Column 1: Marketing / Explanatory Headline (col-span-5) */}
            <div className="lg:col-span-5 space-y-6 text-left animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" /> Segurança Máxima
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 leading-[0.95] drop-shadow-2xl">
                Compromisso <br />
                <span className="gradient-text">com a Confiança.</span>
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm font-medium">
                Criamos uma infraestrutura de segurança robusta para proteger cada transação, assegurando qualidade técnica homologada de ponta a ponta.
              </p>
            </div>

            {/* Column 2: Vertical Cascading Stack (col-span-7) */}
            <div className="lg:col-span-7 relative space-y-8 text-left">
              {/* Vertical neon connection line running behind the icon positions */}
              <div className="absolute left-[52px] md:left-[60px] top-10 bottom-10 w-[2px] bg-gradient-to-b from-primary/10 via-primary/50 to-primary/10 hidden sm:block z-0 pointer-events-none" />

              {/* Pagamento Protegido Card */}
              <Link
                to="/pagamento-protegido"
                onMouseMove={handleMouseMove}
                style={{ animationDelay: '150ms' }}
                className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 bg-card/15 backdrop-blur-md flex flex-row items-start gap-6 hover:border-primary/30 hover:bg-card/25 transition-all duration-500 shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1 group relative overflow-hidden spotlight-card spotlight-border animate-in fade-in slide-in-from-bottom-8 fill-mode-both z-10"
              >
                {/* Radial backdrop glow */}
                <div className="absolute -right-16 -top-16 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-500 pointer-events-none" />

                {/* Sweeping premium sheen effect on hover */}
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/10 dark:via-white/[0.04] to-transparent pointer-events-none" />

                {/* Icon Container with floating micro-animation */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center border border-primary/20 group-hover:border-primary/50 group-hover:bg-primary/20 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500 shadow-[0_0_15px_rgba(6,182,212,0.05)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] shrink-0 relative z-20 bg-background/90">
                  <ShieldCheck className="text-primary w-7 h-7" />
                </div>

                <div className="space-y-2 flex-1 pt-1.5">
                  <h3 className="text-lg font-black tracking-tight group-hover:text-primary transition-colors duration-300 flex items-center gap-1.5">
                    Pagamento Protegido
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-primary shrink-0" />
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed pr-2 font-medium">Seu investimento fica seguro em nossa plataforma até que você aprove a conclusão do serviço.</p>
                </div>
              </Link>

              {/* Especialistas Verificados Card */}
              <Link
                to="/especialistas-verificados"
                onMouseMove={handleMouseMove}
                style={{ animationDelay: '300ms' }}
                className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 bg-card/15 backdrop-blur-md flex flex-row items-start gap-6 hover:border-primary/30 hover:bg-card/25 transition-all duration-500 shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1 group relative overflow-hidden spotlight-card spotlight-border animate-in fade-in slide-in-from-bottom-8 fill-mode-both z-10"
              >
                {/* Radial backdrop glow */}
                <div className="absolute -right-16 -top-16 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-500 pointer-events-none" />

                {/* Sweeping premium sheen effect on hover */}
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/10 dark:via-white/[0.04] to-transparent pointer-events-none" />

                {/* Icon Container with floating micro-animation */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center border border-primary/20 group-hover:border-primary/50 group-hover:bg-primary/20 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500 shadow-[0_0_15px_rgba(6,182,212,0.05)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] shrink-0 relative z-20 bg-background/90">
                  <UserCheck className="text-primary w-7 h-7" />
                </div>

                <div className="space-y-2 flex-1 pt-1.5">
                  <h3 className="text-lg font-black tracking-tight group-hover:text-primary transition-colors duration-300 flex items-center gap-1.5">
                    Especialistas Verificados
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-primary shrink-0" />
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed pr-2 font-medium">Rigoroso processo de seleção e verificação de competências para garantir o melhor atendimento.</p>
                </div>
              </Link>

              {/* Garantia de Satisfação Card */}
              <Link
                to="/garantia-satisfacao"
                onMouseMove={handleMouseMove}
                style={{ animationDelay: '450ms' }}
                className="glass-card p-6 md:p-8 rounded-3xl border border-white/5 bg-card/15 backdrop-blur-md flex flex-row items-start gap-6 hover:border-primary/30 hover:bg-card/25 transition-all duration-500 shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] hover:-translate-y-1 group relative overflow-hidden spotlight-card spotlight-border animate-in fade-in slide-in-from-bottom-8 fill-mode-both z-10"
              >
                {/* Radial backdrop glow */}
                <div className="absolute -right-16 -top-16 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all duration-500 pointer-events-none" />

                {/* Sweeping premium sheen effect on hover */}
                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/10 dark:via-white/[0.04] to-transparent pointer-events-none" />

                {/* Icon Container with floating micro-animation */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center border border-primary/20 group-hover:border-primary/50 group-hover:bg-primary/20 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500 shadow-[0_0_15px_rgba(6,182,212,0.05)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] shrink-0 relative z-20 bg-background/90">
                  <Sparkles className="text-primary w-7 h-7" />
                </div>

                <div className="space-y-2 flex-1 pt-1.5">
                  <h3 className="text-lg font-black tracking-tight group-hover:text-primary transition-colors duration-300 flex items-center gap-1.5">
                    Garantia de Satisfação
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-primary shrink-0" />
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed pr-2 font-medium">Suporte dedicado e garantia em todos os serviços realizados através do ecossistema TechFix.</p>
                </div>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-card/10 border-y border-foreground/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-black mb-2 tracking-tight">Categorias Especializadas</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">Soluções completas para cada necessidade tecnológica, do hardware ao software.</p>
            </div>
            <Link to="/categorias">
              <Button variant="outline" className="text-xs font-black uppercase tracking-widest gap-2 h-10 px-5 border-primary/20 hover:border-primary/50 text-primary bg-card/60 backdrop-blur-md transition-all rounded-xl shadow-md hover:scale-105 duration-300">
                Ver Todas as Categorias <ArrowRight className="w-4 h-4 text-primary animate-pulse" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Manutenção', icon: Wrench, desc: 'Limpeza e reparos', color: 'text-blue-500' },
              { name: 'Montagem', icon: Monitor, desc: 'PCs de alta performance', color: 'text-purple-500' },
              { name: 'Redes', icon: Network, desc: 'Wi-Fi e infraestrutura', color: 'text-cyan-500' },
              { name: 'Software', icon: Settings, desc: 'Otimização e sistemas', color: 'text-emerald-500' },
            ].map((cat) => (
              <Link key={cat.name} to={`/cliente/busca?q=${cat.name}`} onMouseMove={handleMouseMove} className="glass-card p-6 rounded-2xl hover:border-primary/50 transition-all group relative overflow-hidden spotlight-card spotlight-border">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all pointer-events-none" />
                <div className={`w-14 h-14 bg-foreground/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${cat.color}`}>
                  <cat.icon className="w-7 h-7" />
                </div>
                <h3 className="font-black text-xl mb-1.5">{cat.name}</h3>
                <p className="text-muted-foreground text-xs">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services (Exactly 3 displayed with paginator) */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div className="text-left">
              <h2 className="text-3xl font-black mb-2 tracking-tight">Serviços em Destaque</h2>
              <p className="text-muted-foreground text-sm">Os serviços mais solicitados pela nossa comunidade.</p>
            </div>

            <Link to="/cliente/servicos">
              <Button variant="outline" className="text-xs font-black uppercase tracking-widest gap-2 h-10 px-5 border-primary/20 hover:border-primary/50 text-primary bg-card/60 backdrop-blur-md transition-all rounded-xl shadow-md hover:scale-105 duration-300">
                Visualizar Todos <ArrowRight className="w-4 h-4 text-primary animate-pulse" />
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            {/* Slider Viewport */}
            <div className="flex-1 overflow-hidden py-4 -my-4">
              <div
                className={`flex -mx-4 ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
                style={{
                  transform: `translate3d(-${currentIndex * (isMobile ? 100 : 33.333333)}%, 0, 0)`
                }}
              >
                {sliderItems.map((service, idx) => (
                  <div
                    key={`${service.id}-${idx}`}
                    className="w-full md:w-1/3 shrink-0 px-4 h-[420px] relative group"
                  >
                    {/* Card container */}
                    <div className="glass-card rounded-2xl overflow-hidden hover-card-service border border-foreground/5 bg-card/10 relative h-full flex flex-col justify-between">
                      {/* Standard view (Static) */}
                      <div className="flex flex-col h-full justify-between transition-opacity duration-300 group-hover:opacity-0">
                        <div>
                          <div className="h-48 overflow-hidden relative">
                            <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            {service.badge && (
                              <span className="absolute top-4 left-4 bg-primary text-background text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                {service.badge}
                              </span>
                            )}
                          </div>
                          <div className="p-6 space-y-3">
                            <div className="flex justify-between items-start">
                              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{service.category}</span>
                              <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                                <Star className="w-4 h-4 fill-current" /> {service.rating}
                              </div>
                            </div>
                            <h3 className="text-xl font-bold group-hover:text-primary transition-colors leading-snug line-clamp-1">{service.title}</h3>
                            <p className="text-muted-foreground leading-relaxed line-clamp-2 text-xs">{service.description}</p>
                          </div>
                        </div>

                        <div className="p-6 pt-0">
                          <div className="flex items-center justify-between pt-4 border-t border-foreground/5">
                            <div>
                              <span className="text-[10px] text-muted-foreground block font-bold uppercase tracking-widest">Investimento</span>
                              <span className="text-xl font-black text-primary">{formatCurrency(service.price)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Hover expanded panel */}
                      <div className="absolute inset-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl p-6 flex flex-col justify-between opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20 pointer-events-none group-hover:pointer-events-auto border border-primary/20 rounded-2xl">
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{service.category}</span>
                            <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                              <Star className="w-4 h-4 fill-current" /> {service.rating}
                            </div>
                          </div>

                          <h3 className="text-xl font-bold text-foreground leading-snug">{service.title}</h3>

                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
                            <Clock className="w-4 h-4 text-primary shrink-0" />
                            <span>Tempo estimado: {service.duration || '1-2 dias'}</span>
                          </div>

                          <p className="text-muted-foreground leading-relaxed text-xs max-h-[120px] overflow-y-auto pr-1">
                            {service.description}
                          </p>

                          {service.tags && service.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {service.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="text-[9px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="pt-4 border-t border-foreground/5 flex items-center justify-between">
                          <div className="flex flex-col text-left shrink-0">
                            <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none">Investimento</span>
                            <span className="text-xl font-black text-primary mt-1">{formatCurrency(service.price)}</span>
                          </div>
                          <Link to={`/cliente/servico/${service.id}`}>
                            <Button className="btn-primary h-10 px-5 text-xs font-black rounded-xl">
                              Contratar Serviço
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Professionals Section */}
      <section className="py-24 relative overflow-hidden bg-card/10 border-y border-foreground/5">
        {/* Background decorative glow effects - sophisticated dark tech aura */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(6,182,212,0.03),transparent_50%)] pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none opacity-40" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div className="space-y-2 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> Profissionais Disponíveis
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">Especialistas Online</h2>
              <p className="text-muted-foreground text-sm max-w-md leading-relaxed font-medium">
                Conecte-se e contrate técnicos altamente capacitados e ativos agora para suporte imediato e especializado.
              </p>
            </div>

            <Link to="/especialistas-verificados" className="shrink-0 w-full md:w-auto">
              <Button variant="outline" className="w-full md:w-auto text-xs font-black uppercase tracking-widest gap-2 h-11 px-6 border-primary/15 hover:border-primary/45 text-primary bg-card/40 backdrop-blur-md transition-all rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] duration-300">
                Visualizar Todos <ArrowRight className="w-4 h-4 text-primary animate-pulse" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {(localProfs || []).map((prof) => (
              <div
                key={prof.id}
                onMouseMove={handleMouseMove}
                className="glass-card p-8 rounded-3xl border border-white/5 dark:border-white/5 bg-card/15 backdrop-blur-md flex flex-col sm:flex-row items-center sm:items-start gap-8 hover:border-primary/25 dark:hover:border-primary/25 hover:bg-card/25 transition-all duration-500 shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1.5 group relative overflow-hidden h-full justify-between spotlight-card spotlight-border"
              >
                {/* Subtle card glow overlay on hover */}
                <div className="absolute -right-24 -top-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all duration-500 pointer-events-none" />

                {/* Avatar container */}
                <div className="relative shrink-0 flex items-center justify-center p-1 rounded-3xl border-2 border-primary/15 group-hover:border-primary/40 transition-all duration-500 shadow-[0_0_15px_rgba(6,182,212,0.05)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] bg-card/30">
                  <img
                    src={prof.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(prof.name)}`}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover shadow-inner bg-background"
                    alt={prof.name}
                  />
                  <span className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-green-500 border-2 border-background rounded-full animate-pulse shadow-md" title="Online"></span>
                </div>

                {/* Info Container */}
                <div className="flex-1 space-y-5 text-center sm:text-left w-full flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                        <h3 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors duration-300">
                          {prof.name}
                        </h3>
                        <span className="flex items-center gap-1 text-[8px] bg-green-500/10 text-green-500 border border-green-500/20 font-black uppercase px-2 py-0.5 rounded-md">
                          <UserCheck className="w-2.5 h-2.5" /> Verificado
                        </span>
                      </div>
                      <span className="inline-block text-xs font-black text-primary/95 uppercase tracking-wider">
                        {prof.specialty}
                      </span>
                    </div>

                    {/* Metric mini blocks */}
                    <div className="grid grid-cols-3 gap-2 border-y border-foreground/5 py-3.5 text-xs w-full">
                      {/* Rating */}
                      <div className="flex flex-col items-center sm:items-start gap-1">
                        <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest leading-none">Avaliação</span>
                        <div className="flex items-center gap-1 text-yellow-500 font-black mt-1">
                          <Star className="w-3.5 h-3.5 fill-current shrink-0" /> {prof.rating}
                        </div>
                      </div>
                      {/* Jobs count */}
                      <div className="flex flex-col items-center sm:items-start gap-1 border-x border-foreground/5 px-2">
                        <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest leading-none">Serviços</span>
                        <div className="flex items-center gap-1 text-primary font-black mt-1">
                          <Briefcase className="w-3.5 h-3.5 shrink-0" /> {prof.jobs}
                        </div>
                      </div>
                      {/* Location */}
                      <div className="flex flex-col items-center sm:items-start gap-1 pl-2 min-w-0">
                        <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest leading-none">Cidade</span>
                        <div className="flex items-center gap-1 text-muted-foreground font-black mt-1 w-full justify-center sm:justify-start min-w-0">
                          <MapPin className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                          <span className="truncate max-w-full text-[11px]">{prof.city.split(',')[0]}</span>
                        </div>
                      </div>
                    </div>

                    {/* Short Bio */}
                    <p className="text-xs text-muted-foreground leading-relaxed pr-2 font-medium">
                      {prof.bio}
                    </p>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 pt-1">
                      {getSkillTags(prof.id, prof.specialty).map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-black tracking-wider uppercase bg-foreground/[0.03] dark:bg-foreground/[0.02] border border-foreground/5 hover:border-primary/20 hover:bg-primary/5 hover:text-primary px-2.5 py-1 rounded-lg transition-all duration-300 text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA Action Buttons */}
                  <div className="flex flex-row gap-3 w-full pt-4 border-t border-foreground/5">
                    <Link to={`/cliente/chat/${prof.id}`} className="flex-1">
                      <Button variant="outline" className="w-full h-11 text-xs rounded-2xl font-black flex items-center justify-center gap-1.5 border-foreground/10 hover:bg-foreground/5 transition-all active:scale-[0.98] duration-300">
                        <MessageSquare className="w-4 h-4 text-primary shrink-0" /> Conversar
                      </Button>
                    </Link>
                    <Link to={`/cliente/busca?prof=${prof.id}`} className="flex-1">
                      <Button className="w-full btn-primary h-11 text-xs rounded-2xl font-black flex items-center justify-center gap-1.5 transition-all shadow-md shadow-primary/10 hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] duration-300">
                        <UserCheck className="w-4 h-4 shrink-0" /> Contratar Agora
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Section - Professional SaaS Redesign */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div
            onMouseMove={handleMouseMove}
            className="glass-card rounded-[36px] border border-white/5 bg-slate-950/40 backdrop-blur-md p-10 md:p-16 lg:p-20 text-left relative overflow-hidden group spotlight-card spotlight-border shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            {/* Background image absolute wrapper */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <img
                src={backgroundImg}
                alt="Fundo Tecnológico CTA"
                className="w-full h-full object-cover opacity-15 dark:opacity-10 scale-110 group-hover:scale-105 transition-transform duration-1000 object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/50" />
            </div>

            {/* Content Column (col-span-7) */}
            <div className="lg:col-span-7 space-y-8 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black mb-2 tracking-widest uppercase">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" /> Ecossistema TechFix
              </div>

              <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.95] drop-shadow-2xl">
                Pronto para elevar o nível <br />
                <span className="gradient-text">do seu setup?</span>
              </h2>

              <p className="text-base text-muted-foreground max-w-lg leading-relaxed font-medium">
                Conecte-se a técnicos homologados de elite que cuidam da sua tecnologia com agilidade e total proteção de pagamento.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link to="/cadastro">
                  <Button 
                    size="lg" 
                    onMouseEnter={() => setActiveProfile('client')}
                    onMouseLeave={() => setActiveProfile('technician')}
                    className="btn-primary h-14 px-10 text-base rounded-2xl font-black w-full sm:w-auto flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/45 hover:scale-[1.03] duration-300"
                  >
                    Se tornar um Cliente <ArrowRight className="w-5 h-5 shrink-0" />
                  </Button>
                </Link>
                <Link to="/cadastro">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    onMouseEnter={() => setActiveProfile('technician')}
                    className="h-14 px-10 text-base rounded-2xl border-foreground/10 hover:bg-foreground/5 font-black w-full sm:w-auto transition-all duration-300 hover:scale-[1.03]"
                  >
                    Quero ser um Técnico
                  </Button>
                </Link>
              </div>
            </div>

            {/* Floating Visual SaaS Column (col-span-5) */}
            <div className="lg:col-span-5 hidden lg:flex relative justify-center items-center h-full min-h-[360px] z-10 select-none">
              {/* Central glowing mesh spot behind mockup */}
              <div className="absolute w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none opacity-60 animate-pulse" />

              {/* PROFILE 1: TECHNICIAN */}
              <div 
                className={`absolute w-full flex flex-col justify-center items-center transition-all duration-500 ease-out transform ${
                  activeProfile === 'technician'
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
                }`}
              >
                {/* Floating Speed Responsive Badge */}
                <div className="absolute -top-4 left-6 bg-green-500/10 text-green-500 border border-green-500/20 px-3.5 py-2 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl -rotate-6 group-hover:-rotate-3 group-hover:-translate-y-2 transition-all duration-700 z-20 flex items-center gap-1.5 backdrop-blur-xl">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping shrink-0" />
                  Tempo de Resposta: 4 min
                </div>

                {/* Specialist Profile Mockup Card */}
                <div className="glass-card p-6 rounded-3xl border border-white/10 shadow-2xl relative w-72 rotate-3 group-hover:rotate-1 group-hover:-translate-y-1 group-hover:scale-[1.02] transition-all duration-700 bg-background/60 backdrop-blur-2xl z-10 space-y-4">
                  {/* Header Profile info */}
                  <div className="flex items-center gap-3.5">
                    <div className="relative shrink-0 flex items-center justify-center p-0.5 rounded-2xl border border-primary/25 bg-card/50">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
                        className="w-11 h-11 rounded-xl object-cover"
                        alt="Avatar"
                      />
                      <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                    </div>
                    <div className="min-w-0 text-left">
                      <h4 className="font-black text-sm text-foreground truncate">Lucas Alencar</h4>
                      <span className="text-[10px] font-black text-primary uppercase tracking-wider block">Hardware Specialist</span>
                    </div>
                  </div>

                  {/* Rating & Work indicators */}
                  <div className="grid grid-cols-2 gap-2 border-y border-white/5 py-2.5 text-[10px]">
                    <div className="text-left">
                      <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest block">Avaliação</span>
                      <span className="font-black text-yellow-500 flex items-center gap-1 mt-0.5"><Star className="w-3 h-3 fill-yellow-500 shrink-0" /> 4.9</span>
                    </div>
                    <div className="text-left border-l border-white/5 pl-2.5">
                      <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest block">Concluídos</span>
                      <span className="font-black text-primary flex items-center gap-1 mt-0.5"><CheckCircle2 className="w-3 h-3 shrink-0" /> +140 jobs</span>
                    </div>
                  </div>

                  {/* Tags in card */}
                  <div className="flex flex-wrap gap-1">
                    {["Watercooling", "RTX Overclock", "Linux"].map((tag) => (
                      <span key={tag} className="text-[8px] font-black tracking-wider bg-white/5 border border-white/5 text-muted-foreground px-2 py-0.5 rounded-md uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Floating Guarantee Badge */}
                <div className="absolute -bottom-4 right-6 bg-primary/10 text-primary border border-primary/20 px-3.5 py-2 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl rotate-6 group-hover:rotate-3 group-hover:translate-y-2 transition-all duration-700 z-20 flex items-center gap-1.5 backdrop-blur-xl">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-primary" />
                  Garantia TechFix Ativa
                </div>
              </div>

              {/* PROFILE 2: CLIENT */}
              <div 
                className={`absolute w-full flex flex-col justify-center items-center transition-all duration-500 ease-out transform ${
                  activeProfile === 'client'
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                    : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
                }`}
              >
                {/* Floating SLA Badge */}
                <div className="absolute -top-4 left-6 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3.5 py-2 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl -rotate-6 group-hover:-rotate-3 group-hover:-translate-y-2 transition-all duration-700 z-20 flex items-center gap-1.5 backdrop-blur-xl">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping shrink-0" />
                  Suporte VIP: SLA 1h
                </div>

                {/* Client Profile Mockup Card */}
                <div className="glass-card p-6 rounded-3xl border border-white/10 shadow-2xl relative w-72 rotate-3 group-hover:rotate-1 group-hover:-translate-y-1 group-hover:scale-[1.02] transition-all duration-700 bg-background/60 backdrop-blur-2xl z-10 space-y-4">
                  {/* Header Profile info */}
                  <div className="flex items-center gap-3.5">
                    <div className="relative shrink-0 flex items-center justify-center p-0.5 rounded-2xl border border-cyan-500/25 bg-card/50">
                      <img
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256"
                        className="w-11 h-11 rounded-xl object-cover"
                        alt="Avatar"
                      />
                      <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-cyan-500 border-2 border-background rounded-full" />
                    </div>
                    <div className="min-w-0 text-left">
                      <h4 className="font-black text-sm text-foreground truncate">Mariana Costa</h4>
                      <span className="text-[10px] font-black text-cyan-400 uppercase tracking-wider block">Tech Leader / Premium</span>
                    </div>
                  </div>

                  {/* Rating & Work indicators */}
                  <div className="grid grid-cols-2 gap-2 border-y border-white/5 py-2.5 text-[10px]">
                    <div className="text-left">
                      <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest block">Projetos</span>
                      <span className="font-black text-cyan-400 flex items-center gap-1 mt-0.5"><Sparkles className="w-3 h-3 text-cyan-400 shrink-0" /> +18 Reparos</span>
                    </div>
                    <div className="text-left border-l border-white/5 pl-2.5">
                      <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest block">Nível</span>
                      <span className="font-black text-yellow-500 flex items-center gap-1 mt-0.5"><Star className="w-3 h-3 fill-yellow-500 shrink-0" /> Membro Gold</span>
                    </div>
                  </div>

                  {/* Tags in card */}
                  <div className="flex flex-wrap gap-1">
                    {["Setup Dev", "iMac Upgrade", "Smart Home"].map((tag) => (
                      <span key={tag} className="text-[8px] font-black tracking-wider bg-white/5 border border-white/5 text-muted-foreground px-2 py-0.5 rounded-md uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Floating Guarantee Badge */}
                <div className="absolute -bottom-4 right-6 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3.5 py-2 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-xl rotate-6 group-hover:rotate-3 group-hover:translate-y-2 transition-all duration-700 z-20 flex items-center gap-1.5 backdrop-blur-xl">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                  Pagamento 100% Protegido
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;