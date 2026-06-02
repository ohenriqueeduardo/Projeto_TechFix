import React from 'react';
import { getLocalOrders } from '@/utils/localDb';
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
  Sparkles
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { Link } from 'react-router-dom';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { Order } from '@/types';

const MyOrdersPage = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'all' | 'active' | 'past'>('all');
  
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');
  const isProfessional = currentUser?.role === 'professional';

  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/orders?clientId=${currentUser.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
          setOrders(getLocalOrders().filter(o => o.clientId === currentUser.id));
        }
      } catch (error) {
        setOrders(getLocalOrders().filter(o => o.clientId === currentUser.id));
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pendente',
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
                    <Link to={`/cliente/chat/${order.professionalId}`} className="flex-1 sm:flex-none">
                      <Button variant="outline" className="w-full rounded-xl border-white/10 text-xs h-10 px-4">Chat</Button>
                    </Link>
                    <Link to={`/cliente/pedido/${order.id}/status`}>
                      <Button variant="ghost" size="icon" className="hidden sm:flex rounded-xl hover:bg-primary hover:text-background w-10 h-10">
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
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