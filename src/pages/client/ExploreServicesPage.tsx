import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Star, SlidersHorizontal, Clock, ArrowRight } from 'lucide-react';
import { Service, Professional, Order } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";

const ExploreServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = React.useState(query);
  const [category, setCategory] = React.useState('Todos');
  const [sortBy, setSortBy] = React.useState<string>('default');
  const [selectedProfId, setSelectedProfId] = React.useState<string>('todos');

  const [servicesList, setServicesList] = React.useState<Service[]>([]);
  const [openOrdersList, setOpenOrdersList] = React.useState<Order[]>([]);
  const [profsList, setProfsList] = React.useState<Professional[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [servicesRes, profsRes, ordersRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/professionals'),
          fetch('/api/orders?openOnly=true', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
          })
        ]);
        
        if (servicesRes.ok) {
          const data = await servicesRes.json();
          setServicesList(data);
        }
        if (profsRes.ok) {
          const data = await profsRes.json();
          setProfsList(data);
        }
        if (ordersRes.ok) {
          const data = await ordersRes.json();
          setOpenOrdersList(data);
        }
      } catch (err) {
        console.error('Error fetching explore data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Update searchTerm when URL query changes
  React.useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  }, []);

  // Memoize mapped orders and combine them with normal services
  const combinedServices = React.useMemo(() => {
    const mappedOrders: (Service & { isCustomOrder?: boolean })[] = openOrdersList.map(order => ({
      id: order.id,
      title: order.serviceTitle,
      category: 'Customizado',
      description: `Endereço/Detalhes: ${order.address}. Pedido customizado aberto aguardando um técnico.`,
      price: order.price,
      duration: 'A Combinar',
      rating: 0,
      professionalId: '',
      tags: ['Chamado Aberto', 'Urgente'],
      image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80',
      badge: 'NOVO CHAMADO',
      isCustomOrder: true
    }));
    return [...servicesList, ...mappedOrders];
  }, [servicesList, openOrdersList]);

  // Filter combined data
  const filteredServices = React.useMemo(() => {
    return combinedServices.filter(s => {
      const matchSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = category === 'Todos' || s.category === category;
      const matchProf = selectedProfId === 'todos' || s.professionalId === selectedProfId || s.isCustomOrder;
      
      return matchSearch && matchCategory && matchProf;
    });
  }, [searchTerm, category, selectedProfId, combinedServices]);

  // Sorting Logic
  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === 'price-asc') {
      return a.price - b.price;
    }
    if (sortBy === 'price-desc') {
      return b.price - a.price;
    }
    if (sortBy === 'alpha-asc') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'alpha-desc') {
      return b.title.localeCompare(a.title);
    }
    if (sortBy === 'best-sellers') {
      const aIsBest = a.badge === 'Mais Vendido' ? 1 : 0;
      const bIsBest = b.badge === 'Mais Vendido' ? 1 : 0;
      return bIsBest - aIsBest;
    }
    if (sortBy === 'featured') {
      const aIsFeat = (a.badge === 'Destaque' || a.badge === 'Recomendado') ? 1 : 0;
      const bIsFeat = (b.badge === 'Destaque' || b.badge === 'Recomendado') ? 1 : 0;
      return bIsFeat - aIsFeat;
    }
    return 0; // Default
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {/* Background radial decorations for premium look */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(6,182,212,0.015),transparent_50%)] pointer-events-none" />

      {/* Top Search bar area */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between relative z-10">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors w-4.5 h-4.5" />
          <Input 
            placeholder="O que você deseja resolver hoje? Ex: Manutenção" 
            className="pl-11 bg-card/40 border-white/5 rounded-xl h-11 text-sm focus:ring-primary/40 focus:border-primary/40 text-foreground"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Dropdown triggers for sorting and filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto gap-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 text-primary font-black text-xs h-11 px-5 rounded-xl shadow-md transition-all active:scale-[0.98]">
                <SlidersHorizontal className="w-4 h-4 text-primary animate-pulse" /> Filtrar & Ordenar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-card border border-white/10 bg-slate-950/95 text-foreground backdrop-blur-2xl p-2 rounded-2xl shadow-2xl z-50">
              <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground px-2.5 py-1.5">Classificar</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                <DropdownMenuRadioItem value="default" className="text-xs font-bold rounded-lg cursor-pointer">Padrão</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="price-asc" className="text-xs font-bold rounded-lg cursor-pointer">Menor Preço</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="price-desc" className="text-xs font-bold rounded-lg cursor-pointer">Maior Preço</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="alpha-asc" className="text-xs font-bold rounded-lg cursor-pointer">Ordem A-Z</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="alpha-desc" className="text-xs font-bold rounded-lg cursor-pointer">Ordem Z-A</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="best-sellers" className="text-xs font-bold rounded-lg cursor-pointer">Mais Vendidos</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="featured" className="text-xs font-bold rounded-lg cursor-pointer">Mais Procurados</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>

              <DropdownMenuSeparator className="bg-white/5 my-1.5" />

              <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground px-2.5 py-1.5">Categorias</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={category} onValueChange={setCategory}>
                <DropdownMenuRadioItem value="Todos" className="text-xs font-bold rounded-lg cursor-pointer">Todas</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Hardware" className="text-xs font-bold rounded-lg cursor-pointer">Hardware</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Customizado" className="text-xs font-bold rounded-lg cursor-pointer">Chamados (Customizado)</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Redes" className="text-xs font-bold rounded-lg cursor-pointer">Redes</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="Software" className="text-xs font-bold rounded-lg cursor-pointer">Software</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>

              <DropdownMenuSeparator className="bg-white/5 my-1.5" />

              <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground px-2.5 py-1.5">Técnicos</DropdownMenuLabel>
              <DropdownMenuRadioGroup value={selectedProfId} onValueChange={setSelectedProfId}>
                <DropdownMenuRadioItem value="todos" className="text-xs font-bold rounded-lg cursor-pointer">Todos Técnicos</DropdownMenuRadioItem>
                {profsList.map(p => (
                  <DropdownMenuRadioItem key={p.id} value={p.id} className="text-xs font-bold rounded-lg cursor-pointer">
                    {p.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Filter Tags */}
      {(category !== 'Todos' || selectedProfId !== 'todos' || sortBy !== 'default') && (
        <div className="flex flex-wrap items-center gap-2 animate-in zoom-in-95 duration-300 relative z-10 px-1">
          <span className="text-[9px] font-black uppercase tracking-wider text-muted-foreground mr-1">Filtros ativos:</span>
          {category !== 'Todos' && (
            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 text-[10px] font-black uppercase tracking-wider">
              {category}
              <button onClick={() => setCategory('Todos')} className="hover:text-red-500 font-bold ml-1 cursor-pointer">✕</button>
            </span>
          )}
          {selectedProfId !== 'todos' && (
            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 text-[10px] font-black uppercase tracking-wider">
              Técnico: {profsList.find(p => p.id === selectedProfId)?.name.split(' ')[0] || selectedProfId}
              <button onClick={() => setSelectedProfId('todos')} className="hover:text-red-500 font-bold ml-1 cursor-pointer">✕</button>
            </span>
          )}
          {sortBy !== 'default' && (
            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 text-[10px] font-black uppercase tracking-wider">
              {
                sortBy === 'price-asc' ? 'Menor Preço' :
                sortBy === 'price-desc' ? 'Maior Preço' :
                sortBy === 'alpha-asc' ? 'A-Z' :
                sortBy === 'alpha-desc' ? 'Z-A' :
                sortBy === 'best-sellers' ? 'Mais Vendidos' : 'Mais Procurados'
              }
              <button onClick={() => setSortBy('default')} className="hover:text-red-500 font-bold ml-1 cursor-pointer">✕</button>
            </span>
          )}
          <button 
            onClick={() => {
              setCategory('Todos');
              setSelectedProfId('todos');
              setSortBy('default');
            }}
            className="text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors ml-2 cursor-pointer"
          >
            Limpar todos
          </button>
        </div>
      )}

      {/* Results Header Info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground font-medium px-1 relative z-10">
        <p>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full border-2 border-t-primary border-white/5 animate-spin"></span> Carregando...
            </span>
          ) : (
            <>
              Mostrando <span className="text-foreground font-bold">{sortedServices.length}</span> resultados
              {searchTerm && <span> para "<span className="text-primary">{searchTerm}</span>"</span>}
            </>
          )}
        </p>
      </div>

      {/* Services Grid ( h-[480px] with same Hover Panel details scheme & Spotlight ) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {sortedServices.map((service) => (
          <div 
            key={service.id} 
            onMouseMove={handleMouseMove}
            className="glass-card rounded-3xl border border-white/5 bg-card/15 backdrop-blur-md flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:-translate-y-1.5 transition-all duration-500 spotlight-card spotlight-border group h-[480px] relative"
          >
            {/* Radial glow background spot */}
            <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all pointer-events-none" />

            {/* Cover Image */}
            <div className="h-44 overflow-hidden relative shrink-0">
              <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                {service.category}
              </span>
              {service.badge && (
                <span className="absolute top-4 right-4 bg-yellow-500 text-slate-950 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  {service.badge}
                </span>
              )}
            </div>

            {/* Card Content details */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{service.category}</span>
                  <div className="flex items-center gap-1 text-yellow-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current shrink-0" /> {service.rating}
                  </div>
                </div>
                <h3 className="text-lg font-black tracking-tight group-hover:text-primary transition-colors line-clamp-1">{service.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 font-medium">{service.description}</p>
                
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold pt-2.5 border-t border-white/5">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <span>Prazo estimado: <strong className="text-foreground">{service.duration || '1-2 dias'}</strong></span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-4">
                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest leading-none">Investimento</span>
                  <span className="text-lg font-black text-primary mt-1">{formatCurrency(service.price)}</span>
                </div>
              </div>
            </div>

            {/* Hover expanded panel - Vercel Style cross-fading */}
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

                <p className="text-muted-foreground leading-relaxed text-xs max-h-[120px] overflow-y-auto pr-1 font-medium">
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
                  <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none">
                    {service.isCustomOrder ? 'A Pagar' : 'Investimento'}
                  </span>
                  <span className="text-xl font-black text-primary mt-1">{formatCurrency(service.price)}</span>
                </div>
                <Link to={service.isCustomOrder ? '/profissional/servicos' : `/cliente/servico/${service.id}`}>
                  <Button className={`h-10 px-5 text-xs font-black rounded-xl flex items-center gap-1.5 shadow-md shadow-primary/10 hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] duration-300 ${service.isCustomOrder ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'btn-primary'}`}>
                    {service.isCustomOrder ? 'Aceitar Chamado' : 'Ver Detalhes'} <ArrowRight className="w-4 h-4 shrink-0" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedServices.length === 0 && (
        <div className="text-center py-20 glass-card rounded-3xl border border-dashed border-white/10 max-w-md mx-auto p-8 space-y-6 relative z-10">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2 animate-float">
            <Search className="text-muted-foreground w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-black">Nenhum serviço correspondente</h3>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              Infelizmente não encontramos serviços com esses filtros ou termos de busca. Tente redefinir suas preferências ou limpar os filtros ativos.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setCategory('Todos');
              setSelectedProfId('todos');
              setSortBy('default');
            }} 
            className="text-primary hover:text-primary/80 border-primary/25 hover:bg-primary/5 font-black text-xs h-10 px-5 rounded-xl"
          >
            Limpar todos os filtros
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExploreServicesPage;