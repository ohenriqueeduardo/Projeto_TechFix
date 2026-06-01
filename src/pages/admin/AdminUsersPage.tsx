import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  UserMinus, 
  UserPlus, 
  Mail, 
  MapPin, 
  Filter,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'professional' | 'admin';
  status: 'active' | 'blocked';
  city: string;
  specialty?: string;
  avatar: string;
}

const AdminUsersPage = () => {
  const [users, setUsers] = React.useState<UserItem[]>([
    { id: 'u1', name: 'Sofia Spencer', email: 'sofia@example.com', role: 'client', status: 'active', city: 'São Paulo, SP', avatar: 'https://i.pravatar.cc/150?u=sofia' },
    { id: 'u2', name: 'Carlos Mendes', email: 'carlos@example.com', role: 'professional', status: 'active', city: 'São Paulo, SP', specialty: 'Hardware Expert', avatar: 'https://i.pravatar.cc/150?u=carlos' },
    { id: 'u3', name: 'Diego Faria', email: 'diego@example.com', role: 'professional', status: 'active', city: 'Rio de Janeiro, RJ', specialty: 'Redes & Segurança', avatar: 'https://i.pravatar.cc/150?u=diego' },
    { id: 'u4', name: 'Mariana Silva', email: 'mariana@example.com', role: 'client', status: 'active', city: 'Belo Horizonte, MG', avatar: 'https://i.pravatar.cc/150?u=mariana' },
    { id: 'u5', name: 'Rodrigo Albuquerque', email: 'rodrigo@example.com', role: 'professional', status: 'blocked', city: 'Belo Horizonte, MG', specialty: 'MacBooks', avatar: 'https://i.pravatar.cc/150?u=rodrigo' },
    { id: 'u6', name: 'Pedro Rocha', email: 'pedro@example.com', role: 'client', status: 'active', city: 'Curitiba, PR', avatar: 'https://i.pravatar.cc/150?u=pedro' }
  ]);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<'all' | 'client' | 'professional'>('all');

  const handleToggleStatus = (id: string, name: string, currentStatus: 'active' | 'blocked') => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
    
    if (newStatus === 'blocked') {
      toast.error(`Usuário ${name} foi bloqueado temporariamente da plataforma.`);
    } else {
      toast.success(`Acesso do usuário ${name} restabelecido com sucesso!`);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-10 animate-page-entrance max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-white/5 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <Users className="w-6 h-6" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest text-primary">Controle de Credenciais</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight">Gerenciamento de Usuários</h1>
        <p className="text-muted-foreground text-sm mt-1">Monitore clientes cadastrados e credenciamentos de especialistas técnicos parceiros.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="p-6 bg-card/30 border-white/5 rounded-3xl">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Clientes Registrados</p>
          <h3 className="text-2xl font-black text-primary">
            {users.filter(u => u.role === 'client').length}
          </h3>
        </Card>
        <Card className="p-6 bg-card/30 border-white/5 rounded-3xl">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Especialistas Homologados</p>
          <h3 className="text-2xl font-black text-green-500">
            {users.filter(u => u.role === 'professional').length}
          </h3>
        </Card>
        <Card className="p-6 bg-card/30 border-white/5 rounded-3xl">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Contas Bloqueadas</p>
          <h3 className="text-2xl font-black text-red-500">
            {users.filter(u => u.status === 'blocked').length}
          </h3>
        </Card>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/10 p-4 border border-white/5 rounded-3xl backdrop-blur-md">
        <div className="flex gap-2 w-full sm:w-auto">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'client', label: 'Clientes' },
            { id: 'professional', label: 'Técnicos' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setRoleFilter(btn.id as 'all' | 'client' | 'professional')}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-300 ${
                roleFilter === btn.id
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Buscar por nome, email ou cidade..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 bg-foreground/5 border border-white/5 pl-11 pr-4 rounded-xl text-xs font-medium focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredUsers.map((u) => (
          <Card key={u.id} className={`p-5 bg-card/30 border-white/5 rounded-3xl hover:border-primary/20 transition-all duration-300 relative group flex gap-4 ${u.status === 'blocked' ? 'opacity-70 border-red-500/20' : ''}`}>
            {/* Avatar Container */}
            <div className="relative shrink-0">
              <img src={u.avatar} className="w-16 h-16 rounded-2xl object-cover border border-white/10" alt={u.name} />
              <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-background ${u.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
            </div>

            {/* Info details */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base group-hover:text-primary transition-colors leading-none">{u.name}</h3>
                <Badge className={`rounded-md text-[8px] font-black uppercase ${u.role === 'professional' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                  {u.role === 'professional' ? 'Especialista' : 'Cliente'}
                </Badge>
              </div>

              {u.specialty && (
                <p className="text-[10px] text-primary font-black uppercase tracking-wider leading-none">{u.specialty}</p>
              )}

              <div className="space-y-1 text-xs text-muted-foreground font-semibold">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                  <span>{u.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                  <span>{u.city}</span>
                </div>
              </div>

              {/* Action trigger */}
              <div className="pt-2 border-t border-white/5 flex justify-end">
                {u.status === 'active' ? (
                  <Button 
                    onClick={() => handleToggleStatus(u.id, u.name, 'active')}
                    variant="ghost" 
                    size="sm" 
                    className="text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl px-3.5 h-9 gap-1"
                  >
                    <UserMinus className="w-4 h-4" /> Bloquear Acesso
                  </Button>
                ) : (
                  <Button 
                    onClick={() => handleToggleStatus(u.id, u.name, 'blocked')}
                    variant="ghost" 
                    size="sm" 
                    className="text-xs font-bold text-green-400 hover:bg-green-500/10 rounded-xl px-3.5 h-9 gap-1"
                  >
                    <UserPlus className="w-4 h-4" /> Reativar Conta
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminUsersPage;
