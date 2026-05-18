import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Search, 
  ClipboardList, 
  User, 
  MessageSquare, 
  LogOut, 
  Bell,
  Settings,
  HelpCircle,
  ChevronRight,
  CreditCard,
  ShieldCheck
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

const ClientLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/cliente/dashboard' },
    { icon: Search, label: 'Explorar', path: '/cliente/servicos' },
    { icon: ClipboardList, label: 'Meus Pedidos', path: '/cliente/meus-pedidos' },
    { icon: MessageSquare, label: 'Chat', path: '/cliente/chat/1' },
  ];

  const notifications = [
    { id: 1, title: "Pedido Confirmado", desc: "Seu pedido #TF-2024 foi aceito.", time: "2 min atrás", unread: true },
    { id: 2, title: "Nova Mensagem", desc: "Carlos Mendes enviou uma mensagem.", time: "1h atrás", unread: true },
    { id: 3, title: "Serviço Concluído", desc: "Avalie o serviço de manutenção.", time: "5h atrás", unread: false },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-80 border-r border-foreground/5 bg-card/30 sticky top-0 h-screen">
        <div className="p-10">
          <Link to="/" className="flex items-center justify-center">
            <img src={logo} alt="TechFix Logo" className="h-24 w-auto object-contain hover:scale-105 transition-transform" />
          </Link>
        </div>

        <nav className="flex-1 px-8 space-y-2">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 px-4">Menu Principal</p>
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                location.pathname === item.path 
                ? 'bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20' 
                : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${location.pathname === item.path ? '' : 'text-primary'}`} />
              {item.label}
            </Link>
          ))}

          <div className="pt-10">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-6 px-4">Suporte & Ajustes</p>
            <Link to="/cliente/ajuda" className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${location.pathname === '/cliente/ajuda' ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-foreground/5'}`}>
              <HelpCircle className="w-5 h-5 text-primary" />
              Ajuda
            </Link>
            <Link to="/cliente/configuracoes" className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${location.pathname === '/cliente/configuracoes' ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-foreground/5'}`}>
              <Settings className="w-5 h-5 text-primary" />
              Configurações
            </Link>
          </div>
        </nav>

        <div className="p-8 border-t border-foreground/5">
          <Link to="/login">
            <Button variant="ghost" className="w-full justify-start gap-4 h-14 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all">
              <LogOut className="w-5 h-5" /> Sair da Conta
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-24 border-b border-foreground/5 bg-background/50 backdrop-blur-md flex items-center justify-between px-10 sticky top-0 z-40">
          <h2 className="font-bold text-2xl hidden md:block">
            {location.pathname.includes('dashboard') ? 'Dashboard' : 
             location.pathname.includes('servicos') ? 'Explorar Serviços' :
             location.pathname.includes('ajuda') ? 'Central de Ajuda' :
             location.pathname.includes('configuracoes') ? 'Configurações' : 'TechFix'}
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
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem className="justify-center p-3 text-primary font-bold text-sm cursor-pointer rounded-xl">
                  Ver todas as notificações
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-4 pl-6 border-l border-foreground/5 cursor-pointer group">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold group-hover:text-primary transition-colors">Sofia Spencer</p>
                    <p className="text-[10px] text-primary font-black uppercase tracking-widest">Nível Prata</p>
                  </div>
                  <div className="relative">
                    <img src="https://i.pravatar.cc/150?u=sofia" className="w-14 h-14 rounded-2xl border-2 border-primary/20 group-hover:border-primary transition-all" alt="Avatar" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></div>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 rounded-3xl glass-card border-white/10">
                <DropdownMenuLabel className="px-4 py-3">
                  <p className="font-bold">Minha Conta</p>
                  <p className="text-xs text-muted-foreground font-normal">sofia@example.com</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem onClick={() => navigate('/cliente/perfil')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                  <User className="w-4 h-4 text-primary" /> Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/cliente/dashboard')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                  <LayoutDashboard className="w-4 h-4 text-primary" /> Painel de Controle
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/cliente/meus-pedidos')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                  <ClipboardList className="w-4 h-4 text-primary" /> Meus Pedidos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/cliente/configuracoes')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                  <Settings className="w-4 h-4 text-primary" /> Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem onClick={() => navigate('/login')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-destructive focus:text-destructive">
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
        <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-card/80 backdrop-blur-xl border-t border-foreground/5 flex justify-around items-center h-24 px-6 z-50">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center gap-2 p-2 transition-all ${
                location.pathname === item.path ? 'text-primary scale-110' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="w-7 h-7" />
              <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default ClientLayout;