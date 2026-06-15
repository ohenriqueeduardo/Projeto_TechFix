import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, User as UserIcon, 
  ClipboardList, Bell, Settings, LogOut, Briefcase, Search, CalendarDays, Wrench, DollarSign, Users 
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User } from '@/types';

interface UserDropdownMenuProps {
  user: User | null;
  triggerChildren?: React.ReactNode;
}

export const UserDropdownMenu: React.FC<UserDropdownMenuProps> = ({ user, triggerChildren }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (!user) return null;

  const userAvatar = user.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user.name || 'User')}`;
  const displayLevel = user.level ? `Nível ${user.level}` : (user.role === 'admin' ? 'Root' : 'Bronze');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {triggerChildren ? (
          triggerChildren
        ) : (
          <div className="flex items-center gap-4 pl-6 border-l border-foreground/5 cursor-pointer group">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold group-hover:text-primary transition-colors">{user.name}</p>
              <p className="text-[10px] text-primary font-black uppercase tracking-widest">
                {displayLevel}
              </p>
            </div>
            <div className="relative">
              <img src={userAvatar} className="w-12 h-12 rounded-2xl border-2 border-primary/20 group-hover:border-primary transition-all object-cover" alt="Avatar" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full"></div>
            </div>
          </div>
        )}
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-64 p-2 rounded-3xl glass-card border-white/10 z-50">
        <DropdownMenuLabel className="px-4 py-3">
          <p className="font-bold">Minha Conta</p>
          <p className="text-xs text-muted-foreground font-normal">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/5" />
        
        {/* CLIENT LINKS */}
        {user.role === 'client' && (
          <>
            <DropdownMenuItem onClick={() => navigate('/cliente/perfil')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
              <UserIcon className="w-4 h-4 text-primary" /> Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/cliente/dashboard')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
              <LayoutDashboard className="w-4 h-4 text-primary" /> Painel de Controle
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/cliente/busca')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
              <Search className="w-4 h-4 text-primary" /> Buscar Serviços
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/cliente/meus-pedidos')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
              <ClipboardList className="w-4 h-4 text-primary" /> Meus Pedidos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/cliente/notificacoes')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
              <Bell className="w-4 h-4 text-primary" /> Notificações
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/cliente/configuracoes')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
              <Settings className="w-4 h-4 text-primary" /> Configurações
            </DropdownMenuItem>
          </>
        )}

        {/* PROFESSIONAL LINKS */}
        {(user.role === 'professional' || user.role === 'both') && (
          <>
            <DropdownMenuItem onClick={() => navigate('/profissional/dashboard')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
              <LayoutDashboard className="w-4 h-4 text-primary" /> Painel Técnico
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/profissional/agenda')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
              <CalendarDays className="w-4 h-4 text-primary" /> Minha Agenda
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/profissional/servicos')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
              <Wrench className="w-4 h-4 text-primary" /> Meus Serviços
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/profissional/financeiro')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
              <DollarSign className="w-4 h-4 text-primary" /> Financeiro
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/profissional/configuracoes')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
              <Settings className="w-4 h-4 text-primary" /> Configurações
            </DropdownMenuItem>
            {(user.role === 'admin' || user.role === 'both') && (
              <>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem onClick={() => navigate('/cliente/dashboard')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-primary focus:text-primary bg-primary/10 focus:bg-primary/20 font-bold mb-2">
                  <UserIcon className="w-4 h-4" /> Acessar Painel Cliente
                </DropdownMenuItem>
              </>
            )}
          </>
        )}

        {/* ADMIN LINKS */}
        {user.role === 'admin' && (
          <>
            <DropdownMenuItem onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
              <LayoutDashboard className="w-4 h-4 text-primary" /> Painel Geral
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/admin/usuarios')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
              <Users className="w-4 h-4 text-primary" /> Usuários & Equipe
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/admin/servicos')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
              <Wrench className="w-4 h-4 text-primary" /> Serviços
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/admin/financas')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
              <DollarSign className="w-4 h-4 text-primary" /> Tesouraria
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/admin/configuracoes')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
              <Settings className="w-4 h-4 text-primary" /> Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem onClick={() => navigate('/cliente/dashboard')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-blue-400 focus:text-blue-400 bg-blue-500/10 focus:bg-blue-500/20 font-bold mb-2">
              <UserIcon className="w-4 h-4" /> Acessar Painel Cliente
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/profissional/dashboard')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-orange-400 focus:text-orange-400 bg-orange-500/10 focus:bg-orange-500/20 font-bold mb-2">
              <Wrench className="w-4 h-4" /> Acessar Painel Técnico
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator className="bg-white/5" />
        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="w-4 h-4" /> Sair da Conta
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
