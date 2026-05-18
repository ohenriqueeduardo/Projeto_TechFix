import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Star, SlidersHorizontal } from 'lucide-react';
import { services } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';

const ExploreServicesPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [searchTerm, setSearchTerm] = React.useState(query);
  const [category, setCategory] = React.useState('Todos');

  const filteredServices = services.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'Todos' || s.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Todos', 'Manutenção', 'Montagem', 'Redes', 'Software'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Buscar serviços..." 
            className="pl-10 bg-card/50 border-white/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {categories.map(cat => (
            <Button 
              key={cat}
              variant={category === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategory(cat)}
              className="rounded-full whitespace-nowrap"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="text-foreground font-bold">{filteredServices.length}</span> resultados
          {searchTerm && <span> para "<span className="text-primary">{searchTerm}</span>"</span>}
        </p>
        <Button variant="ghost" size="sm" className="gap-2">
          <SlidersHorizontal className="w-4 h-4" /> Ordenar
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <Link key={service.id} to={`/cliente/servico/${service.id}`} className="glass-card rounded-2xl overflow-hidden group hover:border-primary/30 transition-all">
            <div className="h-40 overflow-hidden relative">
              <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-yellow-500 text-xs font-bold">
                <Star className="w-3 h-3 fill-current" /> {service.rating}
              </div>
            </div>
            <div className="p-5">
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 block">{service.category}</span>
              <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
              <p className="text-muted-foreground text-xs line-clamp-2 mb-4">{service.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-lg font-bold">{formatCurrency(service.price)}</span>
                <Button size="sm" variant="secondary" className="rounded-lg">Ver Detalhes</Button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-muted-foreground w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Nenhum serviço encontrado</h3>
          <p className="text-muted-foreground">Tente ajustar seus filtros ou termo de busca.</p>
          <Button variant="link" onClick={() => { setSearchTerm(''); setCategory('Todos'); }} className="mt-4 text-primary">
            Limpar todos os filtros
          </Button>
        </div>
      )}
    </div>
  );
};

export default ExploreServicesPage;