import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Cpu, LayoutDashboard, Search, ClipboardList, User, MessageSquare, LogOut, Bell } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

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
      <aside className="hidden lg:flex flex-col w-64 border-r border-foreground/5 bg-card/30 sticky top-0 h-screen">
        <div className="p-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <Cpu className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">TechFix</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path 
                ? 'bg-primary/10 text-primary font-bold' 
                : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-foreground/5">
          <Link to="/login">
            <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive">
              <LogOut className="w-5 h-5" /> Sair
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-foreground/5 bg-background/50 backdrop-blur-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
          <h2 className="font-bold text-lg hidden md:block">
            {menuItems.find(i => i.path === location.pathname)?.label || 'TechFix'}
          </h2>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
            </Button>
            <div className="flex items-center gap-3 pl-4 border-l border-foreground/5">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">Sofia Spencer</p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Cliente Nível Prata</p>
              </div>
              <img src="https://i.pravatar.cc/150?u=sofia" className="w-8 h-8 rounded-full border border-foreground/10" alt="Avatar" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>

        {/* Mobile Nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-card/80 backdrop-blur-lg border-t border-foreground/5 flex justify-around items-center h-16 px-2 z-50">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 transition-all ${
                location.pathname === item.path ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default ClientLayout;