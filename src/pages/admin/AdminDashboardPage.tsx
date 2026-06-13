import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { 
  DollarSign, 
  Users, 
  ShieldCheck, 
  HelpCircle, 
  Check, 
  X, 
  TrendingUp, 
  Bell, 
  Database,
  Search,
  Sparkles,
  UserPlus
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface LogItem {
  id: string | number;
  action: string;
  details: string;
  time: string;
  type: string;
}

interface CandidateItem {
  id: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
}

const AdminDashboardPage = () => {
  const [metrics, setMetrics] = React.useState({
    totalUsers: 0,
    totalServices: 0,
    totalRevenue: 0,
    openOrders: 0
  });

  const [candidates, setCandidates] = React.useState<CandidateItem[]>([]);
  const [systemLogs, setSystemLogs] = React.useState<LogItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/admin/dashboard');
        if (res.ok) {
          const data = await res.json();
          setMetrics({
            totalUsers: data.metrics.totalUsers,
            totalServices: data.metrics.totalServices,
            totalRevenue: data.metrics.totalRevenue,
            openOrders: data.metrics.openOrders
          });

          // System logs from recent orders
          const logs = data.recentOrders.map((o: { id: string; status: string; serviceTitle: string; price: number; createdAt: string }) => ({
            id: o.id,
            action: 'Pedido ' + o.status,
            details: `Serviço ${o.serviceTitle} no valor de ${formatCurrency(o.price)}`,
            time: new Date(o.createdAt).toLocaleDateString(),
            type: o.status === 'completed' ? 'success' : 'info'
          }));
          
          setSystemLogs(logs);
          setCandidates(data.recentUsers); // Used just to show recently joined users
        }
      } catch (e) {
        console.error('Error fetching admin dashboard:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) return <div className="p-12 text-center">Carregando painel...</div>;

  return (
    <div className="space-y-10 animate-in fade-in duration-500 p-6 md:p-12 max-w-7xl mx-auto">
      
      {/* Admin header with details */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-xs font-black uppercase tracking-widest text-primary">Painel de Administração Geral</span>
            <Badge className="bg-red-500/25 text-red-400 border-red-500/35 rounded-md text-[9px] font-black uppercase ml-2">Root Access</Badge>
          </div>
          <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-cyan-400">Olá, Henrique Eduardo! 👑</h1>
          <p className="text-muted-foreground text-sm mt-1">Métricas de faturamento, credenciamentos e logs do sistema atualizados em tempo real.</p>
        </div>
      </div>

      {/* Admin Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Platform Revenue with SVG Sparkline */}
        <Card className="p-6 bg-gradient-to-br from-cyan-950/20 via-primary/5 to-transparent border-white/5 rounded-2xl relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Faturamento Total</p>
              <h3 className="text-2xl font-black text-primary">{formatCurrency(metrics.totalRevenue)}</h3>
              <p className="text-[10px] text-green-500 font-bold flex items-center gap-1 mt-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> +18.7% de crescimento
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
                d="M 0 19 Q 20 15 40 8 T 70 12 L 100 2 L 100 20 L 0 20 Z" 
                fill="url(#adminGradient)" 
                stroke="none"
              />
              <path 
                d="M 0 19 Q 20 15 40 8 T 70 12 L 100 2" 
                fill="none" 
                stroke="rgb(6, 182, 212)" 
                strokeWidth="1.5"
              />
              <defs>
                <linearGradient id="adminGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(6, 182, 212, 0.4)" />
                  <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </Card>

        {[
          { label: 'Usuários Totais', value: metrics.totalUsers, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10', desc: 'Cadastrados na base' },
          { label: 'Serviços Ofertados', value: metrics.totalServices, icon: ShieldCheck, color: 'text-green-400', bg: 'bg-green-400/10', desc: 'Ativos na plataforma' },
          { label: 'Chamados Abertos', value: metrics.openOrders, icon: HelpCircle, color: 'text-yellow-500', bg: 'bg-yellow-500/10', desc: 'Pedidos não finalizados' },
        ].map((stat, i) => (
          <Card key={i} className="p-6 bg-card/30 border-white/5 rounded-2xl hover:border-primary/20 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">{stat.label}</p>
                <h3 className="text-2xl font-black">{stat.value}</h3>
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
        
        {/* LEFT COLUMN: Technical Specialists Approval Queue (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" /> Cadastros Recentes
            </h2>
          </div>

          <div className="space-y-4">
            {candidates.map((tech) => (
              <Card key={tech.id} className="p-5 bg-card/30 border-white/5 rounded-2xl hover:border-primary/20 transition-all group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h4 className="font-bold text-base group-hover:text-primary transition-colors">{tech.name}</h4>
                      <Badge className="bg-primary/10 text-primary text-[9px] font-bold">{tech.role.includes('professional') ? 'Especialista' : 'Cliente'}</Badge>
                    </div>
                    <p className="text-xs text-primary font-semibold">{tech.email}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-semibold pt-1">
                      <span>Criado em: <span className="text-foreground">{new Date(tech.createdAt).toLocaleDateString()}</span></span>
                    </div>
                  </div>
                  <Link to="/admin/users">
                    <Button size="sm" variant="outline" className="border-white/10 text-xs h-9">
                      Ver Usuários
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Live System Audit Logs & Growth (1/3 width) */}
        <div className="space-y-6">
          
          {/* Audit Logs Feed */}
          <Card className="p-6 bg-card/30 border-white/5 rounded-3xl">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-primary" /> Atividades do Sistema
            </h3>
            
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {systemLogs.map((log) => (
                <div key={log.id} className="relative border-l border-white/10 pl-4 pb-1 space-y-1">
                  {/* Indicator bullet */}
                  <span className={`absolute -left-1 top-1.5 h-2 w-2 rounded-full ${
                    log.type === 'success' ? 'bg-green-500' :
                    log.type === 'warning' ? 'bg-yellow-500' :
                    log.type === 'error' ? 'bg-red-500' : 'bg-primary'
                  }`}></span>
                  <div className="flex justify-between items-center">
                    <h4 className="text-[11px] font-black text-foreground uppercase tracking-wide leading-tight">{log.action}</h4>
                    <span className="text-[9px] text-muted-foreground font-semibold shrink-0">{log.time}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed font-semibold">{log.details}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Platform Platform Growth Chart (SVG Bar) */}
          <Card className="p-6 bg-card/30 border-white/5 rounded-3xl">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Volume de Serviços Anual
            </h3>
            
            <div className="h-32 w-full flex items-end justify-between px-1.5 relative border-b border-white/5 pb-2">
              {[
                { label: 'Q1', val: 50 },
                { label: 'Q2', val: 75 },
                { label: 'Q3', val: 90 },
                { label: 'Q4', val: 110 }
              ].map((q, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5 w-12 group cursor-pointer">
                  <div className="w-4.5 bg-gradient-to-t from-primary/30 to-primary rounded-t-sm group-hover:scale-y-105 transition-all duration-300" style={{ height: `${q.val * 0.7}px` }}></div>
                  <span className="text-[9px] text-muted-foreground font-black uppercase">{q.label}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick System Action */}
          <Card className="p-5 bg-gradient-to-br from-red-950/20 via-orange-950/10 to-transparent border-red-500/20 rounded-3xl relative overflow-hidden group">
            <h3 className="text-sm font-black mb-1 text-red-400">Zona de Manutenção</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
              Acesso rápido a auditorias profundas de segurança e backup forçado de banco de dados.
            </p>
            <Button 
              variant="outline" 
              onClick={() => toast.success('Backup do banco de dados iniciado no servidor principal...')}
              className="w-full h-10 rounded-xl text-xs gap-1.5 border-red-500/25 text-red-400 hover:bg-red-500 hover:text-white transition-all bg-transparent"
            >
              Forçar Backup Completo
            </Button>
          </Card>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboardPage;
