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
  Cpu, 
  Wrench, 
  Monitor, 
  Network, 
  Database, 
  HardDrive, 
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
      <section className="relative min-h-[85vh] flex items-center py-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={backgroundImg} 
            alt="Background" 
            className="w-full h-full object-cover object-right md:object-center opacity-40 dark:opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8 animate-pulse">
              <Zap className="w-4 h-4" />
              A SOLUÇÃO DEFINITIVA PARA SEUS PROBLEMAS DE TI
            </div>
            
            <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              Serviços de TI com <span className="gradient-text">Excelência Técnica.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-xl leading-relaxed">
              Conectamos você aos melhores especialistas para manutenção, montagem e suporte tecnológico de alto nível.
            </p>

            <form onSubmit={handleSearch} className="relative max-w-2xl mb-12">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-6 h-6" />
                <Input 
                  placeholder="O que você precisa resolver hoje? Ex: Montagem de PC" 
                  className="h-20 pl-14 pr-40 bg-card/40 backdrop-blur-xl border-white/10 rounded-3xl text-xl focus:ring-primary/50 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" className="absolute right-3 top-3 bottom-3 rounded-2xl px-8 btn-primary text-lg">
                  Buscar
                </Button>
              </div>
            </form>

            <div className="flex flex-wrap gap-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                  <CheckCircle2 className="text-primary w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-bold block">+230</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest">Serviços</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                  <Star className="text-yellow-500 w-6 h-6 fill-yellow-500" />
                </div>
                <div>
                  <span className="text-2xl font-bold block">4.9</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest">Avaliação</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                  <ShieldCheck className="text-green-500 w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl font-bold block">100%</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-widest">Seguro</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-32 bg-card/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl font-bold mb-4">Categorias Especializadas</h2>
              <p className="text-muted-foreground text-lg">Soluções completas para cada necessidade tecnológica.</p>
            </div>
            <Link to="/cliente/servicos" className="text-primary flex items-center gap-2 font-bold text-lg hover:gap-4 transition-all">
              Ver todas as categorias <ArrowRight className="w-6 h-6" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: 'Manutenção', icon: Wrench, desc: 'Limpeza e reparos', color: 'text-blue-500' },
              { name: 'Montagem', icon: Monitor, desc: 'PCs de alta performance', color: 'text-purple-500' },
              { name: 'Redes', icon: Network, desc: 'Wi-Fi e infraestrutura', color: 'text-cyan-500' },
              { name: 'Software', icon: Settings, desc: 'Otimização e sistemas', color: 'text-emerald-500' },
            ].map((cat) => (
              <Link key={cat.name} to={`/cliente/busca?q=${cat.name}`} className="glass-card p-8 rounded-[2.5rem] hover:border-primary/50 transition-all group relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all" />
                <div className={`w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${cat.color}`}>
                  <cat.icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-2xl mb-2">{cat.name}</h3>
                <p className="text-muted-foreground">{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">Serviços em Destaque</h2>
            <p className="text-muted-foreground text-lg">Os serviços mais solicitados pela nossa comunidade.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {services.map((service) => (
              <div key={service.id} className="glass-card rounded-[2.5rem] overflow-hidden group hover:translate-y-[-8px] transition-all duration-500">
                <div className="h-64 overflow-hidden relative">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  {service.badge && (
                    <span className="absolute top-6 left-6 bg-primary text-background text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                      {service.badge}
                    </span>
                  )}
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">{service.category}</span>
                    <div className="flex items-center gap-1.5 text-yellow-500 font-bold">
                      <Star className="w-4 h-4 fill-current" /> {service.rating}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-8 line-clamp-2">{service.description}</p>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div>
                      <span className="text-xs text-muted-foreground block mb-1">Investimento</span>
                      <span className="text-2xl font-black text-primary">{formatCurrency(service.price)}</span>
                    </div>
                    <Link to={`/cliente/servico/${service.id}`}>
                      <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold hover:bg-primary hover:text-background transition-all">
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
      <section className="py-32 bg-primary/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center group">
              <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:rotate-6 transition-transform">
                <ShieldCheck className="text-primary w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Pagamento Protegido</h3>
              <p className="text-muted-foreground leading-relaxed">Seu investimento fica seguro em nossa plataforma até que você aprove a conclusão do serviço.</p>
            </div>
            <div className="text-center group">
              <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:-rotate-6 transition-transform">
                <Users className="text-primary w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Especialistas Verificados</h3>
              <p className="text-muted-foreground leading-relaxed">Rigoroso processo de seleção e verificação de competências para garantir o melhor atendimento.</p>
            </div>
            <div className="text-center group">
              <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                <ShieldAlert className="text-primary w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold mb-4">Garantia de Satisfação</h3>
              <p className="text-muted-foreground leading-relaxed">Suporte dedicado e garantia em todos os serviços realizados através da TechFix.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-primary/20 to-blue-600/20 border border-primary/20 rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden group">
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-primary/10 blur-[120px] rounded-full group-hover:bg-primary/20 transition-all duration-1000" />
            <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full group-hover:bg-blue-600/20 transition-all duration-1000" />
            
            <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10">Pronto para elevar o nível do seu setup?</h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto relative z-10 leading-relaxed">
              Junte-se a milhares de clientes que confiam na TechFix para cuidar de sua tecnologia.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-6 relative z-10">
              <Link to="/cliente/servicos">
                <Button size="lg" className="btn-primary w-full md:w-auto h-16 px-12 text-xl rounded-2xl">
                  Encontrar Técnico
                </Button>
              </Link>
              <Link to="/cadastro">
                <Button size="lg" variant="outline" className="w-full md:w-auto h-16 px-12 text-xl rounded-2xl border-white/10 hover:bg-white/5">
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