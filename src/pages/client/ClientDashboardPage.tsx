import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, Star, Laptop, ArrowRight, Plus, MessageSquare, Shield, FolderOpen, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { toast } from 'sonner';

import { getLocalOrders, getLocalServices } from '@/utils/localDb';
import { calculateUserLevelInfo } from '@/utils/levels';
import { User, Order, Service } from '@/types';

const ClientDashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<User | null>(null);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [services, setServices] = React.useState<Service[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const levelInfo = user ? calculateUserLevelInfo(user.id) : { level: 'Silver' };

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Fetch dynamic data for the authenticated client from the PostgreSQL backend
      const fetchData = async () => {
        try {
          // 1. Fetch Client Orders
          const ordersResponse = await fetch(`http://localhost:3000/api/orders?clientId=${parsedUser.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (ordersResponse.ok) {
            const ordersData = await ordersResponse.json();
            setOrders(ordersData);
          } else {
            // Load local database on non-ok response
            setOrders(getLocalOrders().filter(o => o.clientId === parsedUser.id));
          }

          // 2. Fetch Public Services for Recommendations
          const servicesResponse = await fetch('http://localhost:3000/api/services');
          if (servicesResponse.ok) {
            const servicesData = await servicesResponse.json();
            setServices(servicesData.slice(0, 2)); // Show top 2 recommended services
          } else {
            setServices(getLocalServices().slice(0, 2));
          }
        } catch (error) {
          console.warn('Error loading dashboard data from backend, loading locally:', error);
          setOrders(getLocalOrders().filter(o => o.clientId === parsedUser.id));
          setServices(getLocalServices().slice(0, 2));
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const activeOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');
  const completedOrders = orders.filter(o => o.status === 'completed');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': 
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">Pendente</Badge>;
      case 'scheduled': 
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">Agendado</Badge>;
      case 'in_progress': 
        return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase">Em Andamento</Badge>;
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

  const stats = [
    { 
      label: 'Pedidos Ativos', 
      value: activeOrders.length, 
      icon: Clock, 
      color: 'text-blue-500', 
      bg: 'bg-blue-500/10',
      isText: false,
      renderExpanded: () => (
        <div className="mt-6 pt-6 border-t border-white/5 space-y-4 text-left">
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.25em]">Pedidos Ativos</span>
          <h4 className="text-lg font-black tracking-tight flex items-center gap-2">
            Chamados Abertos
            <Clock className="w-4 h-4 text-blue-500 shrink-0 animate-pulse" />
          </h4>
          <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
            {activeOrders.length === 0 ? (
              <div className="p-4 text-center bg-white/5 border border-dashed border-white/10 rounded-2xl text-muted-foreground text-[10px] font-bold">
                Você não possui chamados ativos no momento.
              </div>
            ) : (
              activeOrders.map(order => (
                <div key={order.id} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/35 transition-all space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-mono font-bold text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded uppercase">
                      {order.code}
                    </span>
                    {getStatusBadge(order.status)}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs text-foreground truncate">{order.serviceTitle}</h5>
                    <p className="text-[9px] text-muted-foreground mt-0.5">Técnico: <strong className="text-foreground">{order.professionalName}</strong></p>
                  </div>
                  <div className="pt-1.5 border-t border-white/5 flex justify-between items-center text-[9px] text-muted-foreground">
                    <span>{order.date} às {order.time}</span>
                    <span className="font-black text-foreground">{formatCurrency(order.price)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
          <Button 
            onClick={() => navigate('/cliente/meus-pedidos')}
            className="btn-action w-full btn-primary h-10 text-xs font-black flex items-center justify-center gap-2 mt-2"
          >
            Gerenciar Todos os Pedidos <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )
    },
    ...(user?.role !== 'professional' ? [{ 
      label: 'Solicitar Serviço', 
      value: 'Criar', 
      icon: Plus, 
      color: 'text-green-500', 
      bg: 'bg-green-500/10',
      isText: true,
      renderExpanded: () => (
        <div className="mt-6 pt-6 border-t border-white/5 space-y-4 text-left">
          <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.25em]">Ação Rápida</span>
          <h4 className="text-lg font-black tracking-tight flex items-center gap-2">
            Solicitar Suporte
            <Plus className="w-4 h-4 text-green-500 shrink-0" />
          </h4>
          <p className="text-[11px] text-muted-foreground leading-relaxed font-medium">
            Precisa de um reparo personalizado, upgrade de hardware ou formatação? Crie uma solicitação personalizada agora.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground bg-white/5 p-2 rounded-xl border border-white/5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
              <span className="truncate">Orçamentos rápidos com técnicos</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground bg-white/5 p-2 rounded-xl border border-white/5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0" />
              <span className="truncate">Atendimento residencial ou remoto</span>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/cliente/novo-servico')}
            className="btn-action w-full btn-primary h-10 text-xs font-black flex items-center justify-center gap-2 mt-2"
          >
            Solicitar Novo Serviço <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )
    }] : []),
    { 
      label: 'Nível de Cliente', 
      value: levelInfo.level, 
      icon: Shield, 
      color: 'text-primary', 
      bg: 'bg-primary/10', 
      isText: true,
      renderExpanded: () => (
        <div className="mt-6 pt-6 border-t border-white/5 space-y-4 text-left">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Progresso de Conta</span>
          <h4 className="text-lg font-black tracking-tight flex items-center gap-2">
            <Badge variant="outline" className="border-primary/20 text-primary hover:bg-primary hover:text-white cursor-pointer transition-colors shadow-sm" onClick={() => navigate('/cliente/niveis')}>
              Nível {levelInfo.level}
            </Badge>
            <Shield className="w-4 h-4 text-primary shrink-0 animate-pulse" />
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-muted-foreground">Progresso para Gold</span>
              <span className="text-primary">60%</span>
            </div>
            <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden border border-foreground/5 relative">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] rounded-full transition-all duration-1000"
                style={{ width: '60%' }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
              Faltam apenas **2 chamados** para o nível **Gold** e liberar mais benefícios!
            </p>
          </div>
          <Button 
            onClick={() => navigate('/cliente/niveis')}
            className="btn-action w-full btn-primary h-10 text-xs font-black flex items-center justify-center gap-2 mt-2"
          >
            Acessar Níveis <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )
    },
    { 
      label: 'Acessar Meu Perfil', 
      value: user?.name ? user.name.split(' ')[0] : 'Sofia', 
      icon: Star, 
      color: 'text-yellow-500', 
      bg: 'bg-yellow-500/10', 
      isText: true,
      renderExpanded: () => (
        <div className="mt-6 pt-6 border-t border-white/5 space-y-4 text-left">
          <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.25em]">Minha Conta</span>
          <h4 className="text-lg font-black tracking-tight flex items-center gap-2">
            Meu Perfil
            <Star className="w-4 h-4 text-yellow-500 shrink-0 fill-yellow-500 animate-pulse" />
          </h4>
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
            <img 
              src={user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user?.name || 'Sofia')}`} 
              className="w-10 h-10 rounded-xl object-cover border border-yellow-500/20 shadow-md shrink-0" 
              alt="" 
            />
            <div className="min-w-0 flex-1">
              <h5 className="font-bold text-xs text-foreground truncate">{user?.name || 'Sofia Spencer'}</h5>
              <p className="text-[9px] text-muted-foreground truncate">{user?.email || 'sofia@example.com'}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-[9px] text-muted-foreground bg-white/5 p-2.5 rounded-xl border border-white/5">
            <span>Nível: <strong className="text-foreground uppercase">{levelInfo.level}</strong></span>
            <span>Status: <strong className="text-green-500 uppercase">Ativa</strong></span>
          </div>
          <Button 
            onClick={() => navigate('/cliente/perfil')}
            className="btn-action w-full btn-primary h-10 text-xs font-black flex items-center justify-center gap-2 mt-2"
          >
            Acessar Meu Perfil <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-10 animate-page-entrance">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Olá, {user?.name || 'Cliente'}! 👋</h1>
          <p className="text-muted-foreground text-lg">Seu setup está em boas mãos hoje.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to={orders.length > 0 ? `/cliente/chat/${orders[0].professionalId}` : '#'}>
            <Button variant="outline" className="rounded-2xl h-14 px-6 border-white/10 gap-2" disabled={orders.length === 0}>
              <MessageSquare className="w-5 h-5 text-primary" /> Chat
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {stats.map((stat, i) => (
          <Card 
            key={i} 
            className="p-8 bg-card/30 border-white/5 rounded-3xl hover:border-primary/30 hover:bg-card/45 hover:scale-[1.01] transition-all duration-300 relative overflow-hidden select-none min-h-[410px] flex flex-col justify-between shadow-lg h-full"
          >
            {/* Glow backdrop effect on hover */}
            <div className={`absolute -right-10 -bottom-10 w-24 h-24 rounded-full blur-2xl opacity-0 hover:opacity-20 transition-opacity ${stat.color === 'text-primary' ? 'bg-primary' : stat.color === 'text-blue-500' ? 'bg-blue-500' : stat.color === 'text-green-500' ? 'bg-green-500' : 'bg-yellow-500'}`} />
            
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">{stat.label}</p>
                <h3 className="text-3xl font-black">
                  {stat.isText ? stat.value : <AnimatedCounter value={stat.value as number} />}
                </h3>
              </div>
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>

            {/* Fixed / Permanent Details space */}
            <div className="relative z-10 mt-auto">
              {stat.renderExpanded()}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientDashboardPage;