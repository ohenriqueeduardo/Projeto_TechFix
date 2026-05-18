import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, LogIn, UserPlus } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import logo from '@/assets/logo.png';

const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-foreground/5 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="TechFix Logo" className="h-12 w-auto object-contain" />
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" className="text-sm gap-2">
                <LogIn className="w-4 h-4" /> Entrar
              </Button>
            </Link>
            <Link to="/cadastro">
              <Button className="btn-primary gap-2">
                <UserPlus className="w-4 h-4" /> Começar Agora
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-background border-b border-foreground/5 p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
            <Link to="/login" className="flex items-center gap-3 text-lg font-medium py-2" onClick={() => setIsMenuOpen(false)}>
              <LogIn className="w-5 h-5 text-primary" /> Entrar
            </Link>
            <Link to="/cadastro" className="flex items-center gap-3 text-lg font-medium py-2" onClick={() => setIsMenuOpen(false)}>
              <UserPlus className="w-5 h-5 text-primary" /> Cadastrar
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-foreground/5 py-16 bg-card/30">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <img src={logo} alt="TechFix Logo" className="h-10 w-auto" />
            </div>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              A maior plataforma de serviços de TI do Brasil. Conectando você aos melhores profissionais com segurança e agilidade.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg">Plataforma</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/cliente/servicos" className="hover:text-primary transition-colors">Explorar Serviços</Link></li>
              <li><Link to="/cadastro" className="hover:text-primary transition-colors">Seja um Técnico</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Como Funciona</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6 text-lg">Suporte</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="#" className="hover:text-primary transition-colors">Central de Ajuda</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Segurança</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors">Termos de Uso</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-16 pt-8 border-t border-foreground/5 text-center text-sm text-muted-foreground">
          © 2024 TechFix Marketplace. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;