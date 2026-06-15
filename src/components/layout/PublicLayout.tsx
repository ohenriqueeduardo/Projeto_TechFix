import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, LogIn, UserPlus, LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import logo from '@/assets/logo.png';
import { User } from '@/types';

const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [user, setUser] = useState<User | null>(null);

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

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'professional') return '/especialista';
    return '/cliente';
  };

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
              <Link to={getDashboardPath()}>
                <Button className="btn-primary gap-2 h-10 px-5 text-sm">
                  <LayoutDashboard className="w-4 h-4" /> Meu Painel
                </Button>
              </Link>
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
              <Link to={getDashboardPath()} className="flex items-center gap-3 text-lg font-bold py-2" onClick={() => setIsMenuOpen(false)}>
                <LayoutDashboard className="w-5 h-5 text-primary" /> Meu Painel
              </Link>
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