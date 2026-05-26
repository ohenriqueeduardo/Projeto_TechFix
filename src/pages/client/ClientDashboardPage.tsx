import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, Star, Laptop, ArrowRight, Plus, MessageSquare, Shield, FolderOpen } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';
import { toast } from 'sonner';

const ClientDashboardPage = () => {
  const [user, setUser] = React.useState<any>(null);
  const [orders, setOrders] = React.useState<any[]>([]);
  const [services, setServices] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

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
          }

          // 2. Fetch Public Services for Recommendations
          const servicesResponse = await fetch('http://localhost:3000/api/services');
          if (servicesResponse.ok) {
            const servicesData = await servicesResponse.json();
            setServices(servicesData.slice(0, 2)); // Show top 2 recommended services
          }
        } catch (error) {
          console.error('Error loading dashboard data:', error);
          toast.error('Não foi possível atualizar alguns dados em tempo real.');
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

  return (
    <div className="space-y-10 animate-page-entrance">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Olá, {user?.name || 'Cliente'}! 👋</h1>
          <p className="text-muted-foreground text-lg">Seu setup está em boas mãos hoje.</p>
        </div>
        <div className="flex gap-3">
          <Link to={orders.length > 0 ? `/cliente/chat/${orders[0].professionalId}` : '#'}>
            <Button variant="outline" className="rounded-2xl h-14 px-6 border-white/10 gap-2" disabled={orders.length === 0}>
              <MessageSquare className="w-5 h-5 text-primary" /> Chat
            </Button>
          </Link>
          <Link to="/cliente/servicos">
            <Button className="btn-primary h-14 px-8 rounded-2xl gap-2 text-lg">
              <Plus className="w-5 h-5" /> Novo Pedido
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Pedidos Ativos', value: activeOrders.length, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Concluídos', value: completedOrders.length, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Nível Atual', value: user?.level || 'Bronze', icon: Shield, color: 'text-primary', bg: 'bg-primary/10', isText: true },
          { label: 'Status da Conta', value: user?.status === 'active' ? 'Ativa' : 'Inativa', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10', isText: true },
        ].map((stat, i) => (
          <Card key={i} className="p-8 bg-card/30 border-white/5 rounded-3xl hover:border-primary/20 transition-all group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">{stat.label}</p>
                <h3 className="text-3xl font-black">
                  {stat.isText ? stat.value : <AnimatedCounter value={stat.value as number} />}
                </h3>
              </div>
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Recent Orders */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Pedidos Recentes</h2>
            <Link to="/cliente/meus-pedidos" className="text-sm font-black text-primary hover:underline uppercase tracking-widest">Ver todos</Link>
          </div>
          
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="glass-card p-12 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4">
                <FolderOpen className="w-12 h-12 text-muted-foreground" />
                <div>
                  <h4 className="text-lg font-bold">Nenhum pedido encontrado</h4>
                  <p className="text-xs text-muted-foreground max-w-xs mt-1">
                    Você ainda não fez nenhuma solicitação. Clique em Novo Pedido para explorar serviços e contratar especialistas!
                  </p>
                </div>
                <Link to="/cliente/servicos">
                  <Button className="btn-primary h-11 px-6 rounded-xl font-bold text-xs gap-1.5 mt-2">
                    <Plus className="w-4 h-4" /> Solicitar Serviço
                  </Button>
                </Link>
              </div>
            ) : (
              orders.slice(0, 3).map(order => (
                <div key={order.id} className="glass-card p-6 rounded-3xl flex flex-col sm:flex-row items-center gap-6 hover:border-primary/30 transition-all group">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform">
                    <Laptop className="text-primary w-8 h-8" />
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{order.code}</p>
                    <h4 className="text-xl font-bold group-hover:text-primary transition-colors">{order.serviceTitle}</h4>
                    <p className="text-sm text-muted-foreground">Status do chamado: <span className="text-foreground font-medium uppercase text-xs">{order.status}</span></p>
                  </div>
                  <div className="text-center sm:text-right">
                    <div className="mb-3">
                      {getStatusBadge(order.status)}
                    </div>
                    <p className="text-xl font-black">{formatCurrency(order.price)}</p>
                  </div>
                  <Link to={`/cliente/meus-pedidos`}>
                    <Button variant="ghost" size="icon" className="hidden sm:flex rounded-xl hover:bg-primary hover:text-background">
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recommended Services */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Recomendados</h2>
          <div className="space-y-6">
            {services.length === 0 ? (
              <div className="p-6 rounded-3xl bg-card/20 border border-white/5 text-center text-xs text-muted-foreground leading-relaxed">
                Nenhum serviço em catálogo recomendado no momento.
              </div>
            ) : (
              services.map(service => (
                <Link key={service.id} to={`/cliente/servico/${service.id}`} className="block group">
                  <div className="relative rounded-3xl overflow-hidden h-48 mb-4 shadow-xl hover-card-service border border-white/5">
                    {service.image ? (
                      <img src={service.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    ) : (
                      <div className="w-full h-full bg-slate-950 flex items-center justify-center">
                        <Laptop className="w-12 h-12 text-primary" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-6">
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">{service.category}</p>
                      <h4 className="font-bold text-xl leading-tight">{service.title}</h4>
                    </div>
                    <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-yellow-500 text-xs font-black">
                      <Star className="w-3.5 h-3.5 fill-current" /> {service.rating || '0.0'}
                    </div>
                  </div>
                </Link>
              ))
            )}
            <Link to="/cliente/servicos">
              <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 font-bold hover:bg-primary hover:text-background transition-all">
                Explorar mais serviços
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardPage;