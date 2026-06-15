import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Users, 
  ShieldCheck, 
  Check, 
  X, 
  TrendingUp, 
  Database,
  UserPlus,
  ShieldAlert,
  ServerCrash
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';

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
  role: string;
  email: string;
  createdAt: string;
}

const AdminDashboardPage = () => {
  const navigate = useNavigate();
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
          setMetrics(data.metrics);

          const logs = data.recentOrders.map((o: any) => ({
            id: o.id,
            action: 'Pedido ' + o.status,
            details: `Serviço ${o.serviceTitle} no valor de ${formatCurrency(o.price)}`,
            time: new Date(o.createdAt).toLocaleDateString(),
            type: o.status === 'completed' ? 'success' : 'info'
          }));
          
          setSystemLogs(logs);
          setCandidates(data.recentUsers);
        }
      } catch (e) {} finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <span className="h-10 w-10 rounded-full border-4 border-t-cyan-500 border-white/5 animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:h-[calc(100vh-130px)] gap-5 animate-page-entrance max-w-7xl mx-auto overflow-y-auto lg:overflow-hidden pb-10 lg:pb-0 px-4 md:px-8 pt-4 md:pt-8">
      
      {/* Hero Section Premium Admin */}
      <div className="shrink-0 relative overflow-hidden rounded-3xl p-6 md:p-8 border border-red-500/10 glass-card bg-gradient-to-br from-card/60 to-background">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-red-500/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative shrink-0">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-900/50 border-2 border-red-500/30 flex items-center justify-center shadow-lg">
                <ShieldAlert className="w-8 h-8 text-red-500" />
              </div>
              <div className="absolute -bottom-2 -right-2 p-1 bg-background rounded-full">
                <div className="bg-red-500/20 p-1 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-red-500" />
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase">Sistema Central</span>
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-[9px] uppercase px-1.5 py-0">Root Access</Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-cyan-400">
                Olá, Administrador! 👑
              </h1>
            </div>
          </div>
          
          {/* Financial Integration */}
          <div className="w-full md:w-64 bg-background/50 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
            <div className="flex justify-between items-start mb-1">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Faturamento Plataforma</span>
              <TrendingUp className="w-3.5 h-3.5 text-cyan-500" />
            </div>
            <h3 className="text-2xl font-black text-cyan-400">{formatCurrency(metrics.totalRevenue)}</h3>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
              <span className="text-[10px] text-muted-foreground font-semibold">Usuários: <strong className="text-foreground">{metrics.totalUsers}</strong></span>
              <span className="text-[10px] text-muted-foreground font-semibold">Serviços: <strong className="text-foreground">{metrics.totalServices}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions (Horizontal) */}
      <div className="shrink-0 grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button onClick={() => navigate('/admin/users')} variant="outline" className="h-12 flex items-center justify-center gap-2 rounded-xl bg-card/30 hover:bg-card/50 border-white/10 text-xs font-bold">
          <Users className="w-4 h-4 text-cyan-500" /> Auditoria Usuários
        </Button>
        <Button onClick={() => navigate('/admin/services')} variant="outline" className="h-12 flex items-center justify-center gap-2 rounded-xl bg-card/30 hover:bg-card/50 border-white/10 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-green-500" /> Aprovar Técnicos
        </Button>
        <Button onClick={() => navigate('/admin/finance')} variant="outline" className="h-12 flex items-center justify-center gap-2 rounded-xl bg-card/30 hover:bg-card/50 border-white/10 text-xs font-bold">
          <DollarSign className="w-4 h-4 text-yellow-500" /> Tesouraria
        </Button>
        <Button onClick={() => toast.success('Rotina de Backup iniciada. Os dados serão salvos no Bucket.')} variant="outline" className="h-12 flex items-center justify-center gap-2 rounded-xl bg-red-950/20 hover:bg-red-900/40 border-red-500/20 text-red-400 text-xs font-bold">
          <ServerCrash className="w-4 h-4 text-red-500" /> Forçar Backup
        </Button>
      </div>

      {/* Main Single Page Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-4">
        
        {/* Left Col: Candidates Queue */}
        <div className="lg:col-span-2 flex flex-col min-h-0 space-y-3">
          <div className="shrink-0 flex justify-between items-center px-1">
            <h2 className="text-base font-bold flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-cyan-400" /> Credenciamentos Recentes
            </h2>
            <Badge className="bg-cyan-500/10 text-cyan-400 rounded-md text-[9px] font-black uppercase">
              {candidates.length} Novos
            </Badge>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {candidates.length === 0 ? (
              <div className="glass-card p-8 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center h-40">
                <Users className="w-8 h-8 text-muted-foreground opacity-50 mb-2" />
                <h4 className="text-sm font-bold">Nenhum cadastro recente</h4>
              </div>
            ) : (
              candidates.map((tech) => (
                <Card key={tech.id} className="p-4 bg-card/30 border-white/5 hover:border-cyan-500/20 transition-all rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm">{tech.name}</h4>
                      <Badge className="bg-primary/10 text-primary text-[9px] uppercase px-1.5 py-0">
                        {tech.role?.includes('professional') ? 'Técnico' : 'Cliente'}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{tech.email} • Registrado em {new Date(tech.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Button onClick={() => navigate('/admin/users')} size="sm" variant="outline" className="border-white/10 text-[10px] h-8">
                    Analisar
                  </Button>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Audit Logs */}
        <div className="flex flex-col min-h-0 space-y-3">
          <div className="shrink-0 flex items-center justify-between px-1">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-500" /> Logs do Sistema
            </h2>
          </div>
          
          <Card className="flex-1 overflow-y-auto custom-scrollbar p-5 bg-card/30 border-white/5 rounded-2xl">
            <div className="space-y-3">
              {systemLogs.length === 0 ? (
                <p className="text-[10px] text-muted-foreground text-center py-4">Sistema silencioso.</p>
              ) : (
                systemLogs.map((log) => (
                  <div key={log.id} className="relative border-l border-white/10 pl-3 pb-1">
                    <span className={`absolute -left-1 top-1.5 h-2 w-2 rounded-full ${
                      log.type === 'success' ? 'bg-green-500' :
                      log.type === 'warning' ? 'bg-yellow-500' :
                      log.type === 'error' ? 'bg-red-500' : 'bg-cyan-500'
                    }`}></span>
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="text-[10px] font-black text-foreground uppercase tracking-wide">{log.action}</h4>
                      <span className="text-[8px] text-muted-foreground shrink-0">{log.time}</span>
                    </div>
                    <p className="text-[9px] text-muted-foreground leading-relaxed">{log.details}</p>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboardPage;
