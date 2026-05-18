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
  ShieldAlert
} from 'lucide-react';
import { services } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';
import backgroundImg from '@/assets/background_home.png';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cliente/busca?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center py-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={backgroundImg} 
            alt="Fundo Tecnológico" 
            className="w-full h-full object-cover opacity-60 dark:opacity-40 scale-105 object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl text-left">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-black mb-10 animate-pulse tracking-widest">
              <Zap className="w-5 h-5" />
              A SOLUÇÃO DEFINITIVA PARA SEUS PROBLEMAS DE TI
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.95] drop-shadow-2xl">
              Serviços de TI com <br />
              <span className="gradient-text">Excelência Técnica.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-2xl leading-relaxed font-medium">
              Conectamos você aos melhores especialistas para manutenção, montagem e suporte tecnológico de alto nível com total segurança.
            </p>

            {/* Search Bar - Left Aligned */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mb-20">
              <div className="relative group flex items-center">
                <div className="absolute left-6 text-muted-foreground group-focus-within:text-primary transition-colors">
                  <Search className="w-7 h-7" />
                </div>
                <Input 
                  placeholder="O que você precisa resolver hoje?" 
                  className="h-24 pl-16 pr-48 bg-card/60 backdrop-blur-2xl border-white/10 rounded-[2rem] text-2xl focus:ring-primary/50 transition-all shadow-2xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" className="absolute right-4 h-16 rounded-2xl px-10 btn-primary text-xl font-bold">
                  Buscar
                </Button>
              </div>
            </form>

            <div className="flex flex-wrap gap-12 md:gap-20">
              <div className="flex items-center gap-4 group">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="text-primary w-8 h-8" />
                </div>
                <div className="text-left">
                  <span className="text-3xl font-black block">+230</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold">Serviços</span>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Star className="text-yellow-500 w-8 h-8 fill-yellow-500" />
                </div>
                <div className="text-left">
                  <span className="text-3xl font-black block">4.9</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold">Avaliação</span>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ShieldCheck className="text-green-500 w-8 h-8" />
                </div>
                <div className="text-left">
                  <span className="text-3xl font-black block">100%</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold">Seguro</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-40 bg-card/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-black mb-6 tracking-tight">Categorias Especializadas</h2>
              <p className="text-muted-foreground text-xl leading-relaxed">Soluções completas para cada necessidade tecnológica, do hardware ao software.</p>
            </div>
            <Link to="/cliente/servicos" className="text-primary flex items-center gap-3 font-black text-xl hover:gap-6 transition-all group">
              Ver todas as categorias <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
            {[
              { name: 'Manutenção', icon: Wrench, desc: 'Limpeza e reparos', color: 'text-blue-500' },
              { name: 'Montagem', icon: Monitor, desc: 'PCs de alta performance', color: 'text-purple-500' },
              { name: 'Redes', icon: Network, desc: 'Wi-Fi e infraestrutura', color: 'text-cyan-500' },
              { name: 'Software', icon: Settings, desc: 'Otimização e sistemas', color: 'text-emerald-500' },
            ].map((cat) => (
              <Link key={cat.name} to={`/cliente/busca?q=${cat.name}`} className="glass-card p-10 rounded-[3rem] hover:border-primary/50 transition-all group relative overflow-hidden">
                <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all" />
                <div className={`w-20 h-20 bg-white/5 rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${cat.color}`}>
                  <cat.icon className="w-10 h-10" />
                </div>
                <h3 className="font-black text-3xl mb-3">{cat.name}</h3>
                <p className="text-muted-foreground text-lg">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-40">
        <div className="container mx-auto px-4">
          <div className="text-left mb-24">
            <h2 className="text-5xl font-black mb-6 tracking-tight">Serviços em Destaque</h2>
            <p className="text-muted-foreground text-xl">Os serviços mais solicitados pela nossa comunidade de entusiastas.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {services.map((service) => (
              <div key={service.id} className="glass-card rounded-[3rem] overflow-hidden group hover:translate-y-[-12px] transition-all duration-500">
                <div className="h-72 overflow-hidden relative">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {service.badge && (
                    <span className="absolute top-8 left-8 bg-primary text-background text-xs font-black px-4 py-2 rounded-full uppercase tracking-widest">
                      {service.badge}
                    </span>
                  )}
                </div>
                <div className="p-10">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-xs font-black text-primary uppercase tracking-[0.3em]">{service.category}</span>
                    <div className="flex items-center gap-2 text-yellow-500 font-black text-lg">
                      <Star className="w-5 h-5 fill-current" /> {service.rating}
                    </div>
                  </div>
                  <h3 className="text-3xl font-black mb-6 group-hover:text-primary transition-colors leading-tight">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-10 line-clamp-2 text-lg">{service.description}</p>
                  <div className="flex items-center justify-between pt-8 border-t border-white/5">
                    <div>
                      <span className="text-xs text-muted-foreground block mb-2 font-bold uppercase tracking-widest">Investimento</span>
                      <span className="text-3xl font-black text-primary">{formatCurrency(service.price)}</span>
                    </div>
                    <Link to={`/cliente/servico/${service.id}`}>
                      <Button variant="outline" className="rounded-2xl h-14 px-8 font-black text-lg hover:bg-primary hover:text-background transition-all">
                        Detalhes
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-40 bg-primary/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
            <div className="text-left group">
              <div className="w-28 h-28 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mb-10 group-hover:rotate-12 transition-transform">
                <ShieldCheck className="text-primary w-14 h-14" />
              </div>
              <h3 className="text-3xl font-black mb-6">Pagamento Protegido</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">Seu investimento fica seguro em nossa plataforma até que você aprove a conclusão do serviço.</p>
            </div>
            <div className="text-left group">
              <div className="w-28 h-28 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mb-10 group-hover:-rotate-12 transition-transform">
                <Users className="text-primary w-14 h-14" />
              </div>
              <h3 className="text-3xl font-black mb-6">Especialistas Verificados</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">Rigoroso processo de seleção e verificação de competências para garantir o melhor atendimento.</p>
            </div>
            <div className="text-left group">
              <div className="w-28 h-28 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                <ShieldAlert className="text-primary w-14 h-14" />
              </div>
              <h3 className="text-3xl font-black mb-6">Garantia de Satisfação</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">Suporte dedicado e garantia em todos os serviços realizados através da TechFix.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-40">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-primary/20 to-blue-600/20 border border-primary/20 rounded-[4rem] p-16 md:p-32 text-left relative overflow-hidden group">
            <div className="absolute -right-40 -top-40 w-[30rem] h-[30rem] bg-primary/10 blur-[150px] rounded-full group-hover:bg-primary/20 transition-all duration-1000" />
            <div className="absolute -left-40 -bottom-40 w-[30rem] h-[30rem] bg-blue-600/10 blur-[150px] rounded-full group-hover:bg-blue-600/20 transition-all duration-1000" />
            
            <h2 className="text-5xl md:text-8xl font-black mb-10 relative z-10 tracking-tighter leading-none">Pronto para elevar o nível <br /> do seu setup?</h2>
            <p className="text-2xl text-muted-foreground mb-16 max-w-3xl relative z-10 leading-relaxed font-medium">
              Junte-se a milhares de clientes que confiam na TechFix para cuidar de sua tecnologia com segurança e agilidade.
            </p>
            <div className="flex flex-col md:flex-row gap-8 relative z-10">
              <Link to="/cliente/servicos">
                <Button size="lg" className="btn-primary h-20 px-16 text-2xl rounded-3xl font-black">
                  Encontrar Técnico
                </Button>
              </Link>
              <Link to="/cadastro">
                <Button size="lg" variant="outline" className="h-20 px-16 text-2xl rounded-3xl border-white/10 hover:bg-white/5 font-black">
                  Quero ser um Técnico
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;