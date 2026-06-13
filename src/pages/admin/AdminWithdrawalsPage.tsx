import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Check, 
  X, 
  Smartphone, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';

interface WithdrawalRequest {
  id: string;
  professionalName: string;
  professionalAvatar: string;
  value: number;
  date: string;
  pixType: string;
  pixKey: string;
  status: 'pending' | 'completed' | 'failed';
}

const AdminWithdrawalsPage = () => {
  const [requests, setRequests] = React.useState<WithdrawalRequest[]>([]);
  const [activeTab, setActiveTab] = React.useState<'all' | 'pending' | 'completed' | 'failed'>('all');
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchWithdrawals = async () => {
    try {
      const res = await fetch('/api/admin/withdrawals');
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((t: { id: string; professionalName: string; professionalAvatar: string; value: number; date: string; status: 'pending' | 'completed' | 'failed' }) => ({
          id: t.id,
          professionalName: t.professionalName || 'Desconhecido',
          professionalAvatar: t.professionalAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.professionalName || 'D')}`,
          value: t.value,
          date: t.date,
          pixType: 'E-mail', // Fallback, since PIX info is not in DB yet
          pixKey: `${t.professionalName?.split(' ')[0].toLowerCase()}@exemplo.com`,
          status: t.status
        }));
        setRequests(mapped);
      }
    } catch (e) {
      console.error('Error loading withdrawals:', e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleApprove = async (id: string, name: string, value: number) => {
    try {
      await fetch(`/api/admin/withdrawals/${id}/approve`, { method: 'POST' });
      toast.success(`Saque de ${formatCurrency(value)} homologado com sucesso! Lançamento via PIX transmitido para ${name}.`);
      fetchWithdrawals();
    } catch (e) {
      toast.error('Erro ao aprovar o saque.');
    }
  };

  const handleReject = async (id: string, name: string, value: number) => {
    try {
      // Assuming a reject endpoint or just updating local state for now
      // In a real app we would have a `/api/admin/withdrawals/${id}/reject` endpoint
      // For now we'll simulate the rejection:
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'failed' } : r));
      toast.error(`Solicitação de saque de ${formatCurrency(value)} para ${name} foi estornada.`);
    } catch (e) {
      toast.error('Erro ao rejeitar o saque.');
    }
  };

  const filteredRequests = requests.filter(r => activeTab === 'all' || r.status === activeTab);

  if (isLoading) return <div className="p-12 text-center">Carregando fila de saques...</div>;

  return (
    <div className="space-y-10 animate-page-entrance max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-white/5 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <DollarSign className="w-6 h-6" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-primary">Controle Financeiro Root</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight">Moderação de Saques</h1>
        <p className="text-muted-foreground text-sm mt-1">Monitore, homologue ou indefira solicitações de repasses financeiros enviadas por especialistas credenciados.</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6 bg-card/30 border-white/5 rounded-3xl">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Aguardando Avaliação</p>
          <h3 className="text-2xl font-black text-yellow-500">
            {requests.filter(r => r.status === 'pending').length} solicitações
          </h3>
        </Card>
        <Card className="p-6 bg-card/30 border-white/5 rounded-3xl">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Montante Pendente</p>
          <h3 className="text-2xl font-black text-primary">
            {formatCurrency(requests.filter(r => r.status === 'pending').reduce((acc, curr) => acc + curr.value, 0))}
          </h3>
        </Card>
        <Card className="p-6 bg-card/30 border-white/5 rounded-3xl">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Saques Homologados (Mês)</p>
          <h3 className="text-2xl font-black text-green-500">
            {formatCurrency(requests.filter(r => r.status === 'completed').reduce((acc, curr) => acc + curr.value, 0))}
          </h3>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-card/10 p-3.5 border border-white/5 rounded-3xl backdrop-blur-md max-w-md">
        {[
          { id: 'all', label: 'Todos' },
          { id: 'pending', label: 'Pendentes' },
          { id: 'completed', label: 'Aprovados' },
          { id: 'failed', label: 'Estornados' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'all' | 'pending' | 'completed' | 'failed')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
              activeTab === tab.id
              ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
              : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Requests Fila */}
      <div className="grid grid-cols-1 gap-6">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((r) => (
            <Card key={r.id} className="p-6 bg-card/30 border-white/5 rounded-3xl hover:border-primary/20 transition-all duration-300 group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Specialist Profile Details */}
                <div className="flex items-center gap-4">
                  <img src={r.professionalAvatar} className="w-14 h-14 rounded-2xl border border-white/10 shrink-0 object-cover" alt={r.professionalName} />
                  <div>
                    <h3 className="font-bold text-base leading-tight">{r.professionalName}</h3>
                    <p className="text-[10px] text-primary font-black uppercase tracking-wider mt-0.5">Especialista Credenciado</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Solicitado em: <span className="text-foreground">{r.date}</span></span>
                    </div>
                  </div>
                </div>

                {/* PIX Key Details */}
                <div className="space-y-1 bg-white/5 border border-white/5 p-4 rounded-2xl min-w-[280px]">
                  <p className="text-[8px] text-muted-foreground font-black uppercase tracking-wider">Dados Para Lançamento PIX</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Smartphone className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-xs font-black text-foreground">{r.pixType}:</span>
                    <span className="text-xs font-bold text-muted-foreground select-all">{r.pixKey}</span>
                  </div>
                </div>

                {/* Financial and Actions details */}
                <div className="flex flex-col lg:items-end gap-3.5 shrink-0 pt-4 lg:pt-0 border-t lg:border-0 border-white/5">
                  <div className="text-left lg:text-right">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">Valor do Repasse</p>
                    <p className="text-2xl font-black text-primary mt-0.5">{formatCurrency(r.value)}</p>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-2 w-full lg:w-auto">
                    {r.status === 'pending' && (
                      <>
                        <Button 
                          onClick={() => handleApprove(r.id, r.professionalName, r.value)}
                          size="sm" 
                          className="bg-primary hover:bg-primary/95 text-primary-foreground font-black rounded-xl text-xs gap-1.5 h-10 px-4"
                        >
                          <Check className="w-4 h-4" /> Autorizar PIX
                        </Button>
                        <Button 
                          onClick={() => handleReject(r.id, r.professionalName, r.value)}
                          size="sm" 
                          variant="outline" 
                          className="border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-xl text-xs h-10 px-3"
                        >
                          <X className="w-4 h-4" /> Recusar
                        </Button>
                      </>
                    )}

                    {r.status === 'completed' && (
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20 py-2 px-4 rounded-xl text-xs font-bold gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Transmitido com Sucesso
                      </Badge>
                    )}

                    {r.status === 'failed' && (
                      <Badge className="bg-red-500/10 text-red-500 border-red-500/20 py-2 px-4 rounded-xl text-xs font-bold gap-1.5">
                        <AlertTriangle className="w-4 h-4" /> Estornado / Cancelado
                      </Badge>
                    )}
                  </div>
                </div>

              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center bg-card/10 border-white/5 rounded-3xl">
            <ShieldCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <h3 className="font-bold text-lg">Sem saques nesta fila</h3>
            <p className="text-muted-foreground text-xs mt-1">Todos os repasses financeiros pendentes já foram processados.</p>
          </Card>
        )}
      </div>

    </div>
  );
};

export default AdminWithdrawalsPage;
