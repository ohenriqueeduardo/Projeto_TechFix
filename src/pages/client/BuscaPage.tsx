import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Star, 
  Clock, 
  ArrowRight, 
  SlidersHorizontal, 
  Sparkles, 
  Wrench, 
  Monitor, 
  Network, 
  Settings,
  ShieldCheck,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { Service, Professional } from '@/types';
import { formatCurrency } from '@/utils/formatters';

const BuscaPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const profParam = searchParams.get('prof') || '';
  
  const [searchQuery, setSearchQuery] = React.useState(queryParam);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('todos');
  const [services, setServices] = React.useState<Service[]>([]);
  const [localProfs, setLocalProfs] = React.useState<Professional[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, profsRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/professionals')
        ]);
        
        if (servicesRes.ok) {
          const data = await servicesRes.json();
          setServices(data);
        }
        if (profsRes.ok) {
          const data = await profsRes.json();
          setLocalProfs(data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Set searchQuery when URL parameter changes (e.g. from homepage click)
  React.useEffect(() => {
    setSearchQuery(queryParam);
    if (queryParam) {
      // If query matches a key category name, select it automatically
      const lowerQuery = queryParam.toLowerCase();
      if (lowerQuery.includes('manuten')) setSelectedCategory('Manutenção');
      else if (lowerQuery.includes('montag')) setSelectedCategory('Montagem');
      else if (lowerQuery.includes('redes') || lowerQuery.includes('rede')) setSelectedCategory('Redes');
      else if (lowerQuery.includes('soft') || lowerQuery.includes('format')) setSelectedCategory('Software');
      else setSelectedCategory('todos');
    }
  }, [queryParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: searchQuery });
  };

  const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  }, []);

  const categories = [
    { id: 'todos', name: 'Todos os Serviços', icon: FolderOpen },
    { id: 'Manutenção', name: 'Manutenção', icon: Wrench },
    { id: 'Montagem', name: 'Montagem', icon: Monitor },
    { id: 'Redes', name: 'Redes', icon: Network },
    { id: 'Software', name: 'Software', icon: Settings },
  ];

  const selectedProf = localProfs.find(p => p.id === profParam);

  // Filters logic
  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'todos' || service.category.toLowerCase().includes(selectedCategory.toLowerCase());
    
    const searchTerms = searchQuery.toLowerCase().trim();
    const matchesSearch = !searchTerms || 
      service.title.toLowerCase().includes(searchTerms) ||
      service.description.toLowerCase().includes(searchTerms) ||
      service.category.toLowerCase().includes(searchTerms);

    const matchesProfessional = !profParam || service.professionalId === profParam;

    return matchesCategory && matchesSearch && matchesProfessional;
  });

  return (
    <div className="min-h-screen py-10 bg-background text-foreground transition-colors duration-300">
      
      {/* Background spotlights decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(6,182,212,0.02),transparent_50%)] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none opacity-30" />

      <div className="container mx-auto px-4 max-w-6xl space-y-10 relative z-10">
        
        {/* Header Block */}
        <div className="space-y-3 text-left animate-in fade-in slide-in-from-left-6 duration-500">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" /> {selectedProf ? 'Especialista homologado' : 'Serviços homologados'}
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-none">
            {selectedProf ? `Serviços de ${selectedProf.name}` : 'Buscar Serviços de TI'}
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl font-medium">
            {selectedProf 
              ? `Visualizando o portfólio de soluções ativas e certificadas sob responsabilidade técnica de ${selectedProf.name} (${selectedProf.specialty}).`
              : 'Encontre a solução ideal e técnicos excepcionais para atender seu setup e necessidades corporativas.'
            }
          </p>

          {selectedProf && (
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3.5 py-1.5 rounded-2xl border border-primary/20 text-xs font-black mt-2 animate-in zoom-in-95 duration-300">
              <span>Filtrado por técnico: <strong className="text-foreground font-black">{selectedProf.name}</strong></span>
              <button 
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete('prof');
                  setSearchParams(newParams);
                }}
                className="hover:text-red-500 font-black text-xs ml-2 cursor-pointer transition-colors text-primary"
                title="Limpar filtro"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Filter & Search Bar Panel */}
        <div className="glass-card p-6 rounded-3xl border border-white/5 bg-card/15 backdrop-blur-md space-y-6 shadow-xl">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-5 h-5" />
              <Input
                placeholder="O que você deseja consertar ou montar hoje?"
                className="h-12 pl-12 bg-white/5 border-white/5 rounded-xl text-sm focus:ring-primary/40 focus:border-primary/40 transition-all text-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="btn-primary h-12 px-8 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
              Pesquisar
            </Button>
          </form>

          {/* Quick Categories Bar */}
          <div className="space-y-2">
            <label className="text-[10px] text-muted-foreground uppercase font-black tracking-widest flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-primary" /> Filtrar por Categoria
            </label>
            <div className="flex flex-wrap gap-2.5">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      // Clear search query if selecting other category to view all of it
                      if (cat.id !== 'todos' && searchQuery === queryParam) {
                        setSearchQuery('');
                        setSearchParams({});
                      }
                    }}
                    className={`h-10 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all duration-300 border ${
                      isSelected 
                        ? 'bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.03]' 
                        : 'bg-white/5 border-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 hover:border-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center text-xs text-muted-foreground font-medium px-1">
          <span>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full border-2 border-t-primary border-white/5 animate-spin"></span> Carregando...
              </span>
            ) : (
              <>Mostrando <strong className="text-foreground">{filteredServices.length}</strong> {filteredServices.length === 1 ? 'serviço encontrado' : 'serviços encontrados'}.</>
            )}
          </span>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              onMouseMove={handleMouseMove}
              className="glass-card rounded-3xl border border-white/5 bg-card/15 backdrop-blur-md flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1.5 transition-all duration-500 spotlight-card spotlight-border group h-[480px] relative"
            >
              {/* Radial glow background spot */}
              <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all pointer-events-none" />

              {/* Cover Image & Category Badge */}
              <div className="h-44 overflow-hidden relative shrink-0">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  {service.category}
                </span>
                {service.badge && (
                  <span className="absolute top-4 right-4 bg-yellow-500 text-slate-950 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {service.badge}
                  </span>
                )}
              </div>

              {/* Service description details */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{service.category}</span>
                    <div className="flex items-center gap-1 text-yellow-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current shrink-0" /> {service.rating}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-black tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                    {service.title}
                  </h3>
                  
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 font-medium">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold pt-2.5 border-t border-white/5">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <span>Prazo estimado: <strong className="text-foreground">{service.duration || '1-2 dias'}</strong></span>
                  </div>
                </div>

                {/* Investment & Hailing Action Buttons */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-4">
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest leading-none">Investimento</span>
                    <span className="text-lg font-black text-primary mt-1">{formatCurrency(service.price)}</span>
                  </div>
                  <Link to={`/cliente/servico/${service.id}`}>
                    <Button className="btn-primary h-10 px-5 text-xs font-black rounded-xl flex items-center gap-1.5 shadow-md shadow-primary/10 hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] duration-300">
                      Contratar <ArrowRight className="w-4 h-4 shrink-0" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Hover expanded panel - The Same Scheme! */}
              <div className="absolute inset-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl p-6 flex flex-col justify-between opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20 pointer-events-none group-hover:pointer-events-auto border border-primary/20 rounded-3xl">
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
                        <span key={tag} className="text-[9px] font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full uppercase tracking-wider">
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
                    <Button className="btn-primary h-10 px-5 text-xs font-black rounded-xl flex items-center gap-1.5 shadow-md shadow-primary/10 hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] duration-300">
                      Contratar <ArrowRight className="w-4 h-4 shrink-0" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredServices.length === 0 && (
          <div className="text-center py-20 glass-card rounded-3xl border border-dashed border-white/10 max-w-md mx-auto p-8 space-y-6">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2 animate-float">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-black">Nenhum serviço correspondente</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                Infelizmente não encontramos serviços com esses termos ou na categoria escolhida. Tente redefinir o termo de busca ou limpar os filtros.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('todos');
                setSearchParams({});
              }} 
              className="text-primary hover:text-primary/80 border-primary/25 hover:bg-primary/5 font-black text-xs h-10 px-5 rounded-xl"
            >
              Resetar Filtros
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default BuscaPage;
