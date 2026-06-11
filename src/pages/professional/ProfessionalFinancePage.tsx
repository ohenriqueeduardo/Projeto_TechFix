import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  Sparkles,
  Smartphone,
  Wallet,
  ShieldCheck,
  History,
  FileText
} from 'lucide-react';
import { Transaction, User, Order } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';
import { getLocalOrders, getLocalTransactions, saveLocalTransactions } from '@/utils/localDb';

const ProfessionalFinancePage = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  // Form states
  const [pixKey, setPixKey] = React.useState('');
  const [pixType, setPixType] = React.useState('cpf');
  const [withdrawValue, setWithdrawValue] = React.useState('');

  const fetchFinanceData = React.useCallback(async (userId: string, token: string) => {
    try {
      // 1. Fetch Orders
      const ordersResponse = await fetch(`/api/orders?professionalId=${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (ordersResponse.ok) {
        setOrders(await ordersResponse.json());
      } else {
        setOrders(getLocalOrders().filter((o: Order) => o.professionalId === userId));
      }

      // 2. Fetch Transactions
      const txResponse = await fetch(`/api/transactions/professional/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (txResponse.ok) {
        setTransactions(await txResponse.json());
      } else {
        setTransactions(getLocalTransactions().filter((t: Transaction) => t.professionalId === userId));
      }
    } catch (error) {
      console.warn('Backend connection failed, loading offline finance data:', error);
      setOrders(getLocalOrders().filter((o: Order) => o.professionalId === userId));
      setTransactions(getLocalTransactions().filter((t: Transaction) => t.professionalId === userId));
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
      fetchFinanceData(parsedUser.id, token);
    } else {
      setIsLoading(false);
    }
  }, [fetchFinanceData]);

  const { balanceAvailable, balanceBlocked, totalWithdrawn } = React.useMemo(() => {
    const blocked = orders
      .filter((o: Order) => o.status !== 'completed' && o.status !== 'cancelled')
      .reduce((sum: number, o: Order) => sum + Number(o.price), 0);

    const income = transactions
      .filter((t: Transaction) => t.type === 'income' && t.status === 'completed')
      .reduce((sum: number, t: Transaction) => sum + Number(t.value), 0);

    const expense = transactions
      .filter((t: Transaction) => t.type === 'expense' && (t.status === 'completed' || t.status === 'pending'))
      .reduce((sum: number, t: Transaction) => sum + Number(t.value), 0);

    const available = Math.max(0, income - expense);

    const withdrawn = transactions
      .filter((t: Transaction) => t.type === 'expense' && t.status === 'completed')
      .reduce((sum: number, t: Transaction) => sum + Number(t.value), 0);

    return {
      balanceAvailable: available,
      balanceBlocked: blocked,
      totalWithdrawn: withdrawn
    };
  }, [orders, transactions]);

  const handleRequestWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(withdrawValue);
    
    if (!withdrawValue || isNaN(val) || val <= 0) {
      toast.error('Por favor, insira um valor de saque válido.');
      return;
    }
    
    if (val > balanceAvailable) {
      toast.error('Saldo disponível insuficiente para realizar esta transação.');
      return;
    }

    if (!pixKey) {
      toast.error('Por favor, preencha sua chave PIX.');
      return;
    }

    const token = localStorage.getItem('token');
    
    // Save to local storage offline fallback
    const localTxs = getLocalTransactions();
    const localNewTx: Transaction = {
      id: `t_new_${Date.now()}`,
      type: 'expense',
      title: `Saque PIX (${pixKey}) - Pendente de Liberação`,
      value: val,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      professionalId: user?.id
    };
    localTxs.unshift(localNewTx);
    saveLocalTransactions(localTxs);

    // POST to backend
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          professionalId: user.id,
          type: 'expense',
          title: `Saque PIX (${pixKey}) - Pendente de Liberação`,
          value: val,
          status: 'pending'
        })
      });

      if (res.ok) {
        toast.success('Solicitação de saque PIX registrada! Aguarde aprovação do administrador.');
      } else {
        console.warn('Backend failed to create withdrawal transaction, using local storage.');
        toast.success('Solicitação de saque PIX registrada (offline)!');
      }
    } catch (err) {
      console.warn('Offline request, using local storage:', err);
      toast.success('Solicitação de saque PIX registrada (offline)!');
    }

    setWithdrawValue('');
    if (user && token) {
      fetchFinanceData(user.id, token);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="h-10 w-10 rounded-full border-4 border-t-primary border-white/5 animate-spin"></span>
          <p className="text-muted-foreground text-sm font-bold">Carregando dados financeiros...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-page-entrance max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-white/5 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <DollarSign className="w-6 h-6" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-primary">Gestão Financeira</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight">Finanças & Saques</h1>
        <p className="text-muted-foreground text-sm mt-1">Acompanhe seu faturamento, solicite saques via PIX e gerencie sua carteira de especialista.</p>
      </div>

      {/* Balance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-white/5 rounded-3xl relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Saldo Disponível</p>
              <h3 className="text-3xl font-black text-primary">{formatCurrency(balanceAvailable)}</h3>
              <p className="text-[10px] text-green-500 font-bold flex items-center gap-1 mt-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Liberado para transferência
              </p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/30 border-white/5 rounded-3xl relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Valores a Liberar</p>
              <h3 className="text-3xl font-black">{formatCurrency(balanceBlocked)}</h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-2">
                Garantia de serviços agendados
              </p>
            </div>
            <div className="p-3 rounded-xl bg-foreground/5 text-muted-foreground">
              <History className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card/30 border-white/5 rounded-3xl relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Sacado</p>
              <h3 className="text-3xl font-black">{formatCurrency(totalWithdrawn)}</h3>
              <p className="text-[10px] text-muted-foreground font-semibold mt-2">
                Transferências concluídas
              </p>
            </div>
            <div className="p-3 rounded-xl bg-foreground/5 text-muted-foreground">
              <FileText className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cashout Request Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 bg-card/30 border-white/5 rounded-3xl relative overflow-hidden">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-primary" /> Solicitar Saque via PIX
            </h3>
            
            <form onSubmit={handleRequestWithdraw} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Tipo de Chave PIX</label>
                  <select 
                    value={pixType}
                    onChange={(e) => setPixType(e.target.value)}
                    className="w-full h-12 bg-foreground/5 border border-white/5 px-4 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary/50"
                  >
                    <option value="cpf" className="bg-card">CPF</option>
                    <option value="email" className="bg-card">E-mail</option>
                    <option value="phone" className="bg-card">Celular</option>
                    <option value="random" className="bg-card">Chave Aleatória</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Chave PIX</label>
                  <input 
                    type="text" 
                    placeholder="Digite sua chave..." 
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    className="w-full h-12 bg-foreground/5 border border-white/5 px-4 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Valor do Saque</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">R$</span>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0,00" 
                    value={withdrawValue}
                    onChange={(e) => setWithdrawValue(e.target.value)}
                    className="w-full h-12 bg-foreground/5 border border-white/5 pl-10 pr-4 rounded-xl text-sm font-black focus:outline-none focus:border-primary/50"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground font-semibold">Saque mínimo de R$ 50,00. Processamento em até 2 horas.</p>
              </div>

              <Button type="submit" className="w-full h-12 rounded-xl text-xs font-black tracking-wider uppercase bg-primary hover:bg-primary/95 text-primary-foreground">
                Confirmar Saque PIX
              </Button>
            </form>
          </Card>

          {/* SVG Sparkline / Graph */}
          <Card className="p-6 bg-card/30 border-white/5 rounded-3xl">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Histórico de Rendimentos
            </h3>
            
            {/* Elegant Vanilla SVG Line Graph */}
            <div className="h-48 w-full flex items-end justify-between px-2 pt-6 relative border-b border-white/5 pb-2">
              <div className="absolute inset-y-0 left-0 w-full flex flex-col justify-between pointer-events-none opacity-5">
                <div className="w-full border-t border-white"></div>
                <div className="w-full border-t border-white"></div>
                <div className="w-full border-t border-white"></div>
              </div>

              {/* SVG Line */}
              <svg className="absolute inset-0 w-full h-full p-2" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path 
                  d="M 5 80 Q 25 50 45 60 T 85 20 L 95 10" 
                  fill="none" 
                  stroke="rgb(6, 182, 212)" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />
                <circle cx="85" cy="20" r="4" fill="rgb(6, 182, 212)" />
                <circle cx="45" cy="60" r="4" fill="rgb(6, 182, 212)" />
              </svg>

              {['Março', 'Abril', 'Maio'].map((m, i) => (
                <span key={i} className="text-[10px] text-muted-foreground font-black uppercase tracking-wider relative z-10">{m}</span>
              ))}
            </div>
          </Card>
        </div>

        {/* Transactions Sidebar */}
        <div className="space-y-6">
          <Card className="p-6 bg-card/30 border-white/5 rounded-3xl">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-primary" /> Extrato Financeiro
            </h3>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {transactions.map((t) => (
                <div key={t.id} className="p-3.5 bg-white/5 border border-white/5 rounded-2xl flex justify-between items-center group hover:border-primary/20 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${t.type === 'income' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {t.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground leading-tight">{t.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] text-muted-foreground font-semibold">{t.date}</span>
                        {t.status === 'pending' && (
                          <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-[7px] font-black uppercase px-1 rounded-sm scale-90">Pendente</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className={`text-sm font-black ${t.type === 'income' ? 'text-green-500' : 'text-foreground'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.value)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default ProfessionalFinancePage;
