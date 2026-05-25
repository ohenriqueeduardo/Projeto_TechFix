import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  MessageSquare,
  LogOut,
  Bell,
  Settings,
  HelpCircle,
  Wrench,
  User,
  DollarSign
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
import logo from '@/assets/logo.png';
import logoImg from '@/assets/logo_img.png';

const ProfessionalLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = React.useState<any>(null);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/profissional/dashboard' },
    { icon: Wrench, label: 'Serviços', path: '/profissional/servicos' },
    { icon: DollarSign, label: 'Financeiro', path: '/profissional/financeiro' },
    { icon: MessageSquare, label: 'Mensagens', path: '/profissional/chat/c1' },
  ];

  const notifications = [
    { id: 1, title: "Novo Pedido de Reparo", desc: "Sofia Spencer solicitou orçamento para manutenção preventiva.", time: "5 min atrás", unread: true },
    { id: 2, title: "Orçamento Aprovado", desc: "Seu orçamento para reparo de notebook foi aceito pelo cliente.", time: "2h atrás", unread: true },
    { id: 3, title: "Pagamento Liberado", desc: "O pagamento do serviço #TF-2024 foi depositado em sua conta.", time: "1 dia atrás", unread: false },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const userAvatar = currentUser?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(currentUser?.name || 'Carlos')}`;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-24 hover:w-80 border-r border-foreground/5 bg-card/30 sticky top-0 h-screen transition-all duration-300 group/sidebar z-30 overflow-x-hidden">
        <div className="p-6 flex items-center justify-center h-28 border-b border-white/5 shrink-0">
          <Link to="/" className="flex items-center justify-center">
            {/* Logo Normal */}
            <div className="hidden group-hover/sidebar:block transition-all duration-300 animate-in fade-in zoom-in-95">
              <img src={logo} alt="TechFix Logo" className="h-16 w-auto object-contain hover:scale-105 transition-transform" />
            </div>
            {/* Logo Reduzida */}
            <div className="block group-hover/sidebar:hidden transition-all duration-300 animate-in fade-in zoom-in-95">
              <img src={logoImg} alt="TechFix Icon" className="h-12 w-12 object-contain hover:scale-105 transition-transform" />
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 select-none overflow-y-auto">
          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.25em] mb-6 px-4 whitespace-nowrap text-center group-hover/sidebar:text-left transition-all">
            <span className="hidden group-hover/sidebar:inline">Especialista</span>
            <span className="inline group-hover/sidebar:hidden">• • •</span>
          </p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-0 group-hover/sidebar:gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative overflow-hidden justify-center group-hover/sidebar:justify-start ${isActive
                    ? 'text-primary-foreground font-black shadow-lg shadow-primary/20'
                    : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
                  }`}
              >
                {/* Background pill slide simulation */}
                {isActive && (
                  <div className="absolute inset-0 bg-primary -z-10 animate-in fade-in duration-300" />
                )}
                {/* Active left indicator bar */}
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-white rounded-r-md transition-all duration-300 opacity-0 group-hover/sidebar:opacity-100" />
                )}
                <div className="w-6 h-6 flex items-center justify-center shrink-0">
                  <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} />
                </div>
                <span className="transition-all duration-300 opacity-0 w-0 overflow-hidden group-hover/sidebar:opacity-100 group-hover/sidebar:w-auto whitespace-nowrap">
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
              className={`flex items-center gap-0 group-hover/sidebar:gap-4 px-5 py-4 rounded-2xl transition-all duration-300 justify-center group-hover/sidebar:justify-start ${location.pathname === '/cliente/ajuda'
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-muted-foreground hover:bg-foreground/5'
                }`}
            >
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5 text-primary" />
              </div>
              <span className="transition-all duration-300 opacity-0 w-0 overflow-hidden group-hover/sidebar:opacity-100 group-hover/sidebar:w-auto whitespace-nowrap">
                Ajuda
              </span>
            </Link>
            <Link
              to="/cliente/configuracoes"
              className={`flex items-center gap-0 group-hover/sidebar:gap-4 px-5 py-4 rounded-2xl transition-all duration-300 justify-center group-hover/sidebar:justify-start ${location.pathname === '/cliente/configuracoes'
                  ? 'bg-primary/10 text-primary font-bold'
                  : 'text-muted-foreground hover:bg-foreground/5'
                }`}
            >
              <div className="w-6 h-6 flex items-center justify-center shrink-0">
                <Settings className="w-5 h-5 text-primary" />
              </div>
              <span className="transition-all duration-300 opacity-0 w-0 overflow-hidden group-hover/sidebar:opacity-100 group-hover/sidebar:w-auto whitespace-nowrap">
                Configurações
              </span>
            </Link>
          </div>
        </nav>

        <div className="p-6 border-t border-foreground/5 shrink-0">
          <Button onClick={handleLogout} variant="ghost" className="w-full flex items-center gap-0 group-hover/sidebar:gap-4 h-14 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all duration-300 justify-center group-hover/sidebar:justify-start">
            <div className="w-6 h-6 flex items-center justify-center shrink-0">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="transition-all duration-300 opacity-0 w-0 overflow-hidden group-hover/sidebar:opacity-100 group-hover/sidebar:w-auto whitespace-nowrap">
              Sair da Conta
            </span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-24 border-b border-foreground/5 bg-background/50 backdrop-blur-md flex items-center justify-between px-10 sticky top-0 z-40">
          <h2 className="font-bold text-2xl hidden md:block bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            Painel do Especialista
          </h2>

          <div className="flex items-center gap-6">
            <ThemeToggle />

            {/* Notifications Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative w-14 h-14 rounded-2xl bg-foreground/5 hover:bg-foreground/10 transition-all">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full border-2 border-background"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-2 rounded-3xl glass-card border-white/10">
                <DropdownMenuLabel className="px-4 py-3 text-lg font-bold">Notificações</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <div className="max-h-[400px] overflow-y-auto py-2">
                  {notifications.map((n) => (
                    <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 p-4 rounded-2xl cursor-pointer hover:bg-white/5 focus:bg-white/5 mb-1">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-sm">{n.title}</span>
                        {n.unread && <span className="w-2 h-2 bg-primary rounded-full"></span>}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{n.desc}</p>
                      <span className="text-[10px] text-muted-foreground mt-1">{n.time}</span>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-4 pl-6 border-l border-foreground/5 cursor-pointer group">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold group-hover:text-primary transition-colors">{currentUser?.name || 'Carlos Mendes'}</p>
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest">{currentUser?.specialty || 'Técnico Especialista'}</p>
                  </div>
                  <div className="relative">
                    <img src={userAvatar} className="w-14 h-14 rounded-2xl border-2 border-primary/20 group-hover:border-primary transition-all object-cover" alt="Avatar" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></div>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 rounded-3xl glass-card border-white/10">
                <DropdownMenuLabel className="px-4 py-3">
                  <p className="font-bold">Minha Conta Técnico</p>
                  <p className="text-xs text-muted-foreground font-normal">{currentUser?.email || 'carlos@example.com'}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem onClick={() => navigate('/cliente/perfil')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                  <User className="w-4 h-4 text-primary" /> Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profissional/dashboard')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                  <LayoutDashboard className="w-4 h-4 text-primary" /> Painel Técnico
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="w-4 h-4" /> Sair da Conta
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-12 overflow-y-auto">
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
                className={`flex flex-col items-center justify-center gap-1.5 p-2.5 transition-all duration-300 relative ${isActive ? 'text-primary scale-110 -translate-y-1' : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                <div className={`transition-transform duration-300 ${isActive ? 'animate-in zoom-in-75 duration-200' : ''}`}>
                  <item.icon className="w-6.5 h-6.5" />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-wider transition-all duration-300 ${isActive ? 'opacity-100 scale-100 font-bold' : 'opacity-70 scale-95'
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

export default ProfessionalLayout;
