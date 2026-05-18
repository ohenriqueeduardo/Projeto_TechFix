import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Cpu, Chrome, Apple } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = React.useState<'client' | 'professional' | 'admin'>('client');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Bem-vindo de volta!`);
      if (role === 'client') navigate('/cliente/dashboard');
      else if (role === 'professional') navigate('/profissional/dashboard');
      else navigate('/admin/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-96px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
            <Cpu className="text-primary w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Acesse sua conta</h1>
          <p className="text-muted-foreground mt-2">Escolha seu perfil para continuar</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-10">
          {(['client', 'professional', 'admin'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`py-3 px-2 text-xs font-black uppercase tracking-widest rounded-xl border transition-all ${
                role === r 
                ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10' 
                : 'border-white/5 text-muted-foreground hover:border-white/20'
              }`}
            >
              {r === 'client' ? 'Cliente' : r === 'professional' ? 'Técnico' : 'Admin'}
            </button>
          ))}
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-bold">E-mail</Label>
            <Input id="email" type="email" placeholder="seu@email.com" required className="h-14 bg-card/50 border-white/10 rounded-xl" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="font-bold">Senha</Label>
              <Link to="#" className="text-xs text-primary font-bold hover:underline">Esqueceu a senha?</Link>
            </div>
            <Input id="password" type="password" placeholder="••••••••" required className="h-14 bg-card/50 border-white/10 rounded-xl" />
          </div>

          <Button type="submit" className="w-full btn-primary h-14 text-lg font-black" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar na Conta'}
          </Button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest"><span className="bg-background px-4 text-muted-foreground font-bold">Ou continue com</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-14 rounded-xl border-white/10 hover:bg-white/5 font-bold">
            <Chrome className="w-5 h-5 mr-2" /> Google
          </Button>
          <Button variant="outline" className="h-14 rounded-xl border-white/10 hover:bg-white/5 font-bold">
            <Apple className="w-5 h-5 mr-2" /> Apple
          </Button>
        </div>

        <p className="text-center mt-10 text-sm text-muted-foreground font-medium">
          Não tem uma conta? <Link to="/cadastro" className="text-primary font-black hover:underline">Cadastre-se agora</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;