import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  Filter,
  Search,
  Download,
  Percent,
  Landmark
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface FinanceRecord {
  id: string;
  type: 'income' | 'payout' | 'fee';
  amount: number;
  date: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  user?: string;
}

const AdminFinancePage = () => {
  const [records, setRecords] = React.useState<FinanceRecord[]>([]);
  const [filter, setFilter] = React.useState<'all' | 'income' | 'payout' | 'fee'>('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulando fetch de dados globais
    setTimeout(() => {
      setRecords([
        { id: '1', type: 'income', amount: 150.00, date: '2024-03-15T10:30:00Z', description: 'Pagamento Serviço #A12B', status: 'completed', user: 'Carlos Silva' },
        { id: '2', type: 'fee', amount: 15.00, date: '2024-03-15T10:30:00Z', description: 'Taxa Plataforma (10%)', status: 'completed' },
        { id: '3', type: 'payout', amount: 135.00, date: '2024-03-16T14:00:00Z', description: 'Repasse Técnico', status: 'completed', user: 'Marcos Técnico' },
        { id: '4', type: 'payout', amount: 500.00, date: '2024-03-17T09:00:00Z', description: 'Saque Solicitado', status: 'pending', user: 'Ana Especialista' },
        { id: '5', type: 'income', amount: 300.00, date: '2024-03-17T11:20:00Z', description: 'Pagamento Serviço #C34D', status: 'completed', user: 'Roberto Santos' },
        { id: '6', type: 'fee', amount: 30.00, date: '2024-03-17T11:20:00Z', description: 'Taxa Plataforma (10%)', status: 'completed' },
      ]);
      setIsLoading(false);
    }, 800);
  }, []);

  const totalRevenue = records.filter(r => r.type === 'income').reduce((acc, r) => acc + r.amount, 0);
  const totalFees = records.filter(r => r.type === 'fee').reduce((acc, r) => acc + r.amount, 0);
  const pendingPayouts = records.filter(r => r.type === 'payout' && r.status === 'pending').reduce((acc, r) => acc + r.amount, 0);

  const filteredRecords = records.filter(r => {
    const matchesFilter = filter === 'all' || r.type === filter;
    const matchesSearch = r.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (r.user?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getRecordIcon = (type: string) => {
    switch(type) {
      case 'income': return <div className="p-2 bg-green-500/10 text-green-500 rounded-xl"><ArrowUpRight className="w-5 h-5" /></div>;
      case 'payout': return <div className="p-2 bg-red-500/10 text-red-500 rounded-xl"><ArrowDownRight className="w-5 h-5" /></div>;
      case 'fee': return <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-xl"><Percent className="w-5 h-5" /></div>;
      default: return <div className="p-2 bg-muted text-muted-foreground rounded-xl"><DollarSign className="w-5 h-5" /></div>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-[9px] uppercase px-1.5 py-0 font-black">Concluído</Badge>;
      case 'pending': return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-[9px] uppercase px-1.5 py-0 font-black">Pendente</Badge>;
      case 'failed': return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-[9px] uppercase px-1.5 py-0 font-black">Falhou</Badge>;
      default: return null;
    }
  };

  if (isLoading) return <div className="p-12 text-center">Carregando tesouraria...</div>;

  return (
    <div className="flex flex-col lg:h-[calc(100vh-130px)] gap-6 animate-page-entrance max-w-7xl mx-auto overflow-y-auto lg:overflow-hidden pb-10 lg:pb-0 px-4 md:px-8 pt-4 md:pt-8">
      
      {/* Header */}
      <div className="shrink-0 border-b border-white/5 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-yellow-500/10 rounded-lg">
            <Landmark className="w-5 h-5 text-yellow-500" />
          </div>
          <span className="text-[10px] font-black tracking-widest text-yellow-500 uppercase">Tesouraria Central</span>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">Gestão Financeira</h1>
            <p className="text-sm text-muted-foreground mt-1">Acompanhe todas as transações, repasses e lucros da plataforma.</p>
          </div>
          <Button variant="outline" className="border-white/10 gap-2 font-bold text-xs">
            <Download className="w-4 h-4" /> Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="shrink-0 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 glass-card rounded-3xl border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-green-500/10 blur-[40px] rounded-full pointer-events-none transition-all group-hover:bg-green-500/20" />
          <div className="relative z-10">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Volume Transacionado</p>
            <h3 className="text-3xl font-black text-green-500">{formatCurrency(totalRevenue)}</h3>
            <p className="text-xs text-muted-foreground mt-2 font-semibold">Total bruto circulando na plataforma</p>
          </div>
        </Card>
        
        <Card className="p-6 glass-card rounded-3xl border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-cyan-500/10 blur-[40px] rounded-full pointer-events-none transition-all group-hover:bg-cyan-500/20" />
          <div className="relative z-10">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Lucro Líquido (Taxas)</p>
            <h3 className="text-3xl font-black text-cyan-400">{formatCurrency(totalFees)}</h3>
            <p className="text-xs text-muted-foreground mt-2 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> Crescimento estável
            </p>
          </div>
        </Card>

        <Card className="p-6 glass-card rounded-3xl border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-orange-500/10 blur-[40px] rounded-full pointer-events-none transition-all group-hover:bg-orange-500/20" />
          <div className="relative z-10">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Repasses Pendentes</p>
            <h3 className="text-3xl font-black text-orange-500">{formatCurrency(pendingPayouts)}</h3>
            <p className="text-xs text-orange-500/70 mt-2 font-semibold">Aguardando liberação de saque</p>
          </div>
        </Card>
      </div>

      {/* Main Area: Controls & List */}
      <div className="flex-1 flex flex-col min-h-0 space-y-4 pb-4">
        <div className="shrink-0 flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/20 p-3 border border-white/5 rounded-2xl backdrop-blur-md">
          <div className="flex gap-2 w-full sm:w-auto">
            {[
              { id: 'all', label: 'Tudo' },
              { id: 'income', label: 'Entradas' },
              { id: 'payout', label: 'Repasses' },
              { id: 'fee', label: 'Taxas' }
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id as any)}
                className={`px-4 py-2 text-[10px] uppercase tracking-wider font-black rounded-xl transition-all duration-300 ${
                  filter === btn.id
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'text-muted-foreground hover:bg-foreground/5'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Buscar registro..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 bg-black/20 border border-white/10 pl-9 pr-4 rounded-xl text-xs font-medium focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>

        <Card className="flex-1 overflow-hidden bg-card/30 border-white/5 rounded-3xl flex flex-col">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-black/20">
            <div className="col-span-5 md:col-span-4">Descrição</div>
            <div className="col-span-4 md:col-span-3">Usuário</div>
            <div className="hidden md:block col-span-2">Data</div>
            <div className="col-span-3 md:col-span-3 text-right">Valor</div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
            {filteredRecords.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-50">
                <Filter className="w-10 h-10 mb-4" />
                <p className="text-sm font-bold">Nenhum registro encontrado</p>
              </div>
            ) : (
              filteredRecords.map(r => (
                <div key={r.id} className="grid grid-cols-12 gap-4 p-3 items-center rounded-2xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                  <div className="col-span-5 md:col-span-4 flex items-center gap-3">
                    {getRecordIcon(r.type)}
                    <div>
                      <p className="text-xs font-bold leading-none mb-1 group-hover:text-primary transition-colors">{r.description}</p>
                      {getStatusBadge(r.status)}
                    </div>
                  </div>
                  <div className="col-span-4 md:col-span-3">
                    <p className="text-xs text-muted-foreground font-semibold">{r.user || 'Sistema'}</p>
                  </div>
                  <div className="hidden md:block col-span-2">
                    <p className="text-[10px] text-muted-foreground font-semibold">{new Date(r.date).toLocaleDateString()}</p>
                  </div>
                  <div className="col-span-3 md:col-span-3 text-right">
                    <p className={`text-sm font-black ${r.type === 'income' ? 'text-green-500' : r.type === 'payout' ? 'text-foreground' : 'text-cyan-400'}`}>
                      {r.type === 'income' ? '+' : '-'}{formatCurrency(r.amount)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminFinancePage;
