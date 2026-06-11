import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench, 
  Check, 
  X, 
  CheckCircle, 
  Clock, 
  Calendar, 
  MapPin, 
  Search,
  Filter,
  AlertCircle
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';

const ProfessionalServicesPage = () => {
  const [orders, setOrders] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<'all' | 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (!storedUser || !token) return;
        
        const user = JSON.parse(storedUser);
        const response = await fetch(`/api/orders?professionalId=${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');

      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      
      if (newStatus === 'scheduled') {
        toast.success('Serviço agendado e aceito com sucesso!');
      } else if (newStatus === 'in_progress') {
        toast.info('Serviço iniciado! Mãos à obra.');
      } else if (newStatus === 'completed') {
        toast.success('Serviço marcado como concluído! Pagamento enviado para sua conta.');
      } else if (newStatus === 'cancelled') {
        toast.error('Serviço recusado ou cancelado.');
      }
    } catch (error) {
      toast.error('Erro ao atualizar status do serviço.');
      console.error(error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    const matchesSearch = 
      order.serviceTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

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
    <div className="space-y-10 animate-page-entrance max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-white/5 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <Wrench className="w-6 h-6" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-primary">Controle Operacional</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight">Meus Serviços e Ordens</h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie a fila de reparos, aceite novas solicitações e finalize trabalhos agendados.</p>
      </div>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-card/10 p-4 border border-white/5 rounded-3xl backdrop-blur-md">
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'pending', label: 'Pendentes' },
            { id: 'scheduled', label: 'Agendados' },
            { id: 'in_progress', label: 'Em Progresso' },
            { id: 'completed', label: 'Concluídos' },
            { id: 'cancelled', label: 'Cancelados' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'all' | 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
                activeTab === tab.id 
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' 
                : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por serviço, cliente ou código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 bg-foreground/5 border border-white/5 pl-11 pr-4 rounded-xl text-xs font-medium focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* Services Fila */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="p-6 bg-card/30 border-white/5 rounded-3xl hover:border-primary/20 transition-all duration-300 relative overflow-hidden group">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-4 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{order.code}</span>
                    {getStatusBadge(order.status)}
                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider bg-white/5 px-2.5 py-0.5 rounded-md">
                      Paga via {order.paymentMethod.toUpperCase()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-300">
                      {order.serviceTitle}
                    </h3>
                    <p className="text-xs text-muted-foreground font-semibold mt-1">
                      Cliente: <span className="text-foreground">{order.clientName}</span>
                    </p>
                  </div>

                  {/* Operational Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary shrink-0" />
                      <span>{order.date} às {order.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground sm:col-span-2">
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      <span className="line-clamp-1">{order.address}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:items-end justify-between gap-4 shrink-0 pt-4 lg:pt-0 border-t lg:border-0 border-white/5">
                  <div className="text-left lg:text-right">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">Honorários do Especialista</p>
                    <p className="text-2xl font-black text-primary mt-0.5">{formatCurrency(order.price)}</p>
                  </div>

                  {/* Actions Area */}
                  <div className="flex gap-2 w-full lg:w-auto">
                    {order.status === 'pending' && (
                      <>
                        <Button 
                          onClick={() => handleStatusChange(order.id, 'scheduled')}
                          size="sm" 
                          className="bg-green-600 hover:bg-green-500 text-white rounded-xl text-xs gap-1.5 h-10 px-4"
                        >
                          <Check className="w-4 h-4" /> Aceitar Reparo
                        </Button>
                        <Button 
                          onClick={() => handleStatusChange(order.id, 'cancelled')}
                          size="sm" 
                          variant="outline" 
                          className="border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-xl text-xs h-10 px-3"
                        >
                          <X className="w-4 h-4" /> Recusar
                        </Button>
                      </>
                    )}

                    {order.status === 'scheduled' && (
                      <Button 
                        onClick={() => handleStatusChange(order.id, 'in_progress')}
                        size="sm" 
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl text-xs gap-1.5 h-10 px-6 w-full sm:w-auto"
                      >
                        <Clock className="w-4 h-4" /> Iniciar Atendimento
                      </Button>
                    )}

                    {order.status === 'in_progress' && (
                      <Button 
                        onClick={() => handleStatusChange(order.id, 'completed')}
                        size="sm" 
                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl text-xs gap-1.5 h-10 px-6 w-full sm:w-auto"
                      >
                        <CheckCircle className="w-4 h-4" /> Concluir Serviço
                      </Button>
                    )}

                    {order.status === 'completed' && (
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20 py-2 px-4 rounded-xl text-xs font-bold gap-1.5">
                        <Check className="w-4 h-4" /> Concluído com Sucesso
                      </Badge>
                    )}

                    {order.status === 'cancelled' && (
                      <Badge className="bg-red-500/10 text-red-500 border-red-500/20 py-2 px-4 rounded-xl text-xs font-bold gap-1.5">
                        <AlertCircle className="w-4 h-4" /> Serviço Cancelado
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center bg-card/10 border-white/5 rounded-3xl">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <h3 className="font-bold text-lg">Nenhum serviço encontrado</h3>
          <p className="text-muted-foreground text-xs mt-1">Tente ajustar seus filtros ou termos de pesquisa.</p>
        </Card>
      )}
    </div>
  );
};

export default ProfessionalServicesPage;
