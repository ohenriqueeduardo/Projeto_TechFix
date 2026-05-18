import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Cpu, Menu, X } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const PublicLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-foreground/5 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <Cpu className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">TechFix</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/cliente/servicos" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Explorar</Link>
            <Link to="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Como Funciona</Link>
            <Link to="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Segurança</Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login">
              <Button variant="ghost" className="text-sm">Entrar</Button>
            </Link>
            <Link to="/cadastro">
              <Button className="btn-primary">Começar Agora</Button>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b border-foreground/5 p-4 flex flex-col gap-4 animate-in slide-in-from-top">
            <Link to="/cliente/servicos" className="text-lg font-medium py-2">Explorar Serviços</Link>
            <Link to="/login" className="text-lg font-medium py-2">Entrar</Link>
            <Link to="/cadastro" className="text-lg font-medium py-2">Cadastrar</Link>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-foreground/5 py-12 bg-card/30">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">TechFix</span>
            </div>
            <p className="text-muted-foreground max-w-xs">
              A maior plataforma de serviços de TI do Brasil. Conectando você aos melhores profissionais.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Plataforma</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/cliente/servicos">Explorar Serviços</Link></li>
              <li><Link to="/cadastro/profissional">Seja um Técnico</Link></li>
              <li><Link to="#">Como Funciona</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="#">Central de Ajuda</Link></li>
              <li><Link to="#">Segurança</Link></li>
              <li><Link to="#">Termos de Uso</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-foreground/5 text-center text-sm text-muted-foreground">
          © 2024 TechFix Marketplace. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;