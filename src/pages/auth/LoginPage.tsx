import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Cpu, Chrome, Apple, ShieldCheck, Sparkles, Star, ArrowRight, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '@/types';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSocialLoading, setIsSocialLoading] = React.useState(false);
  const [socialProvider, setSocialProvider] = React.useState<'Google' | 'Apple' | null>(null);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Connects directly to our backend Express API running on port 3000
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Credenciais inválidas. Verifique seu login e senha.');
      }

      // Save token and user info to localStorage to maintain active session
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast.success(`Bem-vindo de volta, ${data.user.name}! Acesso concedido.`);

      const userRole = data.user.role;
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (userRole === 'professional') {
        navigate('/profissional/dashboard');
      } else {
        navigate('/cliente/dashboard');
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast.error(error.message || 'Erro de conexão com o servidor. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'Google' | 'Apple') => {
    setSocialProvider(provider);
    setIsSocialLoading(true);

    setTimeout(() => {
      setIsSocialLoading(false);
      
      // Seed a beautiful mock social user
      const mockSocialUser = {
        id: `u_social_${Date.now()}`,
        name: `Conectado via ${provider}`,
        email: `social_${provider.toLowerCase()}@techfix.com`,
        role: 'client' as const,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${provider}`,
        status: 'active' as const,
        level: 'Silver'
      };

      localStorage.setItem('token', `mock_social_token_${provider}`);
      localStorage.setItem('user', JSON.stringify(mockSocialUser));

      toast.success(`Conexão com ${provider} autorizada com sucesso!`);
      navigate('/cliente/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-2 animate-in fade-in duration-500 overflow-hidden">
      
      {/* LEFT COLUMN: Visual Panel & Platform Benefits (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-tr from-cyan-950 via-slate-950 to-blue-950 relative border-r border-slate-900 overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35"></div>
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>

        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-black uppercase tracking-wider animate-pulse">
            <Sparkles className="w-3.5 h-3.5" /> Plataforma TechFix
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
            Seu setup nas mãos de <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">especialistas.</span>
          </h2>
          <p className="text-slate-300 text-base max-w-md leading-relaxed font-medium">
            Conectamos você aos melhores técnicos de TI do Brasil com total agilidade, segurança financeira e garantia.
          </p>
        </div>

        {/* Security & Clean Setup Badge */}
        <div className="relative glass-card p-6 rounded-2xl bg-slate-950/40 backdrop-blur-xl border border-slate-900 shadow-2xl max-w-md space-y-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h4 className="font-bold text-sm text-white">Segurança Avançada</h4>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Sua conta está assegurada por criptografia de ponta a ponta. Crie sua conta ou faça login para acessar suas informações privadas.
          </p>
        </div>

        {/* Platform Proposition */}
        <div className="relative border-l-2 border-primary pl-6 py-2">
          <p className="text-sm italic text-slate-300 leading-relaxed font-medium">
            Conectando clientes que buscam reparos de alto nível e profissionais especialistas em montagem e manutenção de hardware.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: Authentication Form */}
      <div className="flex items-center justify-center p-8 md:p-16 bg-background relative">
        
        {/* Social Authentication Spinner Overlay */}
        {isSocialLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-300">
            <div className="glass-card p-8 rounded-3xl border border-primary/20 text-center space-y-4 shadow-2xl max-w-xs">
              <span className="h-10 w-10 rounded-full border-4 border-t-primary border-white/5 animate-spin mx-auto block"></span>
              <h3 className="font-black text-lg text-foreground">Acessando via {socialProvider}</h3>
              <p className="text-xs text-muted-foreground">Estabelecendo handshake seguro de token com {socialProvider}. Aguarde...</p>
            </div>
          </div>
        )}

        <div className="w-full max-w-md space-y-8 animate-in slide-in-from-right-4 duration-500">
          
          <div className="text-center lg:text-left">
            <div className="inline-flex lg:hidden items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-6">
              <Cpu className="text-primary w-7 h-7 animate-pulse" />
            </div>
            <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Acesse sua conta</h1>
            <p className="text-sm text-muted-foreground mt-2">Entre com seu e-mail e senha cadastrados</p>
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
                className="h-12 bg-card/50 border-foreground/10 rounded-xl text-sm" 
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <Label htmlFor="password" className="font-bold text-xs">Senha</Label>
                <Link to="/recuperar-senha" className="text-[11px] text-primary font-bold hover:underline">Esqueceu a senha?</Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="h-12 bg-card/50 border-foreground/10 rounded-xl text-sm" 
              />
            </div>

            <Button type="submit" className="w-full btn-primary h-12 text-sm font-black mt-2 gap-2" disabled={isLoading}>
              {isLoading ? 'Autenticando...' : 'Entrar na Conta'} <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-foreground/5"></span></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-background px-4 text-muted-foreground font-black">Ou conecte com</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <Button 
              onClick={() => handleSocialLogin('Google')}
              variant="outline" 
              className="h-12 rounded-xl border-foreground/10 hover:bg-foreground/5 font-bold text-xs gap-2"
            >
              <Chrome className="w-4 h-4 text-red-500" /> Google
            </Button>
            <Button 
              onClick={() => handleSocialLogin('Apple')}
              variant="outline" 
              className="h-12 rounded-xl border-foreground/10 hover:bg-foreground/5 font-bold text-xs gap-2"
            >
              <Apple className="w-4 h-4 text-foreground" /> Apple
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