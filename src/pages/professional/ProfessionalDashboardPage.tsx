import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { 
  DollarSign, 
  CheckCircle, 
  Star, 
  Clock, 
  Wrench, 
  Check, 
  X, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  MessageSquare,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { orders as initialOrders, transactions } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { AnimatedCounter } from '@/components/ui/AnimatedCounter';

const ProfessionalDashboardPage = () => {
  // Use local state so the page is fully interactive! Carlos Mendes is p1
  const [orders, setOrders] = React.useState(initialOrders.filter(o => o.professionalId === 'p1'));

  const handleAcceptOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'scheduled' } : o));
    toast.success('Pedido aceito com sucesso! Agendado na sua agenda.');
  };

  const handleCompleteOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'completed' } : o));
    toast.success('Parabéns! Serviço marcado como concluído. Pagamento liberado.');
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled' } : o));
    toast.error('Serviço cancelado.');
  };

  // Status Badge helpers
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

  return (
    <div className="space-y-10 animate-page-entrance p-6 md:p-12 max-w-7xl mx-auto">
      
      {/* Header bar specific to Professional context */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-ping"></span>
            <span className="text-xs font-black uppercase tracking-widest text-primary">Painel do Especialista</span>
            <Badge className="bg-primary/20 text-primary border-primary/30 rounded-md text-[9px] font-black uppercase ml-2">Técnico Verificado</Badge>
          </div>
          <h1 className="text-4xl font-black tracking-tight">Olá, Carlos Mendes! 🛠️</h1>
          <p className="text-muted-foreground text-sm mt-1">Aqui está o resumo dos seus reparos e receitas de hoje.</p>
        </div>
      </div>

      {/* Statistics Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Earnings Card with SVG Sparkline */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-white/5 rounded-2xl relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Ganhos Mensais</p>
              <h3 className="text-2xl font-black text-primary">R$ 4.870,00</h3>
              <p className="text-[10px] text-green-500 font-bold flex items-center gap-1 mt-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> +12.4% que o último mês
              </p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          {/* Sparkline line graph in pure SVG */}
          <div className="absolute bottom-0 left-0 w-full h-12 overflow-hidden opacity-40 group-hover:opacity-75 transition-opacity">
            <svg viewBox="0 0 100 20" className="w-full h-full" preserveAspectRatio="none">
              <path 
                d="M 0 18 Q 15 12 30 15 T 60 5 T 90 10 L 100 2 L 100 20 L 0 20 Z" 
                fill="url(#primaryGradient)" 
                stroke="none"
              />
              <path 
                d="M 0 18 Q 15 12 30 15 T 60 5 T 90 10 L 100 2" 
                fill="none" 
                stroke="rgb(6, 182, 212)" 
                strokeWidth="1.5"
              />
              <defs>
                <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(6, 182, 212, 0.4)" />
                  <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </Card>

        {[
          { label: 'Trabalhos Concluídos', value: '234', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10', desc: 'Reparos e montagens finalizados' },
          { label: 'Satisfação Média', value: '98%', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10', desc: 'Baseado em 128 avaliações' },
          { label: 'Jobs Ativos', value: orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length, icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10', desc: 'Pedidos pendentes ou agendados' },
        ].map((stat, i) => (
          <Card key={i} className="p-6 bg-card/30 border-white/5 rounded-2xl hover:border-primary/20 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">{stat.label}</p>
                <h3 className="text-2xl font-black">
                  <AnimatedCounter value={stat.value} />
                </h3>
                <p className="text-[10px] text-muted-foreground font-semibold mt-1">{stat.desc}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Manage Active and Pending Jobs (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Wrench className="w-5 h-5 text-primary" /> Fila de Serviços
            </h2>
            <Badge className="bg-white/5 border border-white/10 text-muted-foreground rounded-md text-[10px] font-black uppercase">
              {orders.length} cadastrados
            </Badge>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-6 bg-card/30 border-white/5 rounded-2xl hover:border-primary/25 transition-all group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">{order.code}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{order.serviceTitle}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground font-semibold">
                      <span>Cliente: <span className="text-foreground font-medium">{order.clientName}</span></span>
                      <span>•</span>
                      <span>Agendado: <span className="text-foreground font-medium">{order.date} às {order.time}</span></span>
                    </div>
                    <p className="text-xs text-muted-foreground max-w-md font-semibold">Local: <span className="text-foreground">{order.address}</span></p>
                  </div>

                  <div className="flex flex-col sm:items-end gap-3.5 shrink-0 pt-4 sm:pt-0 border-t sm:border-0 border-white/5">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] text-muted-foreground uppercase font-black">Valor a receber</p>
                      <p className="text-xl font-black text-primary">{formatCurrency(order.price)}</p>
                    </div>

                    {/* Interactive workflow buttons */}
                    <div className="flex gap-2 w-full sm:w-auto">
                      {order.status === 'pending' && (
                        <>
                          <Button 
                            onClick={() => handleAcceptOrder(order.id)} 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs gap-1 h-9 px-3"
                          >
                            <Check className="w-3.5 h-3.5" /> Aceitar
                          </Button>
                          <Button 
                            onClick={() => handleCancelOrder(order.id)} 
                            size="sm" 
                            variant="outline" 
                            className="border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-xl text-xs h-9 px-3"
                          >
                            <X className="w-3.5 h-3.5" /> Recusar
                          </Button>
                        </>
                      )}

                      {(order.status === 'scheduled' || order.status === 'in_progress') && (
                        <Button 
                          onClick={() => handleCompleteOrder(order.id)} 
                          size="sm" 
                          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl text-xs gap-1 h-9 w-full sm:w-auto px-4"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Concluir Serviço
                        </Button>
                      )}

                      {order.status === 'completed' && (
                        <Badge className="bg-green-500/10 text-green-500 border-green-500/20 py-1.5 px-3 rounded-xl text-xs font-bold gap-1">
                          <Check className="w-3.5 h-3.5" /> Finalizado com Sucesso
                        </Badge>
                      )}

                      {order.status === 'cancelled' && (
                        <Badge className="bg-red-500/10 text-red-500 border-red-500/20 py-1.5 px-3 rounded-xl text-xs font-bold gap-1">
                          <ShieldAlert className="w-3.5 h-3.5" /> Pedido Cancelado
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: SVG Financial Chart & Transactions list (1/3 width) */}
        <div className="space-y-6">
          {/* Monthly Income SVG Bar Chart */}
          <Card className="p-6 bg-card/30 border-white/5 rounded-3xl">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Faturamento Anual
            </h3>
            
            {/* Elegant Vanilla SVG Bar Chart */}
            <div className="h-44 w-full flex items-end justify-between px-2 pt-6 relative border-b border-white/5 pb-2">
              {/* Vertical grids line */}
              <div className="absolute inset-y-0 left-0 w-full flex flex-col justify-between pointer-events-none opacity-5">
                <div className="w-full border-t border-white"></div>
                <div className="w-full border-t border-white"></div>
                <div className="w-full border-t border-white"></div>
              </div>

              {[
                { month: 'Jan', value: 80 },
                { month: 'Fev', value: 55 },
                { month: 'Mar', value: 95 },
                { month: 'Abr', value: 70 },
                { month: 'Mai', value: 100 }
              ].map((bar, i) => (
                <div key={i} className="flex flex-col items-center gap-2 w-8 group cursor-pointer">
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-24 bg-primary text-primary-foreground text-[9px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    R$ {(bar.value * 40).toFixed(0)}
                  </div>
                  {/* Styled Bar */}
                  <div 
                    className="w-4 bg-gradient-to-t from-primary/40 to-primary rounded-t-sm group-hover:scale-y-105 transition-all duration-300 shadow-[0_0_15px_rgba(0,255,255,0.2)]" 
                    style={{ height: `${bar.value * 0.9}px` }}
                  ></div>
                  <span className="text-[10px] text-muted-foreground font-black uppercase">{bar.month}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Deposits & Withdrawals list */}
          <Card className="p-6 bg-card/30 border-white/5 rounded-3xl">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-primary" /> Fluxo de Caixa Recente
            </h3>
            <div className="space-y-3.5">
              {transactions.slice(0, 4).map((t) => (
                <div key={t.id} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg shrink-0 ${t.type === 'income' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {t.type === 'income' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold text-foreground leading-tight">{t.title}</h4>
                      <span className="text-[9px] text-muted-foreground font-semibold">{t.date}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-black ${t.type === 'income' ? 'text-green-500' : 'text-foreground'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.value)}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Chat Shortcut Card */}
          <Card className="p-5 bg-gradient-to-br from-primary/10 via-blue-500/5 to-transparent border-primary/20 rounded-3xl relative overflow-hidden group">
            <h3 className="text-sm font-bold mb-1.5">Precisa falar com o cliente?</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
              Use a Central de Mensagens para tirar dúvidas sobre o serviço ou reagendar horários.
            </p>
            <Link to="/cliente/chat/1">
              <Button variant="outline" className="w-full h-10 rounded-xl text-xs gap-1.5 border-white/10 hover:bg-primary hover:text-background transition-all">
                <MessageSquare className="w-3.5 h-3.5 text-primary group-hover:text-inherit" /> Abrir Conversas
              </Button>
            </Link>
          </Card>
        </div>

      </div>

    </div>
  );
};

export default ProfessionalDashboardPage;
