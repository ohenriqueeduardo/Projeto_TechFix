import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench, 
  ToggleLeft, 
  ToggleRight, 
  Plus, 
  Layers, 
  Activity, 
  Sparkles,
  Search,
  Eye,
  EyeOff,
  Sliders,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

interface CategoryItem {
  id: string;
  name: string;
  count: number;
  status: 'active' | 'inactive';
}

interface ServiceItem {
  id: string;
  title: string;
  category: string;
  price: number;
  image?: string;
}

const AdminServicesPage = () => {
  const [categories, setCategories] = React.useState<CategoryItem[]>([]);
  const [services, setServices] = React.useState<ServiceItem[]>([]);
  const [newCatName, setNewCatName] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          const data = await res.json();
          setServices(data.map((s: { id: string; title: string; category: string; price: number; image?: string }) => ({
            id: s.id,
            title: s.title,
            category: s.category || 'Outros',
            price: s.price,
            image: s.image
          })));

          // Group by category
          const catMap = new Map<string, number>();
          data.forEach((s: { category?: string }) => {
            const c = s.category || 'Outros';
            catMap.set(c, (catMap.get(c) || 0) + 1);
          });

          const catList: CategoryItem[] = Array.from(catMap.entries()).map(([name, count], index) => ({
            id: `cat_${index}`,
            name,
            count,
            status: 'active'
          }));
          setCategories(catList);
        }
      } catch (e) {
        console.error('Failed to fetch services:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleToggleCategory = (id: string, name: string, currentStatus: 'active' | 'inactive') => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setCategories(prev => prev.map(c => c.id === id ? { ...c, status: nextStatus } : c));
    
    if (nextStatus === 'inactive') {
      toast.warning(`Categoria '${name}' foi temporariamente ocultada no marketplace.`);
    } else {
      toast.success(`Categoria '${name}' agora está visível para contratações!`);
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      toast.error('Por favor, insira o nome da nova categoria.');
      return;
    }

    const newCat: CategoryItem = {
      id: `cat_${Date.now()}`,
      name: newCatName,
      count: 0,
      status: 'active'
    };

    setCategories(prev => [...prev, newCat]);
    setNewCatName('');
    toast.success(`Categoria '${newCatName}' criada com sucesso!`);
  };

  if (isLoading) return <div className="p-12 text-center">Carregando serviços...</div>;

  return (
    <div className="space-y-10 animate-page-entrance max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-white/5 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <Layers className="w-6 h-6" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-primary">Moderação de Marketplace</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight">Serviços & Categorias</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie as categorias de reparos visíveis na plataforma, configure taxas e adicione novas especialidades.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Manage Categories (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Sliders className="w-5 h-5 text-primary" /> Categorias Homologadas
            </h2>
            <Badge className="bg-primary/10 text-primary border-primary/20 rounded-md text-[10px] font-black uppercase">
              {categories.length} cadastradas
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <Card key={cat.id} className={`p-5 bg-card/30 border-white/5 rounded-3xl hover:border-primary/20 transition-all duration-300 flex justify-between items-center group relative overflow-hidden ${cat.status === 'inactive' ? 'opacity-60' : ''}`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base leading-none group-hover:text-primary transition-colors">{cat.name}</h3>
                    {cat.status === 'active' ? (
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[8px] font-bold">Ativa</Badge>
                    ) : (
                      <Badge className="bg-muted text-muted-foreground border-white/5 text-[8px] font-bold">Oculta</Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground font-semibold">{cat.count} serviços associados</p>
                </div>

                {/* Status Toggle Switch */}
                <button 
                  onClick={() => handleToggleCategory(cat.id, cat.name, cat.status)}
                  className="p-2 text-muted-foreground hover:text-primary transition-colors focus:outline-none shrink-0"
                >
                  {cat.status === 'active' ? (
                    <div className="flex items-center gap-1 text-green-500">
                      <ToggleRight className="w-9 h-9" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <ToggleLeft className="w-9 h-9" />
                    </div>
                  )}
                </button>
              </Card>
            ))}
          </div>

          {/* Platform Services Overview */}
          <div className="space-y-4 pt-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Visão Geral de Ofertas ({services.length})
            </h2>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {services.map((s) => (
                <div key={s.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center group hover:border-primary/20 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <img src={s.image} className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0" alt={s.title} />
                    <div>
                      <h4 className="text-xs font-bold text-foreground leading-tight group-hover:text-primary transition-colors">{s.title}</h4>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <Badge className="bg-white/5 text-muted-foreground text-[8px] font-black uppercase px-2 rounded-sm">{s.category}</Badge>
                        <span className="text-[10px] text-muted-foreground font-semibold">Preço Médio: <span className="text-foreground">R$ {s.price}</span></span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-primary">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Add Proposed Category Sidebar (1/3 width) */}
        <div className="space-y-6">
          <Card className="p-6 bg-card/30 border-white/5 rounded-3xl relative overflow-hidden">
            <h3 className="text-base font-bold mb-1.5">Nova Categoria</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-5">
              Crie novas divisões no marketplace para organizar e guiar os clientes rumo aos melhores reparos.
            </p>
            
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Nome da Categoria</label>
                <input 
                  type="text" 
                  placeholder="Ex: SmartTVs, Console Gamer..." 
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full h-11 bg-foreground/5 border border-white/5 px-4 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary/50"
                />
              </div>

              <Button type="submit" className="w-full h-11 rounded-xl text-xs font-black tracking-wider uppercase bg-primary hover:bg-primary/95 text-primary-foreground flex gap-1.5">
                <Plus className="w-4 h-4" /> Criar Categoria
              </Button>
            </form>
          </Card>

          {/* Marketplace Stats */}
          <Card className="p-5 bg-gradient-to-br from-primary/10 via-blue-500/5 to-transparent border-primary/20 rounded-3xl relative overflow-hidden group">
            <h3 className="text-sm font-bold mb-1.5">Destaque do Marketplace</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
              A categoria **Manutenção** responde por mais de **45%** do faturamento bruto da plataforma neste trimestre.
            </p>
            <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary shrink-0 animate-pulse" />
              <span className="text-[10px] text-foreground font-black uppercase tracking-wider">Melhor Conversão: Limpeza PC</span>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default AdminServicesPage;
