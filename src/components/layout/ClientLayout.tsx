import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
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
  HelpCircle
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import logo from '@/assets/logo.png';

const ClientLayout = () => {
  const location = useLocation();
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/cliente/dashboard' },
    { icon: Search, label: 'Explorar', path: '/cliente/servicos' },
    { icon: ClipboardList, label: 'Meus Pedidos', path: '/cliente/meus-pedidos' },
    { icon: MessageSquare, label: 'Chat', path: '/cliente/chat/1' },
    { icon: User, label: 'Perfil', path: '/cliente/perfil' },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-foreground/5 bg-card/30 sticky top-0 h-screen">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="TechFix Logo" className="h-10 w-auto object-contain" />
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 px-4">Menu Principal</p>
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${
                location.pathname === item.path 
                ? 'bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20' 
                : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${location.pathname === item.path ? '' : 'text-primary'}`} />
              {item.label}
            </Link>
          ))}

          <div className="pt-8">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4 px-4">Suporte</p>
            <Link to="#" className="flex items-center gap-4 px-4 py-4 rounded-2xl text-muted-foreground hover:bg-foreground/5 hover:text-foreground transition-all">
              <HelpCircle className="w-5 h-5 text-primary" />
              Ajuda
            </Link>
            <Link to="#" className="flex items-center gap-4 px-4 py-4 rounded-2xl text-muted-foreground hover:bg-foreground/5 hover:text-foreground transition-all">
              <Settings className="w-5 h-5 text-primary" />
              Configurações
            </Link>
          </div>
        </nav>

        <div className="p-6 border-t border-foreground/5">
          <Link to="/login">
            <Button variant="ghost" className="w-full justify-start gap-4 h-14 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-all">
              <LogOut className="w-5 h-5" /> Sair da Conta
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-foreground/5 bg-background/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
          <h2 className="font-bold text-xl hidden md:block">
            {menuItems.find(i => i.path === location.pathname)?.label || 'TechFix'}
          </h2>
          
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative w-12 h-12 rounded-2xl bg-foreground/5 hover:bg-foreground/10 transition-all">
              <Bell className="w-6 h-6" />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background"></span>
            </Button>
            <div className="flex items-center gap-4 pl-6 border-l border-foreground/5">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">Sofia Spencer</p>
                <p className="text-[10px] text-primary font-black uppercase tracking-widest">Nível Prata</p>
              </div>
              <div className="relative group cursor-pointer">
                <img src="https://i.pravatar.cc/150?u=sofia" className="w-12 h-12 rounded-2xl border-2 border-primary/20 group-hover:border-primary transition-all" alt="Avatar" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 md:p-12">
          <Outlet />
        </main>

        {/* Mobile Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-card/80 backdrop-blur-xl border-t border-foreground/5 flex justify-around items-center h-20 px-4 z-50">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center gap-1.5 p-2 transition-all ${
                location.pathname === item.path ? 'text-primary scale-110' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default ClientLayout;