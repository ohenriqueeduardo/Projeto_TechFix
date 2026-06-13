import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Briefcase, ArrowLeft, ShieldCheck, Cpu, CheckCircle2, Sparkles, Chrome, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';

interface GoogleGIS {
  accounts: {
    oauth2: {
      initTokenClient: (config: {
        client_id: string;
        scope: string;
        callback: (res: { error?: string; access_token?: string }) => void;
      }) => { requestAccessToken: () => void };
    };
  };
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const [role, setRole] = React.useState<'client' | 'professional' | 'admin'>('client');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSocialLoading, setIsSocialLoading] = React.useState(false);
  const [googleClient, setGoogleClient] = React.useState<{ requestAccessToken: () => void } | null>(null);

  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [dateOfBirth, setDateOfBirth] = React.useState('');
  const [verificationCode, setVerificationCode] = React.useState('');

  // OTP Verification States
  const [codeDigits, setCodeDigits] = React.useState<string[]>(Array(6).fill(''));
  const [timer, setTimer] = React.useState(60);
  const [canResend, setCanResend] = React.useState(false);
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 4 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleRealGoogleLogin = React.useCallback(async (accessToken: string) => {
    setIsSocialLoading(true);

    try {
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: accessToken, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao autenticar com o Google.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.isNewUser || !data.user.phone || !data.user.cep) {
        if (data.isNewUser) {
          toast.success('Conta inicial criada com o Google! Continue com seu endereço e telefone.');
        } else {
          toast.info('Por favor, complete as informações do seu perfil para continuar.');
        }
        
        // Populate local states so user sees their name/email
        if (data.user.name) {
          const names = data.user.name.split(' ');
          setFirstName(names[0] || '');
          setLastName(names.slice(1).join(' ') || '');
        }
        if (data.user.email) setEmail(data.user.email);
        
        setStep(3); // Jump to address
      } else {
        toast.success('Bem-vindo de volta!');
        if (data.user.role === 'professional') {
          navigate('/profissional/dashboard');
        } else {
          navigate('/cliente/dashboard');
        }
      }
    } catch (error: unknown) {
      console.error('Erro no cadastro social:', error);
      toast.error((error as Error).message || 'Erro ao conectar com o servidor. Tente novamente.');
    } finally {
      setIsSocialLoading(false);
    }
  }, [navigate, role]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const win = window as Window & { google?: GoogleGIS };
      const initGoogle = () => {
        if (win.google) {
          const client = win.google.accounts.oauth2.initTokenClient({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
            scope: 'openid email profile',
            callback: async (response) => {
              if (response.error) {
                console.error('Google Auth Error:', response.error);
                toast.error('Erro na autenticação com o Google.');
                return;
              }
              if (response.access_token) {
                await handleRealGoogleLogin(response.access_token);
              }
            },
          });
          setGoogleClient(client);
        }
      };

      if (win.google) {
        initGoogle();
      } else {
        const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
        if (script) {
          script.addEventListener('load', initGoogle);
        }
      }
    }
  }, [handleRealGoogleLogin]);

  const handleGoogleClick = () => {
    if (googleClient) {
      googleClient.requestAccessToken();
    } else {
      toast.error('O serviço do Google está carregando. Aguarde um momento...');
    }
  };

  const updateVerificationCode = (digits: string[]) => {
    const code = digits.join('');
    setVerificationCode(code);
  };

  const handleDigitChange = (value: string, index: number) => {
    const num = value.replace(/\D/g, '');
    if (!num) {
      const newDigits = [...codeDigits];
      newDigits[index] = '';
      setCodeDigits(newDigits);
      updateVerificationCode(newDigits);
      return;
    }
    
    const newDigits = [...codeDigits];
    newDigits[index] = num.slice(-1); // Only take the last character
    setCodeDigits(newDigits);
    updateVerificationCode(newDigits);

    // Focus next input
    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      if (!codeDigits[index] && index > 0) {
        const newDigits = [...codeDigits];
        newDigits[index - 1] = '';
        setCodeDigits(newDigits);
        updateVerificationCode(newDigits);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleDigitPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      const newDigits = pastedData.split('');
      setCodeDigits(newDigits);
      updateVerificationCode(newDigits);
      inputRefs.current[5]?.focus();
    }
  };

  const handleResendClick = async () => {
    if (!canResend) return;
    await sendVerificationCode();
  };

  const sendVerificationCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar código de verificação.');
      }

      toast.success('Código de verificação enviado para o seu e-mail!');
      setTimer(60);
      setCanResend(false);
      setCodeDigits(Array(6).fill(''));
      setVerificationCode('');
      setStep(4);
    } catch (error: unknown) {
      console.error('Erro ao enviar código de verificação:', error);
      toast.error((error as Error).message || 'Erro de conexão com o servidor. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Address Fields
  const [cep, setCep] = React.useState('');
  const [street, setStreet] = React.useState('');
  const [number, setNumber] = React.useState('');
  const [complement, setComplement] = React.useState('');
  const [neighborhood, setNeighborhood] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [isSearchingCep, setIsSearchingCep] = React.useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    let formatted = value;
    if (value.length > 2) formatted = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    if (value.length > 7) formatted = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    setPhone(formatted);
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    let formatted = value;
    if (value.length > 5) formatted = `${value.slice(0, 5)}-${value.slice(5)}`;
    setCep(formatted);

    if (value.length === 8) {
      setIsSearchingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
        const data = await response.json();
        if (data.erro) {
          toast.error('CEP não encontrado.');
        } else {
          setStreet(data.logradouro || '');
          setNeighborhood(data.bairro || '');
          setCity(data.localidade || '');
          setState(data.uf || '');
          toast.success('Endereço auto-preenchido!');
        }
      } catch (err) {
        toast.error('Erro na busca do CEP.');
      } finally {
        setIsSearchingCep(false);
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const fullName = `${firstName} ${lastName}`.trim();

      // Register the main user in PostgreSQL through Express API
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
          code: verificationCode,
          role,
          phone,
          dateOfBirth,
          cep,
          street,
          number,
          complement,
          neighborhood,
          city,
          state
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
        const professionalResponse = await fetch('/api/professionals', {
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
        setStep(5);
      } else {
        navigate('/cliente/dashboard');
      }
    } catch (error: unknown) {
      console.error('Erro no cadastro:', error);
      toast.error((error as Error).message || 'Erro de conexão com o servidor. Tente novamente.');
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
      <div className="flex items-center justify-center p-8 md:p-16 bg-background relative">
        
        {/* Social Authentication Spinner Overlay */}
        {isSocialLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-300">
            <div className="glass-card p-8 rounded-3xl border border-primary/20 text-center space-y-4 shadow-2xl max-w-xs">
              <span className="h-10 w-10 rounded-full border-4 border-t-primary border-white/5 animate-spin mx-auto block"></span>
              <h3 className="font-black text-lg text-foreground">Conectando com o Google</h3>
              <p className="text-xs text-muted-foreground">Estabelecendo conexão segura. Aguarde...</p>
            </div>
          </div>
        )}

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
          ) : step === 2 ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
              <Button variant="ghost" onClick={() => setStep(1)} className="mb-4 -ml-2 text-xs text-muted-foreground font-bold hover:text-primary h-9 px-3">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Voltar
              </Button>
              
              <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tight">Criar conta de {role === 'client' ? 'Cliente' : 'Técnico'}</h1>
                <p className="text-xs text-muted-foreground">Preencha os dados básicos para habilitar seu painel de controle</p>
              </div>

              <div className="pt-2">
                <Button 
                  onClick={handleGoogleClick}
                  variant="outline" 
                  className="w-full h-12 rounded-xl border-foreground/10 hover:bg-foreground/5 font-bold text-xs gap-2"
                >
                  <Chrome className="w-4 h-4 text-red-500" /> Cadastrar-se com Google
                </Button>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-foreground/5"></span></div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-background px-4 text-muted-foreground font-black">Ou preencha os dados</span></div>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-4">
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="font-bold text-xs">Telefone</Label>
                    <Input 
                      id="phone" 
                      placeholder="(11) 99999-9999" 
                      value={phone} 
                      onChange={handlePhoneChange} 
                      required 
                      className="h-12 bg-card/50 border-foreground/10 rounded-xl text-sm" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="dateOfBirth" className="font-bold text-xs">Data de Nascimento</Label>
                    <Input 
                      id="dateOfBirth" 
                      type="date"
                      value={dateOfBirth} 
                      onChange={(e) => setDateOfBirth(e.target.value)} 
                      required 
                      className="h-12 bg-card/50 border-foreground/10 rounded-xl text-sm" 
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full btn-primary h-12 text-sm font-black mt-6">
                  Continuar
                </Button>
              </form>
            </div>
          ) : step === 3 ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
              <Button variant="ghost" onClick={() => setStep(2)} className="mb-4 -ml-2 text-xs text-muted-foreground font-bold hover:text-primary h-9 px-3">
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Voltar
              </Button>
              
              <div className="space-y-1">
                <h1 className="text-2xl font-black tracking-tight">Endereço Principal</h1>
                <p className="text-xs text-muted-foreground">Onde os serviços serão realizados ou sua base de atendimento</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); sendVerificationCode(); }} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1 space-y-1.5 relative">
                    <Label htmlFor="cep" className="font-bold text-xs">CEP</Label>
                    <Input 
                      id="cep" 
                      placeholder="00000-000" 
                      value={cep} 
                      onChange={handleCepChange} 
                      required
                      className="h-12 bg-card/50 border-foreground/10 rounded-xl text-sm" 
                    />
                    {isSearchingCep && <span className="absolute bottom-3 right-3 h-5 w-5 rounded-full border-2 border-t-primary border-white/5 animate-spin"></span>}
                  </div>
                  <div className="md:col-span-2 space-y-1.5">
                    <Label htmlFor="street" className="font-bold text-xs">Endereço</Label>
                    <Input 
                      id="street" 
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      required
                      className="h-12 bg-card/50 border-foreground/10 rounded-xl text-sm" 
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="number" className="font-bold text-xs">Número</Label>
                    <Input 
                      id="number" 
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      required
                      className="h-12 bg-card/50 border-foreground/10 rounded-xl text-sm" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="complement" className="font-bold text-xs">Complemento (Opcional)</Label>
                    <Input 
                      id="complement" 
                      value={complement}
                      onChange={(e) => setComplement(e.target.value)}
                      className="h-12 bg-card/50 border-foreground/10 rounded-xl text-sm" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="neighborhood" className="font-bold text-xs">Bairro</Label>
                    <Input 
                      id="neighborhood" 
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      required
                      className="h-12 bg-card/50 border-foreground/10 rounded-xl text-sm" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="city" className="font-bold text-xs">Cidade</Label>
                    <Input 
                      id="city" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="h-12 bg-card/50 border-foreground/10 rounded-xl text-sm" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="state" className="font-bold text-xs">Estado</Label>
                    <Input 
                      id="state" 
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                      className="h-12 bg-card/50 border-foreground/10 rounded-xl text-sm" 
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full btn-primary h-12 text-sm font-black mt-6" disabled={isLoading}>
                  {isLoading ? 'Enviando Código...' : 'Finalizar e Criar Conta'}
                </Button>
              </form>
            </div>
          ) : step === 4 ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
              <Button variant="ghost" onClick={() => setStep(3)} className="mb-4 -ml-2 text-xs text-muted-foreground font-bold hover:text-primary h-9 px-3" disabled={isLoading}>
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Voltar
              </Button>
              
              <div className="space-y-2">
                <h1 className="text-2xl font-black tracking-tight">Verifique seu E-mail</h1>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enviamos um código de verificação de 6 dígitos para o endereço <strong className="text-foreground">{email}</strong>.
                </p>
              </div>

              <form onSubmit={handleRegister} className="space-y-6 pt-2">
                <div className="space-y-3">
                  <Label className="font-bold text-xs text-center block">Digite o código de 6 dígitos</Label>
                  <div className="flex gap-2 sm:gap-3 justify-center">
                    {Array(6).fill(0).map((_, index) => (
                      <input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={codeDigits[index]}
                        onChange={(e) => handleDigitChange(e.target.value, index)}
                        onKeyDown={(e) => handleDigitKeyDown(e, index)}
                        onPaste={handleDigitPaste}
                        disabled={isLoading}
                        className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-black rounded-xl border border-foreground/10 bg-card/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none disabled:opacity-50"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Não recebeu o código?</span>
                  {canResend ? (
                    <button 
                      type="button" 
                      onClick={handleResendClick} 
                      disabled={isLoading}
                      className="text-primary font-black hover:underline"
                    >
                      Reenviar Código
                    </button>
                  ) : (
                    <span className="text-muted-foreground/60 font-medium">
                      Reenviar em <strong className="font-bold">{timer}s</strong>
                    </span>
                  )}
                </div>

                <Button type="submit" className="w-full btn-primary h-12 text-sm font-black mt-6" disabled={isLoading || verificationCode.length !== 6}>
                  {isLoading ? 'Verificando...' : 'Confirmar e Criar Conta'}
                </Button>
              </form>
            </div>
          ) : step === 5 ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6">
              <div className="space-y-2 text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-2xl font-black tracking-tight">Verificação de Identidade</h1>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  Para garantir a segurança da plataforma, precisamos validar sua identidade como prestador de serviço.
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <div className="border-2 border-dashed border-foreground/10 rounded-2xl p-6 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                  <UploadCloud className="w-8 h-8 text-muted-foreground mx-auto mb-3 group-hover:text-primary transition-colors" />
                  <p className="text-sm font-bold">Frente e Verso do Documento (RG/CNH)</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Formatos suportados: JPG, PNG ou PDF</p>
                </div>

                <div className="border-2 border-dashed border-foreground/10 rounded-2xl p-6 text-center hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group">
                  <UploadCloud className="w-8 h-8 text-muted-foreground mx-auto mb-3 group-hover:text-primary transition-colors" />
                  <p className="text-sm font-bold">Selfie Segurando o Documento</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Rosto e documento devem estar nítidos</p>
                </div>
              </div>

              <Button 
                onClick={() => {
                  toast.success('Documentos enviados com sucesso! Seu perfil está em análise.');
                  navigate('/profissional/dashboard');
                }} 
                className="w-full btn-primary h-12 text-sm font-black mt-8"
              >
                Enviar para Análise e Finalizar
              </Button>
              <Button 
                onClick={() => {
                  toast.info('Você pulou a verificação. Sua conta ficará sem o selo oficial por enquanto.');
                  navigate('/profissional/dashboard');
                }} 
                variant="ghost"
                className="w-full h-12 text-sm font-bold text-muted-foreground hover:text-foreground mt-2"
              >
                Pular por enquanto
              </Button>
            </div>
          ) : null}
        </div>
      </div>
      
    </div>
  );
};

export default RegisterPage;