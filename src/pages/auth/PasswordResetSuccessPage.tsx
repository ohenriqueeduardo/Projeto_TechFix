import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Sparkles } from 'lucide-react';

const PasswordResetSuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-96px)] flex items-center justify-center p-8 bg-background animate-in zoom-in-95 duration-500">
      <div className="w-full max-w-md space-y-8 glass-card p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="w-20 h-20 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="text-green-500 w-10 h-10" />
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tight">Senha Alterada!</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sua senha foi redefinida com total segurança. Agora você já pode entrar na sua conta com a nova senha cadastrada.
          </p>
        </div>

        <Button onClick={() => navigate('/login')} className="w-full btn-primary h-12 text-sm font-black mt-6">
          Voltar ao Login
        </Button>
      </div>
    </div>
  );
};

export default PasswordResetSuccessPage;
