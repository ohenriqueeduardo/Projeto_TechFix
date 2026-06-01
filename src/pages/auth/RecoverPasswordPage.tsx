import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, KeyRound, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const RecoverPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Por favor, insira um e-mail válido.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Código de recuperação enviado para o seu e-mail!');
      // Navigate to /nova-senha
      navigate('/nova-senha');
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-96px)] flex items-center justify-center p-8 bg-background animate-in fade-in duration-500">
      <div className="w-full max-w-md space-y-8 glass-card p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
        
        <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Login
        </Link>

        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-2">
            <KeyRound className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Recuperar Senha</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Insira o e-mail associado à sua conta e enviaremos as instruções para redefinir sua senha.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-bold text-xs">E-mail Cadastrado</Label>
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

          <Button type="submit" className="w-full btn-primary h-12 text-sm font-black gap-2" disabled={isLoading}>
            {isLoading ? 'Enviando instruções...' : 'Enviar Link de Recuperação'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default RecoverPasswordPage;
