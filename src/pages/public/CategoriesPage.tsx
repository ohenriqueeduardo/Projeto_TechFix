import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Wrench, 
  Monitor, 
  Network, 
  Settings, 
  RefreshCw, 
  Cpu, 
  ShieldAlert, 
  Laptop, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

const categories = [
  { name: 'Manutenção', icon: Wrench, desc: 'Limpeza física preventiva, troca de pasta térmica e reparos de placas.', count: 42, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { name: 'Upgrade', icon: Cpu, desc: 'Instalação de SSDs velozes, placas de vídeo e expansões de memória RAM.', count: 35, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  { name: 'Formatação', icon: RefreshCw, desc: 'Reinstalação limpa de Windows/macOS/Linux com backup seguro de arquivos.', count: 28, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { name: 'Redes', icon: Network, desc: 'Instalação de Wi-Fi Mesh, cabeamento de alto nível e configuração de servidores.', count: 19, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { name: 'Recuperação', icon: ShieldAlert, desc: 'Recuperação profissional de HDs/SSDs corrompidos e proteção a arquivos criptografados.', count: 14, color: 'text-red-500', bg: 'bg-red-500/10' },
  { name: 'Montagem Gamer', icon: Monitor, desc: 'Montagem artesanal de PCs gamers de alto desempenho com cable management.', count: 31, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { name: 'Diagnóstico', icon: Laptop, desc: 'Varredura completa de hardware e software para identificar problemas de travamento.', count: 23, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { name: 'Suporte remoto', icon: Settings, desc: 'Atendimento e otimização imediata de sistemas via softwares de conexão remota.', count: 50, color: 'text-pink-500', bg: 'bg-pink-500/10' },
];

const CategoriesPage = () => {
  const [search, setSearch] = React.useState('');

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen py-16 bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-6xl space-y-12">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-foreground/5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Soluções Completas
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">Todas as Categorias</h1>
            <p className="text-muted-foreground text-sm max-w-xl">
              Navegue entre nossas especialidades e encontre técnicos homologados prontos para otimizar, consertar ou montar seu setup.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:max-w-xs shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Buscar categoria..." 
              className="h-11 pl-10 bg-card/50 border-foreground/10 rounded-xl text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredCategories.map((cat, idx) => {
            const IconComponent = cat.icon;
            return (
              <Link 
                key={idx} 
                to={`/cliente/busca?q=${encodeURIComponent(cat.name)}`}
                className="glass-card p-8 rounded-3xl hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group flex flex-col justify-between h-72 relative overflow-hidden"
              >
                {/* Visual background blob */}
                <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl group-hover:scale-150 transition-transform ${cat.bg} opacity-20`} />

                <div className="space-y-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0 ${cat.bg} ${cat.color}`}>
                    <IconComponent className="w-7 h-7" />
                  </div>
                  
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-black group-hover:text-primary transition-colors">{cat.name}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3">{cat.desc}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-foreground/5">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{cat.count} profissionais</span>
                  <div className="w-8 h-8 rounded-full bg-foreground/5 group-hover:bg-primary group-hover:text-background flex items-center justify-center transition-all duration-300">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-20 glass-card rounded-3xl border border-dashed border-foreground/10 max-w-md mx-auto p-8 space-y-4">
            <div className="w-16 h-16 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-2 animate-float">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold">Nenhuma categoria encontrada</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tente redefinir o termo de busca para encontrar o serviço de TI que você deseja.
            </p>
            <Button variant="link" onClick={() => setSearch('')} className="text-primary font-bold text-xs p-0">
              Limpar busca
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CategoriesPage;
