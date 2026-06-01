import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Sparkles, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const NewPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('A senha deve conter no mínimo 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem. Verifique a confirmação.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Senha redefinida com sucesso!');
      navigate('/senha-resetada');
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-96px)] flex items-center justify-center p-8 bg-background animate-in fade-in duration-500">
      <div className="w-full max-w-md space-y-8 glass-card p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute -left-20 -bottom-20 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>

        <Link to="/recuperar-senha" className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-2">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Nova Senha</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Escolha uma nova senha forte para garantir a segurança da sua conta.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="password" className="font-bold text-xs">Nova Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-12 bg-card/50 border-white/10 rounded-xl text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="font-bold text-xs">Confirmar Nova Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repita a senha digitada"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="h-12 bg-card/50 border-white/10 rounded-xl text-sm"
            />
          </div>

          <Button type="submit" className="w-full btn-primary h-12 text-sm font-black gap-2 mt-4" disabled={isLoading}>
            {isLoading ? 'Redefinindo senha...' : 'Confirmar Nova Senha'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NewPasswordPage;
