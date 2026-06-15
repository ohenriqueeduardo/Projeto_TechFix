import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Search, 
  ClipboardList, 
  User as UserIcon, 
  MessageSquare, 
  LogOut, 
  Bell,
  Settings,
  HelpCircle,
  ChevronRight,
  CreditCard,
  ShieldCheck,
  PlusCircle,
  Briefcase
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from '@/components/ThemeToggle';
import { useNotifications } from '@/context/NotificationsContext';
import { User } from '@/types';
import logo from '@/assets/logo.png';
import logoImg from '@/assets/logo_img.png';

const ClientLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser(parsedUser);
      
      // Block professionals from accessing client-only service creation routes
      if (parsedUser.role === 'professional') {
        if (location.pathname === '/cliente/novo-servico' || location.pathname.startsWith('/cliente/contratar')) {
          navigate('/profissional/dashboard');
        }
      }
    } else {
      navigate('/login');
    }
  }, [location.pathname, navigate]);
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/cliente/dashboard' },
    { icon: Search, label: 'Explorar Serviços', path: '/cliente/servicos' },
    ...(currentUser?.role !== 'professional' ? [{ icon: PlusCircle, label: 'Solicitar Serviço', path: '/cliente/novo-servico' }] : []),
    { icon: ClipboardList, label: 'Meus Pedidos', path: '/cliente/meus-pedidos' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const userAvatar = currentUser?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(currentUser?.name || 'Sofia')}`;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-24 hover:w-80 border-r border-foreground/5 bg-card/30 sticky top-0 h-screen transition-all duration-300 group/sidebar z-30 overflow-x-hidden no-scrollbar">
        <div className="flex items-center justify-center h-28 border-b border-white/5 shrink-0 relative px-0">
          <Link to="/" className="flex items-center justify-center relative w-14 group-hover/sidebar:w-full h-16 transition-all duration-300">
            {/* Logo Normal */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-90 pointer-events-none group-hover/sidebar:opacity-100 group-hover/sidebar:scale-100 group-hover/sidebar:pointer-events-auto transition-all duration-300">
              <img src={logo} alt="TechFix Logo" className="h-16 w-auto object-contain hover:scale-105 transition-transform" />
            </div>
            {/* Logo Reduzida */}
            <div className="absolute inset-0 flex items-center justify-center opacity-100 scale-100 pointer-events-auto group-hover/sidebar:opacity-0 group-hover/sidebar:scale-90 group-hover/sidebar:pointer-events-none transition-all duration-300">
              <img src={logoImg} alt="TechFix Icon" className="h-12 w-12 object-contain hover:scale-105 transition-transform" />
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 select-none overflow-y-auto no-scrollbar flex flex-col items-center group-hover/sidebar:items-stretch">
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.25em] mb-6 px-0 group-hover/sidebar:px-5 whitespace-nowrap text-center group-hover/sidebar:text-left transition-all">
            <span className="hidden group-hover/sidebar:inline">Menu Principal</span>
            <span className="inline group-hover/sidebar:hidden">• • •</span>
          </p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex items-center gap-0 group-hover/sidebar:gap-4 w-14 group-hover/sidebar:w-full h-14 rounded-2xl transition-all duration-300 group relative overflow-hidden justify-center group-hover/sidebar:justify-start px-0 group-hover/sidebar:px-5 shrink-0 ${
                  isActive 
                  ? 'text-primary-foreground font-black shadow-lg shadow-primary/20' 
                  : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
                }`}
              >
                {/* Background pill slide simulation */}
                {isActive && (
                  <div className="absolute inset-0 bg-primary -z-10 animate-in fade-in duration-300" />
                )}
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
                </div>
                <span className="transition-all duration-300 opacity-0 max-w-0 overflow-hidden group-hover/sidebar:opacity-100 group-hover/sidebar:max-w-xs whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          })}

          <div className="pt-10">
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.25em] mb-6 px-4 whitespace-nowrap text-center group-hover/sidebar:text-left transition-all">
              <span className="hidden group-hover/sidebar:inline">Suporte & Ajustes</span>
              <span className="inline group-hover/sidebar:hidden">• • •</span>
            </p>
            <Link 
              to="/cliente/ajuda" 
              className={`flex items-center gap-0 group-hover/sidebar:gap-4 w-14 group-hover/sidebar:w-full h-14 rounded-2xl transition-all duration-300 justify-center group-hover/sidebar:justify-start px-0 group-hover/sidebar:px-5 shrink-0 ${
                location.pathname === '/cliente/ajuda' 
                ? 'bg-primary/10 text-primary font-bold' 
                : 'text-muted-foreground hover:bg-foreground/5'
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5 text-primary" />
              </div>
              <span className="transition-all duration-300 opacity-0 max-w-0 overflow-hidden group-hover/sidebar:opacity-100 group-hover/sidebar:max-w-xs whitespace-nowrap">
                Ajuda
              </span>
            </Link>
            <Link 
              to="/cliente/configuracoes" 
              className={`flex items-center gap-0 group-hover/sidebar:gap-4 w-14 group-hover/sidebar:w-full h-14 rounded-2xl transition-all duration-300 justify-center group-hover/sidebar:justify-start px-0 group-hover/sidebar:px-5 shrink-0 ${
                location.pathname === '/cliente/configuracoes' 
                ? 'bg-primary/10 text-primary font-bold' 
                : 'text-muted-foreground hover:bg-foreground/5'
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <span className="transition-all duration-300 opacity-0 max-w-0 overflow-hidden group-hover/sidebar:opacity-100 group-hover/sidebar:max-w-xs whitespace-nowrap">
                Configurações
              </span>
            </Link>
          </div>
        </nav>

        <div className="p-6 border-t border-foreground/5 shrink-0 flex justify-center group-hover/sidebar:block px-0 group-hover/sidebar:p-6 transition-all duration-300">
          <Button onClick={handleLogout} variant="ghost" className="w-14 group-hover/sidebar:w-full h-14 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all duration-300 flex items-center justify-center group-hover/sidebar:justify-start px-0 group-hover/sidebar:px-5 gap-0 group-hover/sidebar:gap-4 shrink-0">
            <div className="w-6 h-6 flex items-center justify-center shrink-0">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="transition-all duration-300 opacity-0 max-w-0 overflow-hidden group-hover/sidebar:opacity-100 group-hover/sidebar:max-w-xs whitespace-nowrap">
              Sair da Conta
            </span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-24 border-b border-foreground/5 bg-background/50 backdrop-blur-xl flex items-center justify-between px-10 sticky top-0 z-40">
          <h2 className="font-bold text-2xl hidden md:block bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 animate-in fade-in duration-300">
            {(() => {
              const path = location.pathname;
              if (path.includes('/cliente/dashboard')) return 'Painel de Controle';
              if (path.includes('/cliente/servicos')) return 'Explorar Serviços';
              if (path.includes('/cliente/busca')) return 'Busca de Serviços';
              if (path.includes('/cliente/niveis')) return 'Níveis & Recompensas';
              if (path.includes('/cliente/servico/')) return 'Detalhes do Serviço';
              if (path.includes('/cliente/profissional')) return 'Perfil do Especialista';
              if (path.includes('/cliente/pedido/') && path.includes('/pagamento')) return 'Pagamento da Contraproposta';
              if (path.includes('/cliente/contratar')) return 'Contratação Segura';
              if (path.includes('/cliente/meus-pedidos')) return 'Meus Pedidos';
              if (path.includes('/cliente/perfil')) return 'Meu Perfil';
              if (path.includes('/cliente/configuracoes')) return 'Configurações de Conta';
              if (path.includes('/cliente/ajuda')) return 'Central de Ajuda';
              if (path.includes('/cliente/configuracoes')) return 'Configurações';
              if (path.includes('/status')) return 'Status do Chamado';
              if (path.includes('/cliente/novo-servico')) return 'Novo Pedido';
              if (path.includes('/notificacoes') || path.includes('/cliente/notificacoes')) return 'Notificações';
              return 'TechFix';
            })()}
          </h2>
          
          <div className="flex items-center gap-6">
            <ThemeToggle />
            
            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative w-14 h-14 rounded-2xl bg-foreground/5 hover:bg-foreground/10 transition-all">
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full border-2 border-background animate-pulse"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-2 rounded-3xl glass-card border-white/10 z-50">
                <div className="flex justify-between items-center px-4 py-3">
                  <DropdownMenuLabel className="p-0 text-lg font-bold">Notificações</DropdownMenuLabel>
                  {unreadCount > 0 && (
                    <button 
                      onClick={() => markAllAsRead()} 
                      className="text-[10px] text-primary hover:underline font-bold"
                    >
                      Ler todas
                    </button>
                  )}
                </div>
                <DropdownMenuSeparator className="bg-white/5" />
                <div className="max-h-[300px] overflow-y-auto py-2">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-muted-foreground">
                      Sem novas notificações
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <DropdownMenuItem 
                        key={n.id} 
                        onClick={() => {
                          markAsRead(n.id);
                          navigate('/cliente/notificacoes');
                        }}
                        className={`flex flex-col items-start gap-1 p-4 rounded-2xl cursor-pointer hover:bg-white/5 focus:bg-white/5 mb-1 ${
                          n.unread ? 'bg-primary/5' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className={`text-sm ${n.unread ? 'font-black text-foreground' : 'font-bold text-muted-foreground'}`}>{n.title}</span>
                          {n.unread && <span className="w-2 h-2 bg-primary rounded-full shrink-0"></span>}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{n.desc}</p>
                        <span className="text-[10px] text-muted-foreground mt-1">{n.time}</span>
                      </DropdownMenuItem>
                    ))
                  )}
                </div>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem 
                  onClick={() => navigate('/cliente/notificacoes')}
                  className="justify-center p-3 text-primary font-bold text-sm cursor-pointer rounded-xl"
                >
                  Ver todas as notificações
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-4 pl-6 border-l border-foreground/5 cursor-pointer group">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold group-hover:text-primary transition-colors">{currentUser?.name || 'Sofia Spencer'}</p>
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest">{currentUser?.level ? `Nível ${currentUser.level}` : 'Nível Bronze'}</p>
                  </div>
                  <div className="relative">
                    <img src={userAvatar} className="w-14 h-14 rounded-2xl border-2 border-primary/20 group-hover:border-primary transition-all object-cover" alt="Avatar" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></div>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 rounded-3xl glass-card border-white/10 z-50">
                <DropdownMenuLabel className="px-4 py-3">
                  <p className="font-bold">Minha Conta</p>
                  <p className="text-xs text-muted-foreground font-normal">{currentUser?.email || 'sofia@example.com'}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
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
                <DropdownMenuSeparator className="bg-white/5" />
                {(currentUser?.role === 'admin' || currentUser?.role === 'both' || currentUser?.role === 'professional') && (
                  <DropdownMenuItem onClick={() => navigate('/profissional/dashboard')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-blue-400 focus:text-blue-400 bg-blue-500/10 focus:bg-blue-500/20 font-bold mb-2">
                    <Briefcase className="w-4 h-4" /> Acessar Painel Técnico
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4" /> Sair da Conta
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
 
        <main className="flex-1 p-10 md:p-16">
          <Outlet />
        </main>

        {/* Mobile Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-card/85 backdrop-blur-xl border-t border-foreground/5 flex justify-around items-center h-24 px-6 z-50 shadow-2xl">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1.5 p-2.5 transition-all duration-300 relative ${
                  isActive ? 'text-primary scale-110 -translate-y-1' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <div className={`transition-transform duration-300 ${isActive ? 'animate-in zoom-in-75 duration-200' : ''}`}>
                  <item.icon className="w-6.5 h-6.5" />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-wider transition-all duration-300 ${
                  isActive ? 'opacity-100 scale-100 font-bold' : 'opacity-70 scale-95'
                }`}>
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.6)]"></span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default ClientLayout;