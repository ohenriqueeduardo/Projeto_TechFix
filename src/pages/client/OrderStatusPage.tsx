import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  MapPin, 
  CreditCard, 
  User, 
  Calendar, 
  MessageSquare,
  Wrench,
  AlertTriangle,
  Star
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';
import { Order } from '@/types';

const OrderStatusPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = React.useState<Order | null>(null);
  const [prof, setProf] = React.useState<{ id?: string, name: string, avatar: string, bio: string, specialty: string, rating: number }>({ name: 'Carregando...', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=tech', bio: '', specialty: 'Especialista', rating: 5 });
  const [showDeclineDialog, setShowDeclineDialog] = React.useState(false);

  React.useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/orders/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrder(data);

          const prefRes = await fetch(`/api/professionals/${data.professionalId}`);
          if (prefRes.ok) {
            const pData = await prefRes.json();
            setProf({
              ...pData,
              name: data.professionalName,
              avatar: pData.user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${data.professionalId}`
            });
          } else {
             setProf((prev: { id?: string, name: string, avatar: string, bio: string, specialty: string, rating: number }) => ({...prev, name: data.professionalName}));
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchOrder();
  }, [id]);

  if (!order) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-yellow-500 animate-bounce" />
        <h3 className="text-xl font-bold">Pedido não encontrado</h3>
        <p className="text-sm text-muted-foreground">O chamado solicitado não pôde ser localizado localmente.</p>
        <Link to="/cliente/meus-pedidos">
          <Button className="btn-primary h-11 px-6 rounded-xl">Voltar para Meus Pedidos</Button>
        </Link>
      </div>
    );
  }

  const handleRedirectToOtherProfessional = () => {
    toast.error('Nenhum outro especialista disponível no momento.');
  };

  const handleCancelOrderEntirely = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: 'cancelled' })
      });
      toast.error('Chamado cancelado com sucesso.');
      setOrder({ ...order, status: 'cancelled' as const });
      setShowDeclineDialog(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: 'completed' })
      });
      if (response.ok) {
        toast.success('Serviço concluído! O pagamento foi liberado para o profissional.');
        setOrder({ ...order, status: 'completed' as const });
      } else {
        toast.error('Erro ao liberar o pagamento.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Erro ao comunicar com o servidor.');
    }
  };

  // Professional fetched from state

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'pending': 
      case 'counter_offer': return 1;
      case 'scheduled': return 2;
      case 'in_progress': return 3;
      case 'completed': return 4;
      default: return 0;
    }
  };

  const currentStep = getStatusStep(order.status);

  const steps = [
    { number: 1, label: "Aguardando Aprovação", desc: "Pagamento recebido em custódia segura." },
    { number: 2, label: "Técnico Agendado", desc: "Profissional reservado para a data acordada." },
    { number: 3, label: "Reparo em Andamento", desc: "Técnico efetuando suporte técnico." },
    { number: 4, label: "Chamado Concluído", desc: "Suporte finalizado e testado com sucesso." }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-page-entrance">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 -ml-2 text-muted-foreground hover:text-primary">
        <ArrowLeft className="w-4 h-4" /> Voltar para Meus Pedidos
      </Button>

      {/* Counter Offer Banner */}
      {order.status === 'counter_offer' && !showDeclineDialog && (
        <div className="glass-card p-6 border-primary/45 bg-primary/5 rounded-3xl space-y-4 animate-in zoom-in-95 duration-300 relative overflow-hidden text-left">
          <div className="absolute -right-20 -top-20 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 bg-primary rounded-full animate-ping shrink-0" />
            <h3 className="font-black text-lg text-primary">Contraproposta Recebida!</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            O especialista <strong className="text-foreground">{order.professionalName}</strong> analisou os detalhes do seu chamado e enviou uma contraproposta no valor de <strong className="text-primary text-sm font-black">{formatCurrency(order.price)}</strong>.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to={`/cliente/pedido/${order.id}/pagamento`}>
              <Button className="btn-primary h-10 px-5 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-primary/20">
                Aceitar Proposta & Pagar
              </Button>
            </Link>
            <Button 
              onClick={() => setShowDeclineDialog(true)} 
              variant="outline" 
              className="border-red-500/20 text-red-400 hover:bg-red-500/10 h-10 px-5 rounded-xl text-[10px] font-black uppercase"
            >
              Recusar Proposta
            </Button>
          </div>
        </div>
      )}

      {/* Decline Confirmation Dialog */}
      {showDeclineDialog && (
        <div className="glass-card p-6 border-red-500/30 bg-red-500/5 rounded-3xl space-y-4 animate-in slide-in-from-bottom-4 duration-300 text-left">
          <h3 className="font-black text-lg text-red-400">Proposta Recusada</h3>
          <p className="text-xs text-muted-foreground leading-relaxed font-medium">
            Você recusou a contraproposta de {order.professionalName}. Gostaria de direcionar esta mesma solicitação de chamado para outro especialista de TI de nosso catálogo?
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button 
              onClick={handleRedirectToOtherProfessional} 
              className="btn-primary h-10 px-5 rounded-xl text-[10px] font-black uppercase animate-pulse-glow"
            >
              Sim, Direcionar a Outro Técnico
            </Button>
            <Button 
              onClick={handleCancelOrderEntirely} 
              variant="outline" 
              className="border-white/10 hover:bg-white/5 h-10 px-5 rounded-xl text-[10px] font-black uppercase"
            >
              Não, Cancelar Pedido
            </Button>
          </div>
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-foreground/5">
        <div>
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest block mb-1">{order.code}</span>
          <h1 className="text-2xl md:text-3xl font-black">{order.serviceTitle}</h1>
        </div>
        <div className="text-left md:text-right shrink-0">
          <Badge className="bg-primary/20 text-primary border-primary/30 text-xs px-3 py-1 font-bold uppercase rounded-full">
            {order.status === 'completed' ? 'Concluído' : order.status === 'cancelled' ? 'Cancelado' : order.status === 'provisional' ? 'Aguard. Pagamento' : 'Ativo'}
          </Badge>
          <p className="text-xl font-black text-primary mt-1.5">{formatCurrency(order.price)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Status Timeline */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8 bg-card/30 border-foreground/5 rounded-3xl space-y-8">
            <h3 className="font-bold text-lg">Acompanhamento de Status</h3>
            
            <div className="relative pl-8 border-l border-foreground/5 space-y-8">
              {steps.map((step) => {
                const isCompleted = step.number < currentStep;
                const isActive = step.number === currentStep;
                const isFuture = step.number > currentStep;

                return (
                  <div key={step.number} className="relative">
                    {/* Circle Indicator */}
                    <span className={`absolute -left-[41px] top-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      isCompleted 
                        ? 'bg-primary border-primary text-background' 
                        : isActive 
                          ? 'bg-background border-primary text-primary scale-110 shadow-[0_0_10px_rgba(6,182,212,0.4)]' 
                          : 'bg-card border-foreground/10 text-muted-foreground'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5 fill-current" /> : <span className="text-[10px] font-bold">{step.number}</span>}
                    </span>

                    <div className="space-y-1">
                      <h4 className={`text-sm font-bold ${isActive ? 'text-primary' : isFuture ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {step.label}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Service Details */}
          <Card className="p-8 bg-card/30 border-foreground/5 rounded-3xl space-y-6">
            <h3 className="font-bold text-lg">Informações do Chamado</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs leading-relaxed font-semibold">
              <div className="flex gap-3">
                <MapPin className="text-primary w-5 h-5 shrink-0" />
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-black tracking-widest mb-0.5">Endereço de Atendimento</span>
                  <span className="text-foreground">{order.address}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Calendar className="text-primary w-5 h-5 shrink-0" />
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-black tracking-widest mb-0.5">Data e Horário</span>
                  <span className="text-foreground">{order.date} às {order.time}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <CreditCard className="text-primary w-5 h-5 shrink-0" />
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-black tracking-widest mb-0.5">Forma de Pagamento</span>
                  <span className="text-foreground uppercase">{order.paymentMethod} (Custódia TechFix)</span>
                  {order.paymentId && <span className="text-[10px] block text-muted-foreground mt-0.5">ID: {order.paymentId}</span>}
                </div>
              </div>

              <div className="flex gap-3">
                <Wrench className="text-primary w-5 h-5 shrink-0" />
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-black tracking-widest mb-0.5">Escopo Legal</span>
                  <span className="text-foreground">Suporte técnico de TI com Garantia de 90 dias</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Professional Card & Payout Details */}
        <div className="space-y-6">
          <Card className="p-6 bg-card/30 rounded-3xl border-primary/20 sticky top-28 space-y-6">
            <h3 className="font-bold text-base">Técnico Responsável</h3>
            
            <div className="flex items-center gap-4">
              <img src={prof.avatar} className="w-14 h-14 rounded-2xl object-cover border border-foreground/5 shrink-0" alt="" />
              <div>
                <h4 className="font-bold text-sm">{prof.name}</h4>
                <p className="text-[10px] text-primary font-bold">{prof.specialty}</p>
                <div className="flex items-center gap-1 text-xs text-yellow-500 font-bold mt-0.5">
                  <Star className="w-3.5 h-3.5 fill-current" /> {prof.rating}
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{prof.bio}</p>

            <div className="flex gap-2">
              <Button onClick={() => window.open(`/cliente/pedido/${order.id}/os`, '_blank')} className="w-full btn-primary h-10 text-[11px] font-black gap-1.5 bg-foreground text-background hover:bg-foreground/90 uppercase">
                Imprimir Ordem de Serviço (PDF)
              </Button>
            </div>

            <div className="pt-4 border-t border-foreground/5 text-center">
              <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest block mb-1">Faturamento em Custódia</span>
              <span className="text-2xl font-black text-primary">{formatCurrency(order.price + 15)}</span>
            </div>

            {order.status !== 'completed' && order.status !== 'cancelled' && (
              <div className="pt-4 flex flex-col gap-3">
                <Button 
                  onClick={handleCompleteOrder} 
                  className="w-full bg-green-500 hover:bg-green-600 text-white text-xs font-black h-auto py-3 whitespace-normal uppercase leading-tight"
                >
                  Serviço Concluído (Liberar Pagamento)
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => toast.info('Solicitação de cancelamento enviada ao suporte.')} 
                  className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive text-xs font-black h-auto py-3 whitespace-normal uppercase leading-tight"
                >
                  Cancelar serviço e solicitar reembolso
                </Button>
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
};

export default OrderStatusPage;
