import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, ArrowLeft, Trophy, Zap, Sparkles, CheckCircle2, Lock, Star } from 'lucide-react';
import { User, Order } from '@/types';
import { calculateUserLevelInfo } from '@/utils/levels';

const LevelsPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<User | null>(null);
  const [orders, setOrders] = React.useState<Order[]>([]);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      const fetchOrders = async () => {
        try {
          const res = await fetch(`http://localhost:3000/api/orders?clientId=${parsedUser.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            setOrders(await res.json());
          }
        } catch (err) {
          console.warn('Failed to fetch orders:', err);
        }
      };
      
      fetchOrders();
    }
  }, []);

  const levelInfo = user ? calculateUserLevelInfo(user.id, orders) : { level: 'Bronze', completedCount: 0, nextLevel: 'Silver', progressPercent: 0, remainingToNext: 2 } as ReturnType<typeof calculateUserLevelInfo>;
  const currentLevel = levelInfo.level;

  const levels = [
    { 
      level: 'Bronze', 
      desc: 'Atendimento padrão com suporte via e-mail e taxa TechFix regular.', 
      perks: ['Suporte via e-mail', 'Taxas padrão', 'Acesso a técnicos verificados'],
      active: currentLevel === 'Bronze',
      unlocked: true,
      color: 'from-amber-700 to-amber-900',
      textColor: 'text-amber-500',
      bgGlow: 'bg-amber-500/10'
    },
    { 
      level: 'Silver', 
      desc: 'Prioridade média em chamados, suporte por chat e 5% de desconto nas taxas.', 
      perks: ['Suporte prioritário via chat', '5% de desconto em todas as taxas', 'Garantia estendida de 45 dias'],
      active: currentLevel === 'Silver',
      unlocked: currentLevel === 'Silver' || currentLevel === 'Gold' || currentLevel === 'Platinum' || currentLevel === 'Adamantium',
      color: 'from-slate-400 to-slate-600',
      textColor: 'text-slate-300',
      bgGlow: 'bg-slate-400/10'
    },
    { 
      level: 'Gold', 
      desc: 'Prioridade alta em chamados, atendimento VIP, 10% de desconto em taxas administrativas.', 
      perks: ['Atendimento telefônico VIP', '10% de desconto em taxas', 'Garantia estendida de 60 dias', 'Prioridade alta na fila de chamados'],
      active: currentLevel === 'Gold',
      unlocked: currentLevel === 'Gold' || currentLevel === 'Platinum' || currentLevel === 'Adamantium',
      color: 'from-yellow-400 to-yellow-600',
      textColor: 'text-yellow-500',
      bgGlow: 'bg-yellow-500/15'
    },
    { 
      level: 'Platinum', 
      desc: 'Técnico dedicado exclusivo em chamados urgentes e cashback de 2% em cupons TechFix.', 
      perks: ['Técnico de elite dedicado', '15% de desconto em taxas', 'Cashback de 2% em cupons TechFix', 'Garantia total de 90 dias'],
      active: currentLevel === 'Platinum',
      unlocked: currentLevel === 'Platinum' || currentLevel === 'Adamantium',
      color: 'from-cyan-400 to-blue-500',
      textColor: 'text-cyan-400',
      bgGlow: 'bg-cyan-500/20'
    },
    { 
      level: 'Adamantium', 
      desc: 'Suporte emergencial 24/7 com atendimento imediato, zero taxas e upgrades garantidos.', 
      perks: ['Suporte emergencial 24 horas por dia, 7 dias por semana', 'ZERO taxas administrativas', 'Upgrades de peças garantidos', 'Atendimento residencial ultrarrápido'],
      active: currentLevel === 'Adamantium',
      unlocked: currentLevel === 'Adamantium',
      color: 'from-purple-500 to-indigo-600',
      textColor: 'text-purple-400',
      bgGlow: 'bg-purple-500/25'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-page-entrance">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <Button 
            onClick={() => navigate('/cliente/dashboard')}
            variant="ghost" 
            className="rounded-xl h-9 px-3 border-white/10 gap-1.5 -ml-3 text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
          </Button>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            Níveis de Progresso
            <Trophy className="w-8 h-8 text-primary animate-pulse" />
          </h1>
          <p className="text-muted-foreground text-base">
            Conclua serviços, acumule pontos e evolua para desbloquear privilégios exclusivos na plataforma TechFix.
          </p>
        </div>
      </div>

      {/* Progress Showcase Card */}
      <Card className="p-8 bg-card/30 border-white/5 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-2xl">
        {/* Glow decoration */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        
        {/* Shield Icon styling */}
        <div className="relative shrink-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <div className="relative bg-primary/10 border border-primary/30 p-8 rounded-full">
            <Shield className="w-16 h-16 text-primary" />
          </div>
        </div>

        {/* Level detailed info */}
        <div className="flex-1 space-y-5 text-center md:text-left z-10">
          <div>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.25em]">Nível Atual</span>
            <h2 className="text-3xl font-black tracking-tight mt-1">Você está na categoria <span className="text-primary">{currentLevel}</span></h2>
            <p className="text-muted-foreground text-sm mt-1">Evolua seu status para obter suporte prioritário e menores taxas administrativas.</p>
          </div>

          {/* Progress bar info */}
          <div className="space-y-2 max-w-xl">
            {levelInfo.nextLevel ? (
              <>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-muted-foreground">Progresso para o Nível {levelInfo.nextLevel}</span>
                  <span className="text-primary">{Math.round(levelInfo.progressPercent)}%</span>
                </div>
                <div className="h-3 w-full bg-foreground/5 rounded-full overflow-hidden border border-foreground/5 relative">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_12px_rgba(6,182,212,0.4)] rounded-full transition-all duration-1000"
                    style={{ width: `${levelInfo.progressPercent}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Você já concluiu {levelInfo.completedCount} chamados! Faltam apenas <strong className="text-foreground">{levelInfo.remainingToNext} chamados concluídos</strong> para você atingir o nível <strong className="text-yellow-500 font-black">{levelInfo.nextLevel}</strong> e desbloquear mais benefícios.
                </p>
              </>
            ) : (
              <p className="text-xs text-primary font-bold leading-relaxed">
                Parabéns! Você alcançou o nível máximo e conta com todos os privilégios VIP da TechFix!
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Perks and Details Grid */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" /> Benefícios por Categoria
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levels.map((tier, idx) => (
            <Card 
              key={idx}
              className={`p-6 bg-card/25 border rounded-3xl relative overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                tier.active 
                ? 'border-primary/50 bg-card/40 ring-1 ring-primary/20 shadow-[0_0_20px_rgba(6,182,212,0.05)] scale-[1.02]' 
                : tier.unlocked
                ? 'border-white/5 hover:border-white/20'
                : 'border-white/5 opacity-55 hover:opacity-75'
              }`}
            >
              {/* Backglow decor */}
              <div className={`absolute -right-16 -top-16 w-36 h-36 rounded-full blur-2xl opacity-40 ${tier.textColor === 'text-primary' ? 'bg-primary' : tier.textColor === 'text-yellow-500' ? 'bg-yellow-500' : 'bg-slate-400'}`} />

              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Categoria {idx + 1}</span>
                    <h4 className={`text-xl font-black mt-0.5 ${tier.textColor}`}>Nível {tier.level}</h4>
                  </div>
                  {tier.active ? (
                    <Badge className="bg-primary text-background font-black text-[9px] uppercase px-2 py-0.5 rounded-md">
                      Atual
                    </Badge>
                  ) : tier.unlocked ? (
                    <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/5 font-black text-[9px] uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Liberado
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-muted-foreground border-white/5 bg-white/5 font-black text-[9px] uppercase px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> Bloqueado
                    </Badge>
                  )}
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">{tier.desc}</p>
                
                {/* Perks Checklist */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Privilégios inclusos:</span>
                  <ul className="space-y-1.5">
                    {tier.perks.map((perk, perkIdx) => (
                      <li key={perkIdx} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${tier.unlocked ? 'text-green-500' : 'text-muted-foreground/40'}`} />
                        <span className={tier.unlocked ? 'text-foreground/90' : 'text-muted-foreground'}>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 relative z-10">
                {tier.active ? (
                  <div className="w-full bg-primary/10 text-primary border border-primary/20 text-center py-2.5 rounded-xl text-xs font-black uppercase tracking-wider">
                    Sua Categoria Atual
                  </div>
                ) : tier.unlocked ? (
                  <div className="w-full bg-green-500/10 text-green-500 border border-green-500/20 text-center py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider">
                    Nível Alcançado
                  </div>
                ) : (
                  <div className="w-full bg-white/5 text-muted-foreground border border-transparent text-center py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider">
                    Evolua para Desbloquear
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Gamification FAQ / Rules Section */}
      <Card className="p-8 bg-card/20 border-white/5 rounded-3xl space-y-6">
        <h4 className="text-xl font-bold flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" /> Como funciona a subida de nível?
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-3">
            <h5 className="font-bold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" /> 1. Conclua serviços qualificados
            </h5>
            <p className="text-muted-foreground text-xs leading-relaxed pl-3.5">
              Cada chamado fechado com sucesso acumula pontos de progresso na sua conta. Quanto mais complexo for o serviço (maior valor de transação), maior será o avanço do seu status.
            </p>
          </div>
          
          <div className="space-y-3">
            <h5 className="font-bold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" /> 2. Avaliações de 5 estrelas
            </h5>
            <p className="text-muted-foreground text-xs leading-relaxed pl-3.5">
              A sua parceria com os técnicos é essencial. Avaliar com precisão e manter uma nota de cooperação superior a 4.8 acelera o progresso do seu nível de progressão em até 1.5x.
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" /> 3. Descontos automáticos
            </h5>
            <p className="text-muted-foreground text-xs leading-relaxed pl-3.5">
              Ao atingir níveis superiores (como Gold, Platinum ou Adamantium), os descontos na taxa administrativa de intermediação da plataforma são aplicados de forma totalmente automatizada no fluxo de checkout.
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="font-bold text-foreground flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary rounded-full" /> 4. Garantia estendida exclusiva
            </h5>
            <p className="text-muted-foreground text-xs leading-relaxed pl-3.5">
              Nos níveis mais altos, todos os seus chamados recebem garantias de hardware adicionais (até 90 dias completos de cobertura total contra falhas técnicas residuais).
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LevelsPage;
