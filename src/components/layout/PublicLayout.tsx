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
        <div className="container mx-auto px-4 h-24 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="TechFix Logo" className="h-16 w-auto object-contain hover:scale-105 transition-transform" />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" className="text-base font-bold gap-2 h-12 px-6">
                <LogIn className="w-5 h-5" /> Entrar
              </Button>
            </Link>
            <Link to="/cadastro">
              <Button className="btn-primary gap-2 h-12 px-8 text-base">
                <UserPlus className="w-5 h-5" /> Começar Agora
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
          <div className="md:hidden absolute top-24 left-0 w-full bg-background border-b border-foreground/5 p-8 flex flex-col gap-6 animate-in slide-in-from-top duration-300 z-50">
            <Link to="/login" className="flex items-center gap-4 text-xl font-black py-2" onClick={() => setIsMenuOpen(false)}>
              <LogIn className="w-6 h-6 text-primary" /> Entrar
            </Link>
            <Link to="/cadastro" className="flex items-center gap-4 text-xl font-black py-2" onClick={() => setIsMenuOpen(false)}>
              <UserPlus className="w-6 h-6 text-primary" /> Cadastrar
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-foreground/5 py-20 bg-card/30">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-8">
              <img src={logo} alt="TechFix Logo" className="h-14 w-auto" />
            </div>
            <p className="text-muted-foreground max-w-sm leading-relaxed text-lg">
              A maior plataforma de serviços de TI do Brasil. Conectando você aos melhores profissionais com segurança e agilidade.
            </p>
          </div>
          <div>
            <h4 className="font-black mb-8 text-xl uppercase tracking-widest">Plataforma</h4>
            <ul className="space-y-4 text-base text-muted-foreground">
              <li><Link to="/cliente/servicos" className="hover:text-primary transition-colors font-bold">Explorar Serviços</Link></li>
              <li><Link to="/cadastro" className="hover:text-primary transition-colors font-bold">Seja um Técnico</Link></li>
              <li><Link to="/cliente/ajuda" className="hover:text-primary transition-colors font-bold">Como Funciona</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-8 text-xl uppercase tracking-widest">Suporte</h4>
            <ul className="space-y-4 text-base text-muted-foreground">
              <li><Link to="/cliente/ajuda" className="hover:text-primary transition-colors font-bold">Central de Ajuda</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors font-bold">Segurança</Link></li>
              <li><Link to="#" className="hover:text-primary transition-colors font-bold">Termos de Uso</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-20 pt-10 border-t border-foreground/5 text-center text-sm text-muted-foreground font-bold">
          © 2024 TechFix Marketplace. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;