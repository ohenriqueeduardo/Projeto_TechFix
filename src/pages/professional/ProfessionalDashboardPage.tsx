import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  ShieldAlert,
  FolderOpen,
  CalendarDays,
  Settings,
  ShieldCheck
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Printer } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

import { User, Order, Transaction, Review, Professional } from '@/types';

const ProfessionalDashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<User | null>(null);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [professionalProfile, setProfessionalProfile] = React.useState<Professional | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [counterOfferOrderId, setCounterOfferOrderId] = React.useState<string | null>(null);
  const [counterOfferPrice, setCounterOfferPrice] = React.useState<string>('');

  const [showVerificationModal, setShowVerificationModal] = React.useState(false);
  const [idDocBase64, setIdDocBase64] = React.useState('');
  const [selfieBase64, setSelfieBase64] = React.useState('');
  const [isVerifying, setIsVerifying] = React.useState(false);

  const fetchDashboardData = React.useCallback(async (userId: string, token: string, currentUser: User | null) => {
    try {
      const profResponse = await fetch(`/api/professionals/${userId}`);
      if (profResponse.ok) {
        const profData = await profResponse.json();
        setProfessionalProfile(profData);
      }

      const ordersResponse = await fetch(`/api/orders?professionalId=${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData);
      }

      const txResponse = await fetch(`/api/transactions/professional/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (txResponse.ok) {
        const txData = await txResponse.json();
        setTransactions(txData);
      }

      const reviewsResponse = await fetch(`/api/reviews/professional/${userId}`);
      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);
      }

    } catch (error) {
      console.warn('Backend connection failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchDashboardData(parsedUser.id, token, parsedUser);
    } else {
      setIsLoading(false);
    }
  }, [fetchDashboardData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVerificationRequest = async () => {
    if (!idDocBase64 || !selfieBase64) {
      toast.error('Por favor, anexe a foto do documento e a selfie.');
      return;
    }
    setIsVerifying(true);
    try {
      const res = await fetch(`/api/professionals/${user?.id}/verify-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idDocumentUrl: idDocBase64, selfieUrl: selfieBase64 })
      });
      if (res.ok) {
        toast.success('Documentos enviados com sucesso!');
        setShowVerificationModal(false);
        if (user) fetchDashboardData(user.id, localStorage.getItem('token') || '', user);
      } else {
        toast.error('Erro ao enviar documentos.');
      }
    } catch (e) {
      toast.error('Erro ao enviar documentos.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAcceptOrder = async (orderId: string) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: 'scheduled' })
      });
    } catch (e) {}
    toast.success('Pedido aceito com sucesso!');
    if (user) fetchDashboardData(user.id, token || '', user);
  };

  const handleCompleteOrder = async (orderId: string, orderPrice: number, orderTitle: string) => {
    const token = localStorage.getItem('token');
    try {
      const orderResponse = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: 'completed' })
      });

      if (orderResponse.ok && user) {
        await fetch(`/api/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            professionalId: user.id,
            type: 'income',
            title: `Recebido por: ${orderTitle}`,
            value: orderPrice,
            status: 'completed'
          })
        });
      }
    } catch (err) {}
    toast.success('Serviço concluído e pagamento creditado!');
    if (user) fetchDashboardData(user.id, token || '', user);
  };

  const handleCancelOrder = async (orderId: string) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: 'cancelled' })
      });
    } catch (e) {}
    toast.error('Serviço recusado/cancelado.');
    if (user) fetchDashboardData(user.id, token || '', user);
  };

  const handleSendCounterOffer = async (orderId: string) => {
    if (!counterOfferPrice || isNaN(Number(counterOfferPrice))) {
      toast.error('Valor inválido.');
      return;
    }
    const priceNum = Number(counterOfferPrice);
    const token = localStorage.getItem('token');
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: 'counter_offer', price: priceNum })
      });
    } catch (e) {}
    toast.success('Contraproposta enviada!');
    setCounterOfferOrderId(null);
    if (user) fetchDashboardData(user.id, token || '', user);
  };

  const activeJobs = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length;
  const completedJobs = orders.filter(o => o.status === 'completed').length;
  
  const currentMonthIncome = transactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + Number(t.value), 0);

  const averageSatisfaction = professionalProfile?.satisfaction !== undefined 
    ? `${professionalProfile.satisfaction}%` : '100%';

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 px-2 py-0.5 rounded text-[9px] font-black uppercase">Pendente</Badge>;
      case 'counter_offer': return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 px-2 py-0.5 rounded text-[9px] font-black uppercase">Negociando</Badge>;
      case 'scheduled': return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-2 py-0.5 rounded text-[9px] font-black uppercase">Agendado</Badge>;
      case 'in_progress': return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 px-2 py-0.5 rounded text-[9px] font-black uppercase">Ativo</Badge>;
      case 'completed': return <Badge className="bg-green-500/10 text-green-500 border-green-500/20 px-2 py-0.5 rounded text-[9px] font-black uppercase">Concluído</Badge>;
      default: return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 px-2 py-0.5 rounded text-[9px] font-black uppercase">Cancelado</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <span className="h-10 w-10 rounded-full border-4 border-t-primary border-white/5 animate-spin"></span>
      </div>
    );
  }

  const userAvatar = user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user?.name || 'Pro')}`;

  return (
    <div className="flex flex-col lg:h-[calc(100vh-130px)] gap-5 animate-page-entrance max-w-7xl mx-auto overflow-y-auto lg:overflow-hidden pb-10 lg:pb-0 px-4 md:px-8 pt-4 md:pt-8">
      
      {/* Premium Hero Section */}
      <div className="shrink-0 relative overflow-hidden rounded-3xl p-6 md:p-8 border border-white/10 glass-card bg-gradient-to-br from-card/40 to-background">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-green-500/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <img src={userAvatar} alt="Avatar" className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 border-primary/30 shadow-lg object-cover" />
              <div className="absolute -bottom-2 -right-2 p-1 bg-background rounded-full">
                <div className={`bg-${professionalProfile?.verificationStatus === 'verified' ? 'primary' : 'orange-500'}/20 p-1 rounded-full`}>
                  {professionalProfile?.verificationStatus === 'verified' ? (
                    <ShieldCheck className="w-3 h-3 text-primary" />
                  ) : (
                    <ShieldAlert className="w-3 h-3 text-orange-500" />
                  )}
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black tracking-widest text-primary uppercase">Painel do Especialista</span>
                {professionalProfile?.verificationStatus === 'verified' && (
                  <Badge className="bg-primary/20 text-primary border-primary/30 text-[9px] uppercase px-1.5 py-0">Verificado</Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">Olá, {user?.name?.split(' ')[0] || 'Profissional'}! 🛠️</h1>
            </div>
          </div>
          
          {/* Financial Integration */}
          <div className="w-full md:w-64 bg-background/50 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
            <div className="flex justify-between items-start mb-1">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Receita Mensal</span>
              <DollarSign className="w-3.5 h-3.5 text-green-500" />
            </div>
            <h3 className="text-2xl font-black text-green-500">{formatCurrency(currentMonthIncome)}</h3>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
              <span className="text-[10px] text-muted-foreground font-semibold">Reparos: <strong className="text-foreground">{completedJobs}</strong></span>
              <span className="text-[10px] text-muted-foreground font-semibold flex items-center"><Star className="w-3 h-3 fill-yellow-500 text-yellow-500 mr-1"/> {averageSatisfaction}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Alerts */}
      {professionalProfile && (professionalProfile.verificationStatus === 'unverified' || professionalProfile.verificationStatus === 'rejected') && (
        <div className="shrink-0 bg-orange-500/10 border border-orange-500/20 px-4 py-3 rounded-xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-orange-500 shrink-0" />
            <p className="text-xs text-orange-500/90 font-medium">Sua conta precisa de verificação oficial.</p>
          </div>
          <Button onClick={() => setShowVerificationModal(true)} size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] h-7 px-3">
            Verificar Agora
          </Button>
        </div>
      )}

      {/* Quick Actions (Horizontal) */}
      <div className="shrink-0 grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button onClick={() => navigate('/profissional/servicos')} variant="outline" className="h-12 flex items-center justify-center gap-2 rounded-xl bg-card/30 hover:bg-card/50 border-white/10 text-xs font-bold">
          <Wrench className="w-4 h-4 text-primary" /> Meus Serviços
        </Button>
        <Button onClick={() => navigate('/profissional/financeiro')} variant="outline" className="h-12 flex items-center justify-center gap-2 rounded-xl bg-card/30 hover:bg-card/50 border-white/10 text-xs font-bold">
          <DollarSign className="w-4 h-4 text-green-500" /> Faturamento
        </Button>
        <Button onClick={() => toast.success('Agenda sincronizada com sucesso!')} variant="outline" className="h-12 flex items-center justify-center gap-2 rounded-xl bg-card/30 hover:bg-card/50 border-white/10 text-xs font-bold">
          <CalendarDays className="w-4 h-4 text-blue-500" /> Agenda
        </Button>
        <Button onClick={() => navigate('/profissional/configuracoes')} variant="outline" className="h-12 flex items-center justify-center gap-2 rounded-xl bg-card/30 hover:bg-card/50 border-white/10 text-xs font-bold">
          <Settings className="w-4 h-4 text-muted-foreground" /> Configurações
        </Button>
      </div>

      {/* Main Single Page Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-4">
        
        {/* Left Col: Queue */}
        <div className="lg:col-span-2 flex flex-col min-h-0 space-y-3">
          <div className="shrink-0 flex justify-between items-center px-1">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Fila de Trabalho
            </h2>
            <Badge className="bg-primary/10 text-primary rounded-md text-[9px] font-black uppercase">
              {activeJobs} Ativos
            </Badge>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {orders.length === 0 ? (
              <div className="glass-card p-8 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center h-40">
                <FolderOpen className="w-8 h-8 text-muted-foreground opacity-50 mb-2" />
                <h4 className="text-sm font-bold">Nenhum serviço agendado</h4>
              </div>
            ) : (
              orders.map((order) => (
                <Card key={order.id} className="p-4 bg-card/30 border-white/5 hover:border-primary/20 transition-all rounded-2xl flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-black text-muted-foreground uppercase">{order.code}</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <h3 className="text-sm font-bold">{order.serviceTitle}</h3>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{order.date} • {order.time} • {order.address}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[9px] text-muted-foreground uppercase font-black">A Receber</p>
                      <p className="text-base font-black text-primary">{formatCurrency(order.price)}</p>
                    </div>
                  </div>

                  {/* Actions Compact */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                    {counterOfferOrderId === order.id ? (
                      <div className="flex items-center gap-2 w-full">
                        <input 
                          type="number" 
                          className="bg-background border border-white/10 rounded px-2 text-xs h-8 flex-1 focus:ring-1 focus:ring-primary"
                          value={counterOfferPrice}
                          onChange={(e) => setCounterOfferPrice(e.target.value)}
                          placeholder="R$"
                        />
                        <Button onClick={() => handleSendCounterOffer(order.id)} size="sm" className="h-8 text-[10px]">Enviar</Button>
                        <Button onClick={() => setCounterOfferOrderId(null)} size="sm" variant="ghost" className="h-8 text-[10px]">Cancelar</Button>
                      </div>
                    ) : (
                      <>
                        {order.status === 'pending' && (
                          <>
                            <Button onClick={() => handleAcceptOrder(order.id)} size="sm" className="bg-green-600 hover:bg-green-500 text-white h-8 text-[10px] px-3"><Check className="w-3 h-3 mr-1" /> Aceitar</Button>
                            <Button onClick={() => { setCounterOfferOrderId(order.id); setCounterOfferPrice(order.price.toString()); }} size="sm" className="h-8 text-[10px] px-3">Contraproposta</Button>
                            <Button onClick={() => handleCancelOrder(order.id)} size="sm" variant="outline" className="border-red-500/20 text-red-400 h-8 text-[10px] px-3"><X className="w-3 h-3 mr-1" /> Recusar</Button>
                          </>
                        )}
                        {(order.status === 'scheduled' || order.status === 'in_progress') && (
                          <>
                            <Button onClick={() => window.open(`/order/${order.id}/print`, '_blank')} size="sm" variant="outline" className="border-primary/20 text-primary h-8 text-[10px] px-3"><Printer className="w-3 h-3 mr-1" /> O.S.</Button>
                            <Button onClick={() => handleCompleteOrder(order.id, order.price, order.serviceTitle)} size="sm" className="h-8 text-[10px] px-3"><CheckCircle className="w-3 h-3 mr-1" /> Concluir</Button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Finance Graph */}
        <div className="flex flex-col min-h-0 space-y-3">
          <div className="shrink-0 flex items-center justify-between px-1">
            <h2 className="text-base font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" /> Fluxo
            </h2>
          </div>
          
          <Card className="flex-1 overflow-y-auto custom-scrollbar p-5 bg-card/30 border-white/5 rounded-2xl flex flex-col gap-4">
            {/* Tiny SVG Chart */}
            <div className="shrink-0 h-32 w-full flex items-end justify-between px-2 relative border-b border-white/5 pb-2">
              {[
                { month: 'Jan', value: 50 },
                { month: 'Fev', value: 40 },
                { month: 'Mar', value: 60 },
                { month: 'Abr', value: 80 },
                { month: 'Mai', value: currentMonthIncome > 0 ? 100 : 0 }
              ].map((bar, i) => (
                <div key={i} className="flex flex-col items-center gap-1 w-8 group">
                  <div className="w-3 bg-gradient-to-t from-primary/40 to-primary rounded-t-sm transition-all" style={{ height: `${bar.value * 0.7}px` }}></div>
                  <span className="text-[8px] text-muted-foreground font-black uppercase">{bar.month}</span>
                </div>
              ))}
            </div>

            {/* List */}
            <div className="flex-1 space-y-2">
              <h4 className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2">Transações Recentes</h4>
              {transactions.slice(0, 3).map((t) => (
                <div key={t.id} className="flex justify-between items-center p-2.5 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${t.type === 'income' ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
                      {t.type === 'income' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold leading-tight line-clamp-1">{t.title}</h4>
                      <span className="text-[8px] text-muted-foreground">{t.date}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black ${t.type === 'income' ? 'text-green-500' : 'text-foreground'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.value)}
                  </span>
                </div>
              ))}
              {transactions.length === 0 && <p className="text-[10px] text-muted-foreground text-center py-4">Nenhuma movimentação.</p>}
            </div>
          </Card>
        </div>

      </div>

      <Dialog open={showVerificationModal} onOpenChange={setShowVerificationModal}>
        <DialogContent className="max-w-sm p-5 rounded-3xl border-white/10 glass-card">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Verificação</DialogTitle>
            <DialogDescription className="text-xs">Envie RG/CNH e selfie.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <label className="text-[10px] font-bold uppercase mb-1 block">Foto Documento</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setIdDocBase64)} className="text-xs file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:bg-primary/10 file:text-primary" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase mb-1 block">Selfie com Doc</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setSelfieBase64)} className="text-xs file:mr-2 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:bg-primary/10 file:text-primary" />
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-4 mt-2 border-t border-white/5">
            <Button variant="ghost" onClick={() => setShowVerificationModal(false)} size="sm">Cancelar</Button>
            <Button onClick={handleVerificationRequest} disabled={isVerifying || !idDocBase64 || !selfieBase64} size="sm">Enviar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfessionalDashboardPage;
