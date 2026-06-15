import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, Plus, Shield, Search, ArrowRight, User as UserIcon } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { calculateUserLevelInfo } from '@/utils/levels';
import { User, Order, Service } from '@/types';

const ClientDashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<User | null>(null);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const levelInfo = user ? calculateUserLevelInfo(user.id, orders) : { level: 'Bronze', progressPercent: 0, nextLevel: 'Silver', remainingToNext: 2, completedCount: 0 } as ReturnType<typeof calculateUserLevelInfo>;

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      const fetchData = async () => {
        try {
          const ordersResponse = await fetch(`/api/orders?clientId=${parsedUser.id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (ordersResponse.ok) {
            const ordersData = await ordersResponse.json();
            setOrders(ordersData);
          }
        } catch (error) {
          console.warn('Error loading dashboard data from backend:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const activeOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').slice(0, 3);
  const completedOrdersCount = orders.filter(o => o.status === 'completed').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': 
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">Pendente</Badge>;
      case 'scheduled': 
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">Agendado</Badge>;
      case 'in_progress': 
        return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">Em Andamento</Badge>;
      case 'counter_offer':
      case 'negotiating':
        return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">Negociando</Badge>;
      case 'completed': 
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">Concluído</Badge>;
      default: 
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">Cancelado</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="h-10 w-10 rounded-full border-4 border-t-primary border-white/5 animate-spin"></span>
          <p className="text-muted-foreground text-sm font-bold">Carregando seu setup...</p>
        </div>
      </div>
    );
  }

  const userAvatar = user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user?.name || 'User')}`;

  return (
    <div className="flex flex-col lg:h-[calc(100vh-130px)] gap-6 animate-page-entrance max-w-7xl mx-auto pb-10 lg:pb-0">
      
      {/* Hero Section */}
      <div className="shrink-0 relative overflow-hidden rounded-3xl p-8 md:p-10 border border-white/10 glass-card bg-gradient-to-br from-card/40 to-background">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              <img src={userAvatar} alt="Avatar" className="w-20 h-20 md:w-24 md:h-24 rounded-2xl border-2 border-primary/30 shadow-lg object-cover" />
              <div className="absolute -bottom-2 -right-2 p-1.5 bg-background rounded-full">
                <div className="bg-primary/20 p-1.5 rounded-full">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm font-black tracking-widest text-primary uppercase mb-1">Nível {levelInfo.level}</p>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">Olá, {user?.name?.split(' ')[0] || 'Cliente'}! 👋</h1>
              <p className="text-muted-foreground text-sm mt-1 max-w-md">Gerencie seus chamados e aproveite os benefícios da sua conta TechFix.</p>
            </div>
          </div>
          
          {/* Level Progress */}
          <div className="w-full md:w-80 bg-background/50 p-5 rounded-2xl border border-white/5 backdrop-blur-md">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-muted-foreground">Progresso para {levelInfo.nextLevel || 'Max'}</span>
              <span className="text-xs font-black text-primary">{Math.round(levelInfo.progressPercent)}%</span>
            </div>
            <div className="h-2.5 w-full bg-foreground/5 rounded-full overflow-hidden border border-foreground/5 mb-3">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] rounded-full transition-all duration-1000"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            {levelInfo.nextLevel ? (
              <p className="text-[10px] text-muted-foreground">
                Faltam <strong className="text-foreground">{levelInfo.remainingToNext} chamados</strong> para desbloquear os benefícios de {levelInfo.nextLevel}.
              </p>
            ) : (
              <p className="text-[10px] text-primary font-bold">Nível Máximo Alcançado!</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="shrink-0 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button onClick={() => navigate('/cliente/novo-servico')} className="h-auto py-6 flex flex-col items-center justify-center gap-3 rounded-2xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-all hover:scale-[1.02]">
          <div className="bg-primary/20 p-3 rounded-full">
            <Plus className="w-6 h-6" />
          </div>
          <div className="text-center">
            <span className="block font-black text-sm">Solicitar Novo Serviço</span>
            <span className="text-[10px] opacity-80 mt-1">Criar um pedido personalizado</span>
          </div>
        </Button>
        
        <Button onClick={() => navigate('/cliente/servicos')} variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-3 rounded-2xl bg-card/30 hover:bg-card/50 border-white/10 transition-all hover:scale-[1.02]">
          <div className="bg-foreground/5 p-3 rounded-full">
            <Search className="w-6 h-6 text-foreground" />
          </div>
          <div className="text-center">
            <span className="block font-black text-sm text-foreground">Explorar Serviços</span>
            <span className="text-[10px] text-muted-foreground mt-1">Navegar por categorias</span>
          </div>
        </Button>

        <Button onClick={() => navigate('/cliente/configuracoes')} variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-3 rounded-2xl bg-card/30 hover:bg-card/50 border-white/10 transition-all hover:scale-[1.02]">
          <div className="bg-foreground/5 p-3 rounded-full">
            <UserIcon className="w-6 h-6 text-foreground" />
          </div>
          <div className="text-center">
            <span className="block font-black text-sm text-foreground">Gerenciar Perfil</span>
            <span className="text-[10px] text-muted-foreground mt-1">Endereços e pagamentos</span>
          </div>
        </Button>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Orders List */}
        <div className="lg:col-span-2 flex flex-col min-h-0 space-y-4">
          <div className="shrink-0 flex items-center justify-between px-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Chamados Ativos
            </h2>
            {orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length > 3 && (
              <Button variant="link" onClick={() => navigate('/cliente/meus-pedidos')} className="text-xs text-primary font-bold pr-0">
                Ver Todos <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
            {activeOrders.length === 0 ? (
              <Card className="p-8 text-center bg-card/30 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 rounded-3xl min-h-[250px]">
                <div className="bg-white/5 p-4 rounded-full">
                  <Clock className="w-8 h-8 text-muted-foreground opacity-50" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Nenhum chamado ativo</h3>
                  <p className="text-xs text-muted-foreground max-w-[250px] mx-auto">Você não possui pedidos em andamento no momento.</p>
                </div>
                <Button onClick={() => navigate('/cliente/novo-servico')} className="btn-primary mt-2 h-10 px-6 rounded-xl text-xs">
                  Solicitar Agora
                </Button>
              </Card>
            ) : (
              activeOrders.map(order => (
                <Card key={order.id} className="p-5 bg-card/40 border-white/5 hover:border-primary/30 transition-all rounded-3xl flex flex-col sm:flex-row gap-5 items-start sm:items-center group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded-md uppercase">
                        {order.code}
                      </span>
                      {getStatusBadge(order.status)}
                    </div>
                    <h4 className="font-bold text-base truncate pr-4">{order.serviceTitle}</h4>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                      <UserIcon className="w-3.5 h-3.5" /> Técnico: <span className="text-foreground font-medium">{order.professionalName}</span>
                    </p>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-white/5 sm:border-0 shrink-0">
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-muted-foreground">{order.date} • {order.time}</p>
                      <p className="font-black text-lg text-foreground mt-0.5">{formatCurrency(order.price)}</p>
                    </div>
                    <Button onClick={() => navigate(`/status/${order.id}`)} variant="outline" className="h-9 px-4 rounded-xl border-primary/20 text-primary hover:bg-primary hover:text-white transition-all text-xs font-bold w-full sm:w-auto">
                      Detalhes
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Side Panel: Account Summary */}
        <div className="flex flex-col min-h-0 space-y-4">
          <h2 className="shrink-0 text-xl font-bold flex items-center gap-2 px-2">
            <Star className="w-5 h-5 text-yellow-500" /> Resumo da Conta
          </h2>
          
          <Card className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-card/30 border-white/5 rounded-3xl space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-background/50 p-4 rounded-2xl border border-white/5 text-center">
                <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1">Concluídos</span>
                <span className="text-2xl font-black text-green-500">{completedOrdersCount}</span>
              </div>
              <div className="bg-background/50 p-4 rounded-2xl border border-white/5 text-center">
                <span className="block text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1">Membro Desde</span>
                <span className="text-sm font-bold text-foreground mt-2 block">2026</span>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/5">
              <h4 className="text-sm font-bold flex items-center gap-2"><Shield className="w-4 h-4 text-primary"/> Benefícios do Nível</h4>
              <ul className="space-y-2 text-xs text-muted-foreground font-medium">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Suporte Prioritário
                </li>
                {levelInfo.level === 'Silver' || levelInfo.level === 'Gold' ? (
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Descontos em Taxas
                  </li>
                ) : (
                  <li className="flex items-center gap-2 opacity-50">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" /> Descontos em Taxas (Requer Silver)
                  </li>
                )}
                {levelInfo.level === 'Gold' ? (
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Garantia Estendida
                  </li>
                ) : (
                  <li className="flex items-center gap-2 opacity-50">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" /> Garantia Estendida (Requer Gold)
                  </li>
                )}
              </ul>
            </div>
            
            <Button onClick={() => navigate('/cliente/niveis')} variant="ghost" className="w-full text-xs font-bold text-primary hover:bg-primary/10">
              Ver Todos os Níveis <ArrowRight className="w-3 h-3 ml-2" />
            </Button>
          </Card>
        </div>
      </div>

    </div>
  );
};

export default ClientDashboardPage;