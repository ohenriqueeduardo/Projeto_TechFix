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
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface ProfessionalData {
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  idDocumentUrl: string | null;
  selfieUrl: string | null;
  specialty: string;
  city: string;
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'blocked';
  professionalData?: ProfessionalData;
  avatar: string;
}

const AdminUsersPage = () => {
  const [users, setUsers] = React.useState<UserItem[]>([]);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<'all' | 'client' | 'professional'>('all');
  const [verificationModalOpen, setVerificationModalOpen] = React.useState(false);
  const [selectedUserForVerification, setSelectedUserForVerification] = React.useState<UserItem | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        const mappedUsers = data.map((u: { id: string; name: string; email: string; role: string; status?: string; avatar?: string; professionalProfile?: { verificationStatus: "unverified" | "pending" | "verified" | "rejected"; idDocumentUrl: string | null; selfieUrl: string | null; specialty: string; city: string; } }): UserItem => ({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          status: 'active', // Placeholder until blocked status is added to schema
          avatar: u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}`,
          professionalData: u.professionalProfile ? {
            verificationStatus: u.professionalProfile.verificationStatus,
            idDocumentUrl: u.professionalProfile.idDocumentUrl,
            selfieUrl: u.professionalProfile.selfieUrl,
            specialty: u.professionalProfile.specialty,
            city: u.professionalProfile.city
          } : undefined
        }));
        setUsers(mappedUsers);
      }
    } catch (e) {
      console.error('Failed to load users:', e);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const openVerificationModal = (user: UserItem) => {
    setSelectedUserForVerification(user);
    setVerificationModalOpen(true);
  };

  const closeVerificationModal = () => {
    setSelectedUserForVerification(null);
    setVerificationModalOpen(false);
  };

  const handleApproveVerification = async () => {
    if (selectedUserForVerification) {
      try {
        await fetch(`/api/admin/users/${selectedUserForVerification.id}/verify`, { method: 'POST' });
        toast.success(`Conta de ${selectedUserForVerification.name} aprovada e verificada com sucesso!`);
        fetchUsers();
        closeVerificationModal();
      } catch (e) {
        toast.error('Erro ao aprovar.');
      }
    }
  };

  const handleRejectVerification = async () => {
    if (selectedUserForVerification) {
      try {
        await fetch(`/api/admin/users/${selectedUserForVerification.id}/reject`, { method: 'POST' });
        toast.error(`Documentos de ${selectedUserForVerification.name} foram rejeitados.`);
        fetchUsers();
        closeVerificationModal();
      } catch (e) {
        toast.error('Erro ao rejeitar.');
      }
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja EXCLUIR o usuário ${name} do sistema? Esta ação é irreversível.`)) {
      try {
        await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
        toast.success(`Usuário ${name} excluído do sistema.`);
        fetchUsers();
      } catch (e) {
        toast.error('Erro ao excluir usuário.');
      }
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.professionalData?.city || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const isProfessional = u.role.includes('professional');
    const matchesRole = roleFilter === 'all' || (roleFilter === 'professional' ? isProfessional : !isProfessional);
    return matchesSearch && matchesRole;
  });

  if (isLoading) return <div className="p-12 text-center">Carregando usuários...</div>;

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
        <Card className="p-6 glass-card rounded-3xl hover-card-service animate-fade-in-scale" style={{animationDelay: '50ms'}}>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Clientes Registrados</p>
          <h3 className="text-2xl font-black text-primary">
            {users.filter(u => !u.role.includes('professional') && !u.role.includes('admin')).length}
          </h3>
        </Card>
        <Card className="p-6 glass-card rounded-3xl hover-card-service animate-fade-in-scale" style={{animationDelay: '150ms'}}>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Especialistas</p>
          <h3 className="text-2xl font-black text-green-500">
            {users.filter(u => u.role.includes('professional')).length}
          </h3>
        </Card>
        <Card className="p-6 glass-card rounded-3xl hover-card-service animate-fade-in-scale" style={{animationDelay: '250ms'}}>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Aguardando Avaliação</p>
          <h3 className="text-2xl font-black text-orange-500">
            {users.filter(u => u.professionalData?.verificationStatus === 'pending').length}
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
              <img src={u.avatar} className="w-16 h-16 rounded-2xl object-cover border border-white/10 bg-black/50" alt={u.name} />
              <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-background bg-green-500`} />
            </div>

            {/* Info details */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base group-hover:text-primary transition-colors leading-none">{u.name}</h3>
                {u.role.includes('admin') && <Badge className="bg-red-500/10 text-red-500 border-red-500/20 text-[8px] font-black uppercase">Admin</Badge>}
                <Badge className={`rounded-md text-[8px] font-black uppercase ${u.role.includes('professional') ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                  {u.role.includes('professional') ? 'Especialista' : 'Cliente'}
                </Badge>
                {u.professionalData?.verificationStatus === 'verified' && (
                  <div title="Verificado" className="flex items-center">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                  </div>
                )}
                {u.professionalData?.verificationStatus === 'pending' && (
                  <Badge variant="outline" className="text-[8px] font-black border-orange-500/50 text-orange-500 bg-orange-500/10">Aguardando Avaliação</Badge>
                )}
              </div>

              {u.professionalData?.specialty && (
                <p className="text-[10px] text-primary font-black uppercase tracking-wider leading-none">{u.professionalData.specialty}</p>
              )}

              <div className="space-y-1 text-xs text-muted-foreground font-semibold">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                  <span>{u.email}</span>
                </div>
                {u.professionalData?.city && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                    <span>{u.professionalData.city}</span>
                  </div>
                )}
              </div>

              {/* Action trigger */}
              <div className="pt-2 border-t border-white/5 flex justify-end gap-2">
                {u.professionalData?.verificationStatus === 'pending' && (
                  <Button 
                    onClick={() => openVerificationModal(u)}
                    variant="outline" 
                    size="sm" 
                    className="text-xs font-bold border-primary text-primary hover:bg-primary/10 rounded-xl px-3.5 h-9"
                  >
                    Analisar Docs
                  </Button>
                )}
                <Button 
                  onClick={() => handleDeleteUser(u.id, u.name)}
                  variant="ghost" 
                  size="sm" 
                  className="text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl px-3.5 h-9 gap-1"
                >
                  <UserMinus className="w-4 h-4" /> Excluir
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Identity Verification Modal */}
      <Dialog open={verificationModalOpen} onOpenChange={(open) => { if(!open) closeVerificationModal(); }}>
        <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden rounded-3xl border-white/10 glass-card">
          {selectedUserForVerification && selectedUserForVerification.professionalData && (
            <>
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="font-black text-lg">Revisão de Identidade</DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground pt-1">Especialista: {selectedUserForVerification.name}</DialogDescription>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Documento</span>
                    <div className="w-full bg-slate-800 rounded-2xl border border-white/5 overflow-hidden relative flex items-center justify-center min-h-48">
                      {selectedUserForVerification.professionalData.idDocumentUrl ? (
                        <img src={selectedUserForVerification.professionalData.idDocumentUrl} alt="Document" className="w-full h-auto object-contain max-h-[300px]" />
                      ) : (
                        <p className="text-xs text-muted-foreground">Nenhuma imagem</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Selfie de Validação</span>
                    <div className="w-full bg-slate-800 rounded-2xl border border-white/5 overflow-hidden relative flex items-center justify-center min-h-48">
                      {selectedUserForVerification.professionalData.selfieUrl ? (
                        <img src={selectedUserForVerification.professionalData.selfieUrl} alt="Selfie" className="w-full h-auto object-contain max-h-[300px]" />
                      ) : (
                        <p className="text-xs text-muted-foreground">Nenhuma imagem</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-orange-600 dark:text-orange-200/80 leading-relaxed font-medium">
                    Verifique se o rosto na selfie corresponde à foto do documento e se os dados estão legíveis. A aprovação desta conta liberará o selo oficial de Especialista Verificado na plataforma.
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 bg-muted/30 flex justify-end gap-3">
                <Button onClick={handleRejectVerification} variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-500/10 font-bold rounded-xl">
                  Rejeitar Documentos
                </Button>
                <Button onClick={handleApproveVerification} className="btn-primary font-black gap-2 rounded-xl">
                  <CheckCircle className="w-4 h-4" /> Aprovar e Verificar
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsersPage;
