import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, Star, Laptop, ArrowRight, Plus, MessageSquare, Shield } from 'lucide-react';
import { orders, services } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';

const ClientDashboardPage = () => {
  const activeOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight">Olá, Sofia! 👋</h1>
          <p className="text-muted-foreground text-lg">Seu setup está em boas mãos hoje.</p>
        </div>
        <div className="flex gap-3">
          <Link to="/cliente/chat/p1">
            <Button variant="outline" className="rounded-2xl h-14 px-6 border-white/10 gap-2">
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
          { label: 'Concluídos', value: 12, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'Avaliações', value: 8, icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
          { label: 'Nível Atual', value: 'Prata', icon: Shield, color: 'text-primary', bg: 'bg-primary/10' },
        ].map((stat, i) => (
          <Card key={i} className="p-8 bg-card/30 border-white/5 rounded-[2rem] hover:border-primary/20 transition-all group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-2">{stat.label}</p>
                <h3 className="text-3xl font-black">{stat.value}</h3>
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
            {orders.map(order => (
              <div key={order.id} className="glass-card p-6 rounded-[2rem] flex flex-col sm:flex-row items-center gap-6 hover:border-primary/30 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:rotate-6 transition-transform">
                  <Laptop className="text-primary w-8 h-8" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{order.code}</p>
                  <h4 className="text-xl font-bold group-hover:text-primary transition-colors">{order.serviceTitle}</h4>
                  <p className="text-sm text-muted-foreground">Técnico: <span className="text-foreground font-medium">{order.professionalName}</span></p>
                </div>
                <div className="text-center sm:text-right">
                  <Badge variant="outline" className="mb-3 bg-primary/5 text-primary border-primary/20 px-4 py-1 rounded-full text-[10px] font-black uppercase">
                    {order.status === 'scheduled' ? 'Agendado' : order.status}
                  </Badge>
                  <p className="text-xl font-black">{formatCurrency(order.price)}</p>
                </div>
                <Link to={`/cliente/meus-pedidos`}>
                  <Button variant="ghost" size="icon" className="hidden sm:flex rounded-xl hover:bg-primary hover:text-background">
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Services */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Recomendados</h2>
          <div className="space-y-6">
            {services.slice(0, 2).map(service => (
              <Link key={service.id} to={`/cliente/servico/${service.id}`} className="block group">
                <div className="relative rounded-[2.5rem] overflow-hidden h-48 mb-4 shadow-xl">
                  <img src={service.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">{service.category}</p>
                    <h4 className="font-bold text-xl leading-tight">{service.title}</h4>
                  </div>
                  <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-yellow-500 text-xs font-black">
                    <Star className="w-3.5 h-3.5 fill-current" /> {service.rating}
                  </div>
                </div>
              </Link>
            ))}
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