import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu, X, LogIn, UserPlus, LayoutDashboard, User as UserIcon, 
  ClipboardList, Bell, Settings, LogOut, Briefcase 
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
import { User } from '@/types';

const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user session', e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'professional') return '/especialista';
    return '/cliente/dashboard';
  };

  const userAvatar = user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(user?.name || 'User')}`;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header Fixo Reduzido */}
      <header className="fixed top-0 left-0 z-50 w-full border-b border-foreground/5 bg-background/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="TechFix Logo" className="h-10 w-auto object-contain hover:scale-105 transition-transform" />
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-4 pl-6 border-l border-foreground/5 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold group-hover:text-primary transition-colors">{user.name || 'Usuário'}</p>
                      <p className="text-[10px] text-primary font-black uppercase tracking-widest">
                        {user.level ? `Nível ${user.level}` : (user.role === 'admin' ? 'Root' : 'Bronze')}
                      </p>
                    </div>
                    <div className="relative">
                      <img src={userAvatar} className="w-12 h-12 rounded-2xl border-2 border-primary/20 group-hover:border-primary transition-all object-cover" alt="Avatar" />
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full"></div>
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 rounded-3xl glass-card border-white/10 z-50">
                  <DropdownMenuLabel className="px-4 py-3">
                    <p className="font-bold">Minha Conta</p>
                    <p className="text-xs text-muted-foreground font-normal">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/5" />
                  
                  <DropdownMenuItem onClick={() => navigate(getDashboardPath())} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                    <LayoutDashboard className="w-4 h-4 text-primary" /> Meu Painel
                  </DropdownMenuItem>
                  
                  {user.role !== 'admin' && (
                    <DropdownMenuItem onClick={() => navigate('/cliente/perfil')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                      <UserIcon className="w-4 h-4 text-primary" /> Perfil
                    </DropdownMenuItem>
                  )}
                  
                  {user.role === 'client' && (
                    <DropdownMenuItem onClick={() => navigate('/cliente/meus-pedidos')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                      <ClipboardList className="w-4 h-4 text-primary" /> Meus Pedidos
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem onClick={() => navigate(user.role === 'admin' ? '/admin/configuracoes' : '/cliente/configuracoes')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer">
                    <Settings className="w-4 h-4 text-primary" /> Configurações
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="bg-white/5" />
                  {user.role?.includes('professional') && (
                    <DropdownMenuItem onClick={() => navigate('/profissional/dashboard')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-blue-400 focus:text-blue-400 bg-blue-500/10 focus:bg-blue-500/20 font-bold mb-2">
                      <Briefcase className="w-4 h-4" /> Acessar Painel Técnico
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="w-4 h-4" /> Sair da Conta
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="text-sm font-bold gap-2 h-10 px-4 border-primary/20 hover:border-primary/50 text-foreground bg-foreground/5 hover:bg-foreground/10 transition-all rounded-xl">
                    <LogIn className="w-4 h-4 text-primary" /> Entrar
                  </Button>
                </Link>
                <Link to="/cadastro">
                  <Button className="btn-primary gap-2 h-10 px-5 text-sm">
                    <UserPlus className="w-4 h-4" /> Começar Agora
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Compacto */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b border-foreground/5 p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300 z-50">
            {user ? (
              <>
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
                  <img src={userAvatar} className="w-10 h-10 rounded-xl" alt="Avatar" />
                  <div>
                    <p className="font-bold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Link to={getDashboardPath()} className="flex items-center gap-3 text-lg font-bold py-2" onClick={() => setIsMenuOpen(false)}>
                  <LayoutDashboard className="w-5 h-5 text-primary" /> Meu Painel
                </Link>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center gap-3 text-lg font-bold py-2 text-destructive">
                  <LogOut className="w-5 h-5" /> Sair
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-3 text-lg font-bold py-2" onClick={() => setIsMenuOpen(false)}>
                  <LogIn className="w-5 h-5 text-primary" /> Entrar
                </Link>
                <Link to="/cadastro" className="flex items-center gap-3 text-lg font-bold py-2" onClick={() => setIsMenuOpen(false)}>
                  <UserPlus className="w-5 h-5 text-primary" /> Cadastrar
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* Espaçamento Ajustado para o Header Reduzido */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>

      {/* Footer Compacto com Seções e Links Reais */}
      <footer className="border-t border-foreground/5 py-8 bg-card/30 mt-auto">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-black mb-4 text-xs uppercase tracking-widest text-primary">Sobre a TechFix</h4>
            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
              A maior plataforma de serviços de TI do Brasil. Conectando você aos melhores especialistas com total transparência e garantia.
            </p>
          </div>
          <div>
            <h4 className="font-black mb-4 text-xs uppercase tracking-widest text-primary">Plataforma</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link to="/login" className="hover:text-primary transition-colors font-bold">Solicitar Serviço</Link></li>
              <li><Link to="/seja-um-tecnico" className="hover:text-primary transition-colors font-bold">Seja um Técnico</Link></li>
              <li><Link to="/como-funciona" className="hover:text-primary transition-colors font-bold">Como Funciona</Link></li>
              <li><Link to="/categorias" className="hover:text-primary transition-colors font-bold">Ver Categorias</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-4 text-xs uppercase tracking-widest text-primary">Segurança</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link to="/pagamento-protegido" className="hover:text-primary transition-colors font-bold">Pagamento Protegido</Link></li>
              <li><Link to="/especialistas-verificados" className="hover:text-primary transition-colors font-bold">Especialistas Verificados</Link></li>
              <li><Link to="/garantia-satisfacao" className="hover:text-primary transition-colors font-bold">Garantia de Satisfação</Link></li>
              <li><Link to="/seguranca" className="hover:text-primary transition-colors font-bold">Segurança e LGPD</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-4 text-xs uppercase tracking-widest text-primary">Suporte & Termos</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link to="/cliente/ajuda" className="hover:text-primary transition-colors font-bold">Central de Ajuda</Link></li>
              <li><Link to="/termos-de-uso" className="hover:text-primary transition-colors font-bold">Termos de Uso</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Logo Centralizada no final com Copyright */}
        <div className="container mx-auto px-4 mt-8 pt-6 border-t border-foreground/5 flex flex-col items-center gap-3 text-center text-[11px] text-muted-foreground font-bold">
          <Link to="/">
            <img src={logo} alt="TechFix Logo" className="h-8 w-auto opacity-75 hover:opacity-100 transition-opacity" />
          </Link>
          <div>© 2026 TechFix Marketplace. Todos os direitos reservados.</div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;