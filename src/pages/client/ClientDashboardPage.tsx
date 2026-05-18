import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, Star, Laptop, ArrowRight, Plus } from 'lucide-react';
import { orders, services } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';

const ClientDashboardPage = () => {
  const activeOrders = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Olá, Sofia! 👋</h1>
          <p className="text-muted-foreground">Bem-vinda de volta ao seu painel de controle.</p>
        </div>
        <Link to="/cliente/servicos">
          <Button className="btn-primary gap-2">
            <Plus className="w-4 h-4" /> Novo Pedido
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Pedidos Ativos', value: activeOrders.length, icon: Clock, color: 'text-blue-500' },
          { label: 'Concluídos', value: 12, icon: CheckCircle2, color: 'text-green-500' },
          { label: 'Avaliações', value: 8, icon: Star, color: 'text-yellow-500' },
          { label: 'Equipamentos', value: 2, icon: Laptop, color: 'text-purple-500' },
        ].map((stat, i) => (
          <Card key={i} className="p-6 bg-card/30 border-white/5 rounded-2xl">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Pedidos Recentes</h2>
            <Link to="/cliente/meus-pedidos" className="text-sm text-primary hover:underline">Ver todos</Link>
          </div>
          
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4 hover:border-white/10 transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Clock className="text-primary w-6 h-6" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-xs text-muted-foreground mb-1">{order.code}</p>
                  <h4 className="font-bold">{order.serviceTitle}</h4>
                  <p className="text-xs text-muted-foreground">Técnico: {order.professionalName}</p>
                </div>
                <div className="text-center sm:text-right">
                  <Badge variant="outline" className="mb-2 bg-blue-500/10 text-blue-500 border-blue-500/20">
                    {order.status === 'scheduled' ? 'Agendado' : order.status}
                  </Badge>
                  <p className="text-sm font-bold">{formatCurrency(order.price)}</p>
                </div>
                <Button variant="ghost" size="icon" className="hidden sm:flex">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Services */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Recomendados</h2>
          <div className="space-y-4">
            {services.slice(0, 2).map(service => (
              <Link key={service.id} to={`/cliente/servico/${service.id}`} className="block group">
                <div className="relative rounded-2xl overflow-hidden h-32 mb-2">
                  <img src={service.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="" />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-xs font-bold text-primary uppercase">{service.category}</p>
                    <h4 className="font-bold text-sm">{service.title}</h4>
                  </div>
                </div>
              </Link>
            ))}
            <Button variant="outline" className="w-full rounded-xl border-white/10">Explorar mais serviços</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardPage;