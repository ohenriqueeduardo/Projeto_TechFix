import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Cpu, User, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = React.useState(1);
  const [role, setRole] = React.useState<'client' | 'professional' | 'admin'>('client');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Conta criada com sucesso!');
    if (role === 'client') navigate('/cliente/dashboard');
    else navigate('/profissional/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {step === 1 ? (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Como você quer usar o TechFix?</h1>
              <p className="text-muted-foreground">Escolha o tipo de conta ideal para você</p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => { setRole('client'); setStep(2); }}
                className="w-full p-6 rounded-2xl border border-white/10 bg-card/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Quero contratar serviços</h3>
                    <p className="text-sm text-muted-foreground">Encontre técnicos para resolver seus problemas de TI.</p>
                  </div>
                </div>
              </button>

              <button 
                onClick={() => { setRole('professional'); setStep(2); }}
                className="w-full p-6 rounded-2xl border border-white/10 bg-card/50 hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Briefcase className="text-cyan-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Quero oferecer serviços</h3>
                    <p className="text-sm text-muted-foreground">Trabalhe como freelancer e aumente sua renda.</p>
                  </div>
                </div>
              </button>
            </div>

            <p className="text-center mt-8 text-sm text-muted-foreground">
              Já tem uma conta? <Link to="/login" className="text-primary font-bold hover:underline">Entrar</Link>
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-4">
            <Button variant="ghost" onClick={() => setStep(1)} className="mb-6 -ml-2 text-muted-foreground">
              ← Voltar
            </Button>
            <div className="mb-8">
              <h1 className="text-2xl font-bold">Crie sua conta de {role === 'client' ? 'Cliente' : 'Profissional'}</h1>
              <p className="text-muted-foreground">Preencha os dados abaixo para começar</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome</Label>
                  <Input id="firstName" placeholder="João" required className="bg-card/50 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <Input id="lastName" placeholder="Silva" required className="bg-card/50 border-white/10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="joao@email.com" required className="bg-card/50 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" placeholder="Mínimo 8 caracteres" required className="bg-card/50 border-white/10" />
              </div>

              {role === 'professional' && (
                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidade Principal</Label>
                  <Input id="specialty" placeholder="Ex: Montagem de PC" required className="bg-card/50 border-white/10" />
                </div>
              )}

              <Button type="submit" className="w-full btn-primary h-12 mt-4">
                Criar Conta
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;