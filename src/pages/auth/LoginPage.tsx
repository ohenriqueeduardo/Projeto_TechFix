import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Cpu, Chrome, Apple, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = React.useState<'client' | 'professional' | 'admin'>('client');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulação de login
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Bem-vindo de volta!`);
      if (role === 'client') navigate('/cliente/dashboard');
      else if (role === 'professional') navigate('/profissional/dashboard');
      else navigate('/admin/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
            <Cpu className="text-primary w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold">Acesse sua conta</h1>
          <p className="text-muted-foreground">Escolha seu perfil para continuar</p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-8">
          {(['client', 'professional', 'admin'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${
                role === r 
                ? 'bg-primary/10 border-primary text-primary' 
                : 'border-white/5 text-muted-foreground hover:border-white/20'
              }`}
            >
              {r === 'client' ? 'Cliente' : r === 'professional' ? 'Técnico' : 'Admin'}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="seu@email.com" required className="bg-card/50 border-white/10" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Senha</Label>
              <Link to="#" className="text-xs text-primary hover:underline">Esqueceu a senha?</Link>
            </div>
            <Input id="password" type="password" placeholder="••••••••" required className="bg-card/50 border-white/10" />
          </div>

          <Button type="submit" className="w-full btn-primary h-12" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Ou continue com</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-12 rounded-xl border-white/10 hover:bg-white/5">
            <Chrome className="w-4 h-4 mr-2" /> Google
          </Button>
          <Button variant="outline" className="h-12 rounded-xl border-white/10 hover:bg-white/5">
            <Apple className="w-4 h-4 mr-2" /> Apple
          </Button>
        </div>

        <p className="text-center mt-8 text-sm text-muted-foreground">
          Não tem uma conta? <Link to="/cadastro" className="text-primary font-bold hover:underline">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;