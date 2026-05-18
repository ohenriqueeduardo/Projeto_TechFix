import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Briefcase, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const [role, setRole] = React.useState<'client' | 'professional' | 'admin'>('client');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Conta criada com sucesso! Bem-vindo ao TechFix.');
    if (role === 'client') navigate('/cliente/dashboard');
    else navigate('/profissional/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-96px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === 1 ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-black tracking-tight mb-3">Como você quer usar o TechFix?</h1>
              <p className="text-muted-foreground">Escolha o tipo de conta ideal para sua necessidade</p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => { setRole('client'); setStep(2); }}
                className="w-full p-8 rounded-[2rem] border border-white/10 bg-card/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User className="text-primary w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl mb-1">Quero contratar serviços</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Encontre os melhores técnicos para resolver seus problemas de TI.</p>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => { setRole('professional'); setStep(2); }}
                className="w-full p-8 rounded-[2rem] border border-white/10 bg-card/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Briefcase className="text-cyan-500 w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-black text-xl mb-1">Quero oferecer serviços</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Trabalhe como especialista e aumente sua renda mensal.</p>
                  </div>
                </div>
              </button>
            </div>

            <p className="text-center mt-10 text-sm text-muted-foreground font-medium">
              Já tem uma conta? <Link to="/login" className="text-primary font-black hover:underline">Entrar agora</Link>
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <Button variant="ghost" onClick={() => setStep(1)} className="mb-8 -ml-2 text-muted-foreground font-bold hover:text-primary">
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
            <div className="mb-10">
              <h1 className="text-3xl font-black tracking-tight">Crie sua conta de {role === 'client' ? 'Cliente' : 'Técnico'}</h1>
              <p className="text-muted-foreground mt-2">Preencha os dados abaixo para começar sua jornada</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="font-bold">Nome</Label>
                  <Input id="firstName" placeholder="João" required className="h-14 bg-card/50 border-white/10 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="font-bold">Sobrenome</Label>
                  <Input id="lastName" placeholder="Silva" required className="h-14 bg-card/50 border-white/10 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold">E-mail</Label>
                <Input id="email" type="email" placeholder="joao@email.com" required className="h-14 bg-card/50 border-white/10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-bold">Senha</Label>
                <Input id="password" type="password" placeholder="Mínimo 8 caracteres" required className="h-14 bg-card/50 border-white/10 rounded-xl" />
              </div>

              {role === 'professional' && (
                <div className="space-y-2">
                  <Label htmlFor="specialty" className="font-bold">Especialidade Principal</Label>
                  <Input id="specialty" placeholder="Ex: Montagem de PC Gamer" required className="h-14 bg-card/50 border-white/10 rounded-xl" />
                </div>
              )}

              <Button type="submit" className="w-full btn-primary h-14 text-lg font-black mt-4">
                Criar Minha Conta
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;