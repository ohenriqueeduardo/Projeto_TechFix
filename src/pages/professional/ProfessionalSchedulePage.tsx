import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { ptBR } from 'date-fns/locale';
import { format, isSameDay, parseISO } from 'date-fns';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  CreditCard,
  User,
  ShieldCheck
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { formatCurrency } from '@/utils/formatters';

interface Order {
  id: string;
  code: string;
  serviceTitle: string;
  date: string;
  time: string;
  status: string;
  price: number;
  address: string;
  paymentStatus?: string;
  customerName?: string;
}

const ProfessionalSchedulePage = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  
  // Modal de Detalhes
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
          const user = JSON.parse(storedUser);
          const res = await fetch(`/api/orders?professionalId=${user.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            // Filtrar apenas pedidos ativos/agendados/finalizados
            setOrders(data);
          }
        }
      } catch (error) {
        console.warn('Erro ao carregar agenda:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Normalização de datas para matching
  const parseOrderDate = (dateStr: string) => {
    // Caso seja dd/mm/yyyy
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
    // Caso seja ISO
    try {
      return parseISO(dateStr);
    } catch {
      return new Date();
    }
  };

  const getDayOrders = (targetDate: Date | undefined) => {
    if (!targetDate) return [];
    return orders.filter(o => {
      const orderDate = parseOrderDate(o.date);
      return isSameDay(orderDate, targetDate);
    });
  };

  const selectedDayOrders = getDayOrders(date);

  // Modificadores do calendário
  const bookedDays = orders.map(o => parseOrderDate(o.date));

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 px-2 uppercase">Pendente</Badge>;
      case 'counter_offer': return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 px-2 uppercase">Negociando</Badge>;
      case 'scheduled': return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-2 uppercase">Agendado</Badge>;
      case 'in_progress': return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 px-2 uppercase">Em Andamento</Badge>;
      case 'completed': return <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-2 uppercase">Concluído</Badge>;
      default: return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 px-2 uppercase">Cancelado</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-130px)] flex items-center justify-center">
        <span className="h-10 w-10 rounded-full border-4 border-t-primary border-white/5 animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:h-[calc(100vh-130px)] gap-6 animate-page-entrance p-4 md:p-8 max-w-7xl mx-auto overflow-y-auto lg:overflow-hidden pb-10 lg:pb-0">
      
      {/* Header */}
      <div className="shrink-0 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <CalendarDays className="w-5 h-5 text-primary" />
          <span className="text-[10px] font-black tracking-widest text-primary uppercase">Minha Agenda</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Planejamento e Serviços</h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie seus horários e visualize os detalhes dos serviços marcados.</p>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Coluna Esquerda: Calendário */}
        <Card className="p-4 bg-card/30 border-white/5 rounded-3xl flex flex-col justify-center items-center h-fit">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={ptBR}
            className="rounded-2xl"
            modifiers={{ booked: bookedDays }}
            modifiersStyles={{
              booked: { fontWeight: 'bold', borderBottom: '2px solid rgb(6, 182, 212)' }
            }}
          />
        </Card>

        {/* Coluna Direita: Compromissos do Dia */}
        <div className="lg:col-span-2 flex flex-col min-h-0">
          <div className="shrink-0 mb-4 px-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Compromissos para {date ? format(date, "dd 'de' MMMM", { locale: ptBR }) : 'hoje'}
            </h2>
            <p className="text-xs text-muted-foreground">{selectedDayOrders.length} serviço(s) agendado(s).</p>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
            {selectedDayOrders.length === 0 ? (
              <div className="glass-card p-10 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center h-48">
                <CalendarDays className="w-10 h-10 text-muted-foreground opacity-50 mb-3" />
                <h4 className="text-sm font-bold">Dia Livre</h4>
                <p className="text-xs text-muted-foreground mt-1">Nenhum serviço marcado para esta data.</p>
              </div>
            ) : (
              selectedDayOrders.map(order => (
                <Card 
                  key={order.id} 
                  className="p-5 bg-card/40 border-white/10 hover:border-primary/30 transition-all rounded-3xl cursor-pointer hover:scale-[1.01]"
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-black text-muted-foreground uppercase">{order.code}</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <h3 className="text-base font-bold text-foreground mb-1">{order.serviceTitle}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
                        <Clock className="w-3.5 h-3.5 text-primary" /> {order.time}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Valor</p>
                      <p className="text-xl font-black text-primary">{formatCurrency(order.price)}</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Modal de Detalhes do Pedido */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => { if (!open) setSelectedOrder(null); }}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-3xl border-white/10 glass-card">
          {selectedOrder && (
            <>
              <div className="bg-muted/30 p-6 border-b border-white/5 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none" />
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary/10 rounded-xl">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-black">{selectedOrder.serviceTitle}</DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                      Ordem: {selectedOrder.code}
                    </DialogDescription>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background/50 p-3 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Status</p>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  <div className="bg-background/50 p-3 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Horário</p>
                    <p className="text-sm font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-primary"/> {selectedOrder.time}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white/5 rounded-lg mt-0.5"><MapPin className="w-4 h-4 text-muted-foreground" /></div>
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Endereço do Serviço</p>
                      <p className="text-sm font-semibold text-foreground/90 mt-0.5">{selectedOrder.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white/5 rounded-lg mt-0.5"><User className="w-4 h-4 text-muted-foreground" /></div>
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Cliente</p>
                      <p className="text-sm font-semibold text-foreground/90 mt-0.5">{selectedOrder.customerName || 'Cliente Padrão'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white/5 rounded-lg mt-0.5"><CreditCard className="w-4 h-4 text-muted-foreground" /></div>
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Pagamento</p>
                      <p className="text-sm font-semibold text-foreground/90 mt-0.5">
                        {selectedOrder.paymentStatus === 'paid' ? 'Pago antecipadamente' : 'A pagar no local'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 bg-muted/30 flex justify-end">
                <Button onClick={() => setSelectedOrder(null)} variant="outline" className="rounded-xl w-full">
                  Fechar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfessionalSchedulePage;
