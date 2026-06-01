import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Briefcase, ArrowLeft, ShieldCheck, Cpu, CheckCircle2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const [role, setRole] = React.useState<'client' | 'professional' | 'admin'>('client');
  const [isLoading, setIsLoading] = React.useState(false);

  // Form Fields
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const fullName = `${firstName} ${lastName}`.trim();

      // Register the main user in PostgreSQL through Express API
      const registerResponse = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          role,
        }),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerData.error || 'Erro ao registrar sua conta. Tente novamente.');
      }

      // Save token and user details to localStorage
      localStorage.setItem('token', registerData.token);
      localStorage.setItem('user', JSON.stringify(registerData.user));

      // If registering as a professional, we also need to create their extended profile!
      if (role === 'professional') {
        const professionalResponse = await fetch('http://localhost:3000/api/professionals', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${registerData.token}`,
          },
          body: JSON.stringify({
            userId: registerData.user.id,
            specialty: 'Técnico de Hardware',
            city: 'São Paulo', // Default city for demonstration
            yearsExperience: 1,
            bio: 'Técnico recém-cadastrado no TechFix.',
          }),
        });

        const professionalData = await professionalResponse.json();

        if (!professionalResponse.ok) {
          console.error('Professional registration error:', professionalData);
          toast.warning('Conta criada, mas houve um problema ao criar seu perfil profissional. Por favor, complete no painel.');
        }
      }

      toast.success('Sua conta foi criada com sucesso! Bem-vindo ao TechFix.');

      // Route to correct layout dashboard depending on role
      if (role === 'professional') {
        navigate('/profissional/dashboard');
      } else {
        navigate('/cliente/dashboard');
      }
    } catch (error: unknown) {
      console.warn('Backend offline, registrando localmente no frontend:', error);
      
      // Fallback: Local registration using LocalStorage db
      const mockUserId = `u_${Date.now()}`;
      const fullName = `${firstName} ${lastName}`.trim();
      const mockUser = {
        id: mockUserId,
        name: fullName,
        email,
        role,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(fullName)}`,
        status: 'active' as const,
        level: 'Bronze'
      };

      // 1. Save user in local users list
      const localUsers = JSON.parse(localStorage.getItem('techfix_users') || '[]');
      localUsers.push(mockUser);
      localStorage.setItem('techfix_users', JSON.stringify(localUsers));

      // 2. Seed professional profile locally if role is professional
      if (role === 'professional') {
        const localProfs = JSON.parse(localStorage.getItem('techfix_professionals') || '[]');
        localProfs.push({
          ...mockUser,
          specialty: 'Técnico Especialista',
          city: 'São Paulo, SP',
          rating: 5.0,
          reviewCount: 0,
          jobs: 0,
          yearsExperience: 1,
          satisfaction: 100,
          bio: 'Especialista em manutenção de hardware e suporte de TI homologado no TechFix.'
        });
        localStorage.setItem('techfix_professionals', JSON.stringify(localProfs));
      }

      // 3. Authenticate locally
      localStorage.setItem('token', 'mock_jwt_token_' + mockUserId);
      localStorage.setItem('user', JSON.stringify(mockUser));

      toast.success('Sua conta foi criada com sucesso (Modo Demonstração)! Bem-vindo ao TechFix.');

      if (role === 'professional') {
        navigate('/profissional/dashboard');
      } else {
        navigate('/cliente/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-96px)] grid grid-cols-1 lg:grid-cols-2 animate-in fade-in duration-500 overflow-hidden">
      
      {/* LEFT COLUMN: Benefits and Quality Panel (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between p-16 bg-gradient-to-tr from-cyan-950 via-slate-950 to-blue-950 relative border-r border-slate-900 overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#083344_1px,transparent_1px),linear-gradient(to_bottom,#083344_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35"></div>
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>

        <div className="relative space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Junte-se à Comunidade
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
            Faça parte da maior rede de <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">suporte técnico.</span>
          </h2>
          <p className="text-slate-300 text-base max-w-md leading-relaxed font-medium">
            Seja como cliente precisando de soluções rápidas ou técnico querendo rentabilizar seu conhecimento, a TechFix é o seu lugar.
          </p>
        </div>

        {/* Value Propositions / Key benefits */}
        <div className="relative space-y-6 max-w-md bg-slate-950/40 backdrop-blur-xl border border-slate-900 p-6 rounded-2xl">
          <h4 className="font-bold text-sm text-white uppercase tracking-widest mb-2">Por que escolher a TechFix?</h4>
          {[
            { title: 'Técnicos 100% Homologados', desc: 'Profissionais rigorosamente verificados através de testes técnicos e checagem de antecedentes.' },
            { title: 'Pagamento Seguro Garantido', desc: 'O valor do serviço fica retido de forma segura e só é liberado para o técnico após a sua aprovação.' },
            { title: 'Garantia de Qualidade de 90 dias', desc: 'Qualquer problema relacionado ao reparo efetuado é coberto pela nossa apólice de garantia.' },
          ].map((item, i) => (
            <div key={i} className="flex gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h5 className="font-bold text-sm text-white">{item.title}</h5>
                <p className="text-xs text-slate-300 leading-relaxed mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Security badge advice */}
        <div className="relative flex items-center gap-3.5 text-xs text-slate-300">
          <ShieldCheck className="w-6 h-6 text-primary" />
          <span>Sua privacidade e dados estão seguros de acordo com a LGPD.</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Form */}
      <div className="flex items-center justify-center p-8 md:p-16 bg-background">
        <div className="w-full max-w-md space-y-8">
          
          {step === 1 ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl font-black tracking-tight mb-2">Como você deseja começar?</h1>
                <p className="text-sm text-muted-foreground">Selecione o tipo de conta que melhor se adapta às suas necessidades</p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => { setRole('client'); setStep(2); }}
                  className="w-full p-6 rounded-2xl border border-foreground/10 bg-card/40 hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                      <User className="text-primary w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg mb-1 leading-none">Quero contratar serviços</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1">Encontre técnicos especialistas para resolver problemas em computadores, redes e softwares.</p>
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => { setRole('professional'); setStep(2); }}
                  className="w-full p-6 rounded-2xl border border-foreground/10 bg-card/40 hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                      <Briefcase className="text-cyan-500 w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg mb-1 leading-none">Quero oferecer serviços</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1">Trabalhe como especialista técnico, encontre chamados na sua região e aumente sua renda.</p>
                    </div>
                  </div>
                </button>
              </div>

              <p className="text-center text-xs text-muted-foreground font-medium pt-4">
                Já tem uma conta? <Link to="/login" className="text-primary font-black hover:underline">Entrar agora</Link>
              </p>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
              <Button variant="ghost" onClick={() => setStep(1)} className="mb-4 -ml-2 text-xs text-muted-foreground font-bold hover:text-primary h-9 px-3">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Voltar
              </Button>
              
              <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tight">Criar conta de {role === 'client' ? 'Cliente' : 'Técnico'}</h1>
                <p className="text-xs text-muted-foreground">Preencha os dados básicos para habilitar seu painel de controle</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName" className="font-bold text-xs">Nome</Label>
                    <Input 
                      id="firstName" 
                      placeholder="João" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)} 
                      required 
                      className="h-12 bg-card/50 border-foreground/10 rounded-xl text-sm" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName" className="font-bold text-xs">Sobrenome</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Silva" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)} 
                      required 
                      className="h-12 bg-card/50 border-foreground/10 rounded-xl text-sm" 
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="font-bold text-xs">E-mail</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="joao@email.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="h-12 bg-card/50 border-foreground/10 rounded-xl text-sm" 
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="font-bold text-xs">Senha</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Mínimo 6 caracteres" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="h-12 bg-card/50 border-foreground/10 rounded-xl text-sm" 
                  />
                </div>

                <Button type="submit" className="w-full btn-primary h-12 text-sm font-black mt-6" disabled={isLoading}>
                  {isLoading ? 'Registrando...' : 'Criar Minha Conta'}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default RegisterPage;