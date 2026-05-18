import React from 'react';
import { orders } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Clock, CheckCircle2, XCircle, ChevronRight, Search, ClipboardList } from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Input } from '@/components/ui/input';

const MyOrdersPage = () => {
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

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Meus Pedidos</h1>
          <p className="text-muted-foreground">Acompanhe o status de todos os seus serviços contratados.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input placeholder="Buscar por código..." className="pl-10 bg-card/50 border-white/10 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <Card key={order.id} className="p-6 bg-card/30 border-white/5 rounded-2xl hover:border-primary/20 transition-all group">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Clock className="text-primary w-8 h-8" />
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{order.code}</span>
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 text-[10px] uppercase font-black">
                    {order.paymentMethod}
                  </Badge>
                </div>
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{order.serviceTitle}</h3>
                <p className="text-sm text-muted-foreground">Técnico: <span className="text-foreground font-medium">{order.professionalName}</span></p>
              </div>

              <div className="flex flex-row lg:flex-col items-center lg:items-end gap-4 lg:gap-1 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-0 border-white/5">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5">
                  {getStatusIcon(order.status)}
                  <span className="text-xs font-bold">{getStatusLabel(order.status)}</span>
                </div>
                <p className="text-lg font-black text-primary ml-auto lg:ml-0">{formatCurrency(order.price)}</p>
              </div>

              <div className="flex gap-2 w-full lg:w-auto">
                <Button variant="outline" className="flex-1 lg:flex-none rounded-xl border-white/10">Detalhes</Button>
                <Button variant="ghost" size="icon" className="hidden lg:flex rounded-xl hover:bg-primary hover:text-background">
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-20 glass-card rounded-[3rem]">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <ClipboardList className="text-muted-foreground w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Nenhum pedido encontrado</h3>
          <p className="text-muted-foreground mb-8">Você ainda não realizou nenhuma contratação.</p>
          <Button className="btn-primary px-8 h-12">Explorar Serviços</Button>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;