import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ShieldCheck, Star, Users, Zap, ArrowRight, CheckCircle2, Cpu } from 'lucide-react';
import { services } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';

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
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent -z-10" />
        
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-6 animate-bounce">
            <Zap className="w-3 h-3" />
            NOVA ERA DE SERVIÇOS DE TI
          </div>
          
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
            Serviços de TI sob demanda, com <span className="gradient-text">profissionais verificados.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Encontre técnicos especializados para manutenção, montagem, redes e suporte tecnológico com garantia e segurança.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative mb-12">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="O que você precisa resolver hoje? Ex: Montagem de PC" 
                className="h-16 pl-12 pr-32 bg-card/50 border-white/10 rounded-2xl text-lg focus:ring-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" className="absolute right-2 top-2 bottom-2 rounded-xl px-6 btn-primary">
                Buscar
              </Button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">+230</span>
              <span className="text-sm text-muted-foreground">Serviços realizados</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">4.9</span>
              <span className="text-sm text-muted-foreground">Avaliação média</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold">100%</span>
              <span className="text-sm text-muted-foreground">Técnicos verificados</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-card/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Categorias Populares</h2>
              <p className="text-muted-foreground">Os serviços mais procurados pelos nossos clientes.</p>
            </div>
            <Link to="/cliente/servicos" className="text-primary flex items-center gap-2 font-medium hover:underline">
              Ver todas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {['Manutenção', 'Montagem', 'Redes', 'Software'].map((cat) => (
              <Link key={cat} to={`/cliente/busca?q=${cat}`} className="glass-card p-6 rounded-2xl hover:border-primary/50 transition-all group">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Cpu className="text-primary" />
                </div>
                <h3 className="font-bold text-lg">{cat}</h3>
                <p className="text-sm text-muted-foreground">A partir de R$ 80</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Serviços em Destaque</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="glass-card rounded-2xl overflow-hidden group hover:translate-y-[-4px] transition-all">
                <div className="h-48 overflow-hidden relative">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {service.badge && (
                    <span className="absolute top-4 left-4 bg-primary text-background text-[10px] font-bold px-2 py-1 rounded uppercase">
                      {service.badge}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{service.category}</span>
                    <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold">
                      <Star className="w-3 h-3 fill-current" /> {service.rating}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6 line-clamp-2">{service.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div>
                      <span className="text-xs text-muted-foreground block">A partir de</span>
                      <span className="text-xl font-bold text-primary">{formatCurrency(service.price)}</span>
                    </div>
                    <Link to={`/cliente/servico/${service.id}`}>
                      <Button variant="outline" className="rounded-xl">Detalhes</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Pagamento Seguro</h3>
              <p className="text-muted-foreground">Seu dinheiro fica protegido até que o serviço seja concluído e aprovado por você.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Técnicos Verificados</h3>
              <p className="text-muted-foreground">Todos os profissionais passam por uma rigorosa verificação de identidade e competência.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-primary w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3">Garantia TechFix</h3>
              <p className="text-muted-foreground">Oferecemos suporte total e garantia em todos os serviços realizados através da plataforma.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-br from-primary/20 to-blue-600/20 border border-primary/20 rounded-[2rem] p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -z-10" />
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Pronto para resolver seu problema de TI?</h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
              Junte-se a milhares de clientes satisfeitos e encontre o profissional ideal agora mesmo.
            </p>
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Link to="/cliente/servicos">
                <Button size="lg" className="btn-primary w-full md:w-auto h-14 px-10 text-lg">Buscar Serviços</Button>
              </Link>
              <Link to="/cadastro/profissional">
                <Button size="lg" variant="outline" className="w-full md:w-auto h-14 px-10 text-lg rounded-xl">Quero ser um Técnico</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;