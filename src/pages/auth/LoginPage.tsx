import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Cpu, Chrome, Apple, ShieldCheck, Sparkles, Star, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = React.useState<'client' | 'professional' | 'admin'>('client');
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState('sofia@example.com');
  const [password, setPassword] = React.useState('12345678');

  // Automatically update suggested email when role selector is clicked
  const handleRoleChange = (selectedRole: 'client' | 'professional' | 'admin') => {
    setRole(selectedRole);
    if (selectedRole === 'client') {
      setEmail('sofia@example.com');
    } else if (selectedRole === 'professional') {
      setEmail('carlos@example.com');
    } else {
      setEmail('admin@techfix.com');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast.success(`Bem-vindo de volta! Acesso concedido.`);
      if (role === 'client') navigate('/cliente/dashboard');
      else if (role === 'professional') navigate('/profissional/dashboard');
      else navigate('/admin/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-96px)] grid grid-cols-1 lg:grid-cols-2 animate-in fade-in duration-500 overflow-hidden">
      
      {/* LEFT COLUMN: Visual Panel & Platform Benefits (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-tr from-cyan-950 via-slate-950 to-blue-950 relative border-r border-white/5 overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35"></div>
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>

        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Plataforma TechFix
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Seu setup nas mãos de <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">especialistas.</span>
          </h2>
          <p className="text-muted-foreground text-base max-w-md leading-relaxed font-medium">
            Conectamos você aos melhores técnicos de TI do Brasil com total agilidade, segurança financeira e garantia.
          </p>
        </div>

        {/* Credentials Quick Guide Box (Test accounts) */}
        <div className="relative glass-card p-6 rounded-2xl bg-card/25 backdrop-blur-xl border-white/10 shadow-2xl max-w-md space-y-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h4 className="font-bold text-sm text-foreground">Ambiente de Demonstração</h4>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Use os botões de perfil no formulário ao lado para carregar e testar as credenciais fictícias automaticamente:
          </p>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="font-bold text-muted-foreground">Cliente (Sofia):</span>
              <code className="text-primary font-mono bg-white/5 px-1.5 py-0.5 rounded">sofia@example.com</code>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="font-bold text-muted-foreground">Técnico (Carlos):</span>
              <code className="text-primary font-mono bg-white/5 px-1.5 py-0.5 rounded">carlos@example.com</code>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="font-bold text-muted-foreground">Administrador:</span>
              <code className="text-primary font-mono bg-white/5 px-1.5 py-0.5 rounded">admin@techfix.com</code>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative border-l-2 border-primary pl-6 py-2">
          <p className="text-sm italic text-muted-foreground leading-relaxed">
            "Excelente atendimento! O técnico montou meu PC Gamer com um gerenciamento de cabos impecável e realizou testes extensivos de estresse."
          </p>
          <div className="flex items-center gap-3 mt-4">
            <img src="https://i.pravatar.cc/150?u=sofia" className="w-10 h-10 rounded-full border border-primary/20" alt="" />
            <div>
              <p className="text-xs font-bold">Sofia Spencer</p>
              <div className="flex text-yellow-500 gap-0.5 mt-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Authentication Form */}
      <div className="flex items-center justify-center p-8 md:p-16 bg-background">
        <div className="w-full max-w-md space-y-8 animate-in slide-in-from-right-4 duration-500">
          
          <div className="text-center lg:text-left">
            <div className="inline-flex lg:hidden items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-6">
              <Cpu className="text-primary w-7 h-7" />
            </div>
            <h1 className="text-3xl font-black tracking-tight">Acesse sua conta</h1>
            <p className="text-sm text-muted-foreground mt-2">Escolha seu tipo de perfil para demonstração rápida</p>
          </div>

          {/* Profile Selector Buttons */}
          <div className="grid grid-cols-3 gap-2.5">
            {(['client', 'professional', 'admin'] as const).map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => handleRoleChange(r)}
                className={`py-3.5 px-2 text-[10px] font-black uppercase tracking-wider rounded-xl border transition-all ${
                  role === r 
                  ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10' 
                  : 'border-white/5 text-muted-foreground hover:border-white/15'
                }`}
              >
                {r === 'client' ? 'Cliente' : r === 'professional' ? 'Técnico' : 'Admin'}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="font-bold text-xs">E-mail</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="seu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="h-12 bg-card/50 border-white/10 rounded-xl text-sm" 
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="font-bold text-xs">Senha</Label>
                <Link to="#" className="text-[11px] text-primary font-bold hover:underline">Esqueceu a senha?</Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="h-12 bg-card/50 border-white/10 rounded-xl text-sm" 
              />
            </div>

            <Button type="submit" className="w-full btn-primary h-12 text-sm font-black mt-2 gap-2" disabled={isLoading}>
              {isLoading ? 'Autenticando...' : 'Entrar na Conta'} <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/5"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-background px-4 text-muted-foreground font-black">Ou conecte com</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <Button variant="outline" className="h-12 rounded-xl border-white/10 hover:bg-white/5 font-bold text-xs">
              <Chrome className="w-4 h-4 mr-2" /> Google
            </Button>
            <Button variant="outline" className="h-12 rounded-xl border-white/10 hover:bg-white/5 font-bold text-xs">
              <Apple className="w-4 h-4 mr-2" /> Apple
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground font-medium pt-4">
            Não tem uma conta? <Link to="/cadastro" className="text-primary font-black hover:underline">Cadastre-se agora</Link>
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default LoginPage;