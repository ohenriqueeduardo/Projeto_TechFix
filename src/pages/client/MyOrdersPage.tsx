import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/PageHeader';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Search, 
  ClipboardList, 
  ShieldCheck, 
  Compass, 
  DollarSign, 
  Activity,
  Sparkles,
  Printer
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { Link } from 'react-router-dom';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Order } from '@/types';
import { toast } from 'sonner';

const MyOrdersPage = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'all' | 'active' | 'past'>('all');
  
  const currentUser = React.useMemo(() => JSON.parse(localStorage.getItem('user') || 'null'), []);
  const token = React.useMemo(() => localStorage.getItem('token'), []);
  const isProfessional = currentUser?.role === 'professional';

  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  const [negotiatingOrderId, setNegotiatingOrderId] = React.useState<string | null>(null);
  const [proposedPrice, setProposedPrice] = React.useState('');
  const [negotiationMessage, setNegotiationMessage] = React.useState('');

  React.useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders?clientId=${currentUser.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser, token]);

  const handleNegotiate = async (orderId: string) => {
    try {
      if (!proposedPrice || !negotiationMessage) {
        toast.error('Preencha o valor e a mensagem.');
        return;
      }
      const response = await fetch(`/api/orders/${orderId}/negotiate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ proposedPrice, message: negotiationMessage, actorType: 'client' })
      });

      if (!response.ok) throw new Error('Failed to negotiate');
      const updatedOrder = await response.json();
      setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
      setNegotiatingOrderId(null);
      setProposedPrice('');
      setNegotiationMessage('');
      toast.success('Contraproposta enviada ao especialista!');
    } catch (error) {
      toast.error('Erro ao enviar contraproposta.');
    }
  };

  const handleRejectOffer = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/reject-offer`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ actorType: 'client' })
      });

      if (!response.ok) throw new Error('Failed to reject');
      const updatedOrder = await response.json();
      setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
      toast.success('Serviço cancelado.');
    } catch (error) {
      toast.error('Erro ao cancelar.');
    }
  };

  const handleAcceptOffer = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/accept-offer`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to accept');
      const updatedOrder = await response.json();
      setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
      toast.success('Oferta aceita com sucesso!');
    } catch (error) {
      toast.error('Erro ao aceitar a oferta.');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'provisional': return <Clock className="w-4 h-4 text-orange-500" />;
      default: return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      provisional: 'Aguardando Pagamento',
      pending: 'Pendente',
      negotiating: 'Em Negociação',
      scheduled: 'Agendado',
      in_progress: 'Em Andamento',
      completed: 'Concluído',
      cancelled: 'Cancelado'
    };
    return labels[status] || status;
  };

  const clientOrders = orders;

  // Filter based on search term
  const searchedOrders = clientOrders.filter(order => 
    order.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.professionalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter based on tab selection
  const filteredOrders = searchedOrders.filter(order => {
    const isActive = order.status !== 'completed' && order.status !== 'cancelled';
    if (activeTab === 'active') return isActive;
    if (activeTab === 'past') return !isActive;
    return true;
  });

  // Calculate statistics
  const totalSpent = clientOrders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.price, 0);

  const activeCount = clientOrders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length;
  const completedCount = clientOrders.filter(o => o.status === 'completed').length;

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="h-10 w-10 rounded-full border-4 border-t-primary border-white/5 animate-spin"></span>
          <p className="text-muted-foreground text-sm font-bold">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-page-entrance">
      <PageHeader 
        title="Meus Pedidos" 
        description="Gerencie seus reparos, upgrades e manutenções contratadas na plataforma com segurança."
      >
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-center">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Buscar por código ou serviço..." 
              className="pl-10 bg-card/50 border-white/10 rounded-xl"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {!isProfessional && (
            <Link to="/cliente/novo-servico" className="w-full sm:w-auto shrink-0">
              <Button className="btn-primary h-11 px-5 rounded-xl gap-2 font-black w-full sm:w-auto text-xs">
                <Sparkles className="w-4 h-4" /> Solicitar Serviço Customizado
              </Button>
            </Link>
          )}
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Orders List (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex border-b border-foreground/5 pb-px gap-6">
            {[
              { id: 'all', label: 'Todos os Pedidos', count: clientOrders.length },
              { id: 'active', label: 'Em Andamento', count: activeCount },
              { id: 'past', label: 'Histórico / Concluídos', count: completedCount }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'all' | 'active' | 'past')}
                className={`pb-4 text-sm font-bold transition-all relative ${
                  activeTab === tab.id 
                  ? 'text-primary border-b-2 border-primary' 
                  : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
                <Badge className="ml-2 bg-foreground/5 text-foreground hover:bg-foreground/5 rounded-md text-[10px] font-black px-1.5 py-0.5">
                  {tab.count}
                </Badge>
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="p-6 bg-card/30 border-white/5 rounded-2xl hover:border-primary/20 transition-all group">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <ClipboardList className="text-primary w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{order.code}</span>
                      <Badge variant="outline" className="bg-primary/5 text-primary border-primary/15 text-[9px] uppercase font-black px-2 rounded-md">
                        {order.paymentMethod}
                      </Badge>
                    </div>
                    <Link to={`/cliente/pedido/${order.id}/status`}>
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors hover:underline">{order.serviceTitle}</h3>
                    </Link>
                    <p className="text-xs text-muted-foreground">Técnico: <span className="text-foreground font-medium">{order.professionalName}</span></p>
                  </div>

                  <div className="flex sm:flex-col justify-between sm:justify-start items-center sm:items-end gap-2 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-0 border-white/5">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                      {getStatusIcon(order.status)}
                      <span className="text-[11px] font-bold">{getStatusLabel(order.status)}</span>
                    </div>
                    <p className="text-base font-black text-primary">{formatCurrency(order.price)}</p>
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    {(order.status === 'scheduled' || order.status === 'in_progress' || order.status === 'completed') && (
                      <Button 
                        onClick={() => window.open(`/order/${order.id}/print`, '_blank')} 
                        variant="ghost" 
                        size="icon" 
                        title="Imprimir O.S."
                        className="hidden sm:flex rounded-xl hover:bg-primary/10 hover:text-primary w-10 h-10 border border-transparent hover:border-primary/20"
                      >
                        <Printer className="w-4 h-4" />
                      </Button>
                    )}
                    <Link to={`/cliente/pedido/${order.id}/status`}>
                      <Button variant="ghost" size="icon" className="hidden sm:flex rounded-xl hover:bg-primary hover:text-background w-10 h-10">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Negotiation UI for Client */}
                {order.status === 'negotiating' && order.lastNegotiator === 'professional' && (
                  <div className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-wider text-primary mb-1">Contraproposta do Técnico</p>
                    <p className="text-xl font-bold text-foreground mb-2">{formatCurrency(order.proposedPrice)}</p>
                    <p className="text-xs text-muted-foreground italic mb-4">"{order.negotiationMessage}"</p>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleAcceptOffer(order.id)}
                        size="sm" 
                        className="bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs gap-1.5 h-10 px-4"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Aceitar Oferta
                      </Button>
                      <Button 
                        onClick={() => setNegotiatingOrderId(order.id)}
                        size="sm" 
                        variant="outline" 
                        className="border-primary/20 text-primary hover:bg-primary/10 rounded-xl text-xs h-10 px-3"
                      >
                        Contraproposta
                      </Button>
                      <Button 
                        onClick={() => handleRejectOffer(order.id)}
                        size="sm" 
                        variant="outline" 
                        className="border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-xl text-xs h-10 px-3"
                      >
                        <XCircle className="w-4 h-4" /> Cancelar Pedido
                      </Button>
                    </div>
                  </div>
                )}

                {order.status === 'negotiating' && order.lastNegotiator === 'client' && (
                  <div className="mt-4 p-4 bg-card/50 border border-white/5 rounded-2xl text-right max-w-sm ml-auto">
                    <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-1">Sua Oferta</p>
                    <p className="text-xl font-bold text-foreground mb-2">{formatCurrency(order.proposedPrice)}</p>
                    <p className="text-xs text-muted-foreground italic mb-2">"{order.negotiationMessage}"</p>
                    <Badge className="bg-yellow-500/10 text-yellow-500">Aguardando Técnico...</Badge>
                  </div>
                )}

                {/* Inline Negotiation UI */}
                {negotiatingOrderId === order.id && (
                  <div className="mt-4 p-4 bg-black/20 border border-primary/20 rounded-2xl animate-in fade-in slide-in-from-top-4">
                    <h4 className="text-sm font-bold mb-4">Enviar Contraproposta</h4>
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Valor Proposto (R$)</label>
                        <input 
                          type="number"
                          value={proposedPrice}
                          onChange={(e) => setProposedPrice(e.target.value)}
                          className="w-full h-10 bg-black/40 border border-white/10 rounded-xl px-3 text-sm focus:border-primary/50 outline-none"
                          placeholder="Ex: 350.00"
                        />
                      </div>
                      <div className="flex-[2] space-y-2">
                        <label className="text-xs font-bold text-muted-foreground uppercase">Sua Mensagem</label>
                        <input 
                          type="text"
                          value={negotiationMessage}
                          onChange={(e) => setNegotiationMessage(e.target.value)}
                          className="w-full h-10 bg-black/40 border border-white/10 rounded-xl px-3 text-sm focus:border-primary/50 outline-none"
                          placeholder="Ex: Poxa, faz por R$300?"
                        />
                      </div>
                      <div className="flex items-end gap-2 mt-4 md:mt-0">
                        <Button onClick={() => setNegotiatingOrderId(null)} variant="outline" className="h-10 rounded-xl border-white/10">Cancelar</Button>
                        <Button onClick={() => handleNegotiate(order.id)} className="h-10 rounded-xl">Enviar Oferta</Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}

            {filteredOrders.length === 0 && (
              <div className="text-center py-16 glass-card rounded-3xl border-white/5 p-8">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                  <ClipboardList className="text-muted-foreground w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-1">Nenhum pedido nesta aba</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {searchTerm ? 'Nenhum pedido atende aos seus critérios de busca.' : 'Você não possui pedidos nesta categoria.'}
                </p>
                {!isProfessional && (
                  <Link to="/cliente/novo-servico">
                    <Button className="btn-primary px-6 h-12 rounded-xl text-sm gap-2 animate-pulse-glow">
                      <Compass className="w-4 h-4" /> Solicitar Serviço
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Complementary Info & Stats (1/3 width) */}
        <div className="space-y-6">
          {/* Quick Stats Widget */}
          <Card className="p-6 bg-card/30 border-white/5 rounded-3xl">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> Resumo de Atividades
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3.5 rounded-xl bg-white/5 border border-white/5">
                <span className="text-xs text-muted-foreground font-medium">Total Investido</span>
                <span className="text-sm font-black text-primary">R$ <AnimatedCounter value={totalSpent} /></span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">Ativos</p>
                  <p className="text-lg font-black text-blue-500"><AnimatedCounter value={activeCount} /></p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase font-black mb-1">Concluídos</p>
                  <p className="text-lg font-black text-green-500"><AnimatedCounter value={completedCount} /></p>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick CTA banner */}
          <Card className="p-6 bg-gradient-to-br from-primary/10 via-blue-500/5 to-transparent border-primary/20 rounded-3xl relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
            <h3 className="text-lg font-black mb-2 leading-tight">Precisa de outra solução tecnológica?</h3>
            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
              Conserte seu notebook, monte seu PC Gamer dos sonhos ou configure sua rede corporativa com nossos técnicos experientes.
            </p>
            {!isProfessional && (
              <Link to="/cliente/novo-servico">
                <Button className="btn-primary w-full h-12 rounded-xl text-xs gap-2">
                  <Compass className="w-4 h-4" /> Solicitar Novo Serviço
                </Button>
              </Link>
            )}
          </Card>

          {/* Platform Security advice */}
          <Card className="p-6 bg-card/30 border-white/5 rounded-3xl border-dashed">
            <div className="flex gap-4">
              <ShieldCheck className="w-8 h-8 text-primary shrink-0" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-foreground mb-1">Garantia TechFix</h4>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Todos os serviços agendados e pagos diretamente pela nossa plataforma contam com nossa **Garantia de 90 dias** e suporte total contra imprevistos.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;