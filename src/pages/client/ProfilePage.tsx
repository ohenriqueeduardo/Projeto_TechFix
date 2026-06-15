import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Camera, Shield, Star, MapPin, Award, CheckCircle, Sparkles, Briefcase, Activity, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { calculateUserLevelInfo } from '@/utils/levels';
import { PageHeader } from '@/components/ui/PageHeader';

import { User } from '@/types';

const ProfilePage = () => {
  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('(11) 99999-9999');
  const [city, setCity] = React.useState('');
  const [avatar, setAvatar] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser) as User;
      setCurrentUser(parsed);
      setName(parsed.name || '');
      setEmail(parsed.email || '');
      setPhone(parsed.phone || '(11) 99999-9999');
      setCity(parsed.city || 'São Paulo, SP');
      setAvatar(parsed.avatar || '');
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const res = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name, email, avatar, phone }),
      });

      if (!res.ok) throw new Error('Erro ao salvar no servidor');

      const updatedUser = {
        ...currentUser,
        name,
        email,
        phone,
        city,
        avatar
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);

      const localUsers = JSON.parse(localStorage.getItem('techfix_users') || '[]') as User[];
      const updatedUsers = localUsers.map(u => u.id === currentUser.id ? updatedUser : u);
      localStorage.setItem('techfix_users', JSON.stringify(updatedUsers));

      toast.success('Perfil atualizado com sucesso!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao atualizar perfil.');
    }
  };

  const displayName = name || currentUser?.name || 'Carregando...';
  const displayCity = city || currentUser?.city || 'São Paulo, SP';
  const userLevelInfo = currentUser ? calculateUserLevelInfo(currentUser.id) : { level: 'Bronze' };
  const userLevel = userLevelInfo.level;
  const role = currentUser?.role || 'client';

  // Role-based styling and content
  const roleStyles = {
    client: {
      gradient: "from-primary/40 via-cyan-900/30 to-blue-900/40",
      accent: "text-blue-400",
      icon: Award,
      title: `VIP ${userLevel}`,
      subtitle: "(Benefícios e Descontos)",
      stats: [
        { label: 'Serviços Contratados', value: '12', icon: CheckCircle, color: 'text-green-500' },
        { label: 'Avaliações Enviadas', value: '8', icon: Star, color: 'text-yellow-500' },
        { label: 'Membro desde', value: 'Jan 2024', icon: Award, color: 'text-primary' },
      ]
    },
    professional: {
      gradient: "from-orange-500/40 via-amber-900/30 to-orange-900/40",
      accent: "text-orange-400",
      icon: Briefcase,
      title: "Técnico Homologado",
      subtitle: "(Parceiro TechFix)",
      stats: [
        { label: 'Serviços Realizados', value: '45', icon: CheckCircle, color: 'text-green-500' },
        { label: 'Avaliações Recebidas', value: '4.9', icon: Star, color: 'text-yellow-500' },
        { label: 'Membro desde', value: 'Out 2023', icon: Award, color: 'text-orange-400' },
      ]
    },
    admin: {
      gradient: "from-purple-500/40 via-indigo-900/30 to-purple-900/40",
      accent: "text-purple-400",
      icon: Shield,
      title: "Administrador",
      subtitle: "(Acesso Irrestrito)",
      stats: [
        { label: 'Ações Registradas', value: '1,284', icon: Activity, color: 'text-purple-400' },
        { label: 'Relatórios Gerados', value: '56', icon: Briefcase, color: 'text-blue-400' },
        { label: 'Membro desde', value: 'Set 2023', icon: Shield, color: 'text-primary' },
      ]
    },
    both: {
      gradient: "from-primary/40 via-cyan-900/30 to-blue-900/40",
      accent: "text-blue-400",
      icon: Award,
      title: `VIP ${userLevel}`,
      subtitle: "(Múltiplos Acessos)",
      stats: [
        { label: 'Interações Totais', value: '57', icon: Activity, color: 'text-green-500' },
        { label: 'Membro desde', value: 'Jan 2024', icon: Award, color: 'text-primary' },
      ]
    }
  };

  const currentRoleStyle = roleStyles[role] || roleStyles.client;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-page-entrance pb-12">
      <PageHeader 
        title="Meu Perfil" 
        description="Gerencie suas informações pessoais e visualize suas estatísticas de acordo com seu acesso na plataforma."
      />

      {/* Premium Graphic Banner */}
      <div className={`relative h-auto md:h-72 rounded-[2rem] bg-gradient-to-r ${currentRoleStyle.gradient} overflow-hidden border border-white/5 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 shadow-2xl gap-8`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-black/40 rounded-full blur-3xl"></div>

        {/* Left Side: Avatar and Name */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 z-10 w-full md:w-auto text-center md:text-left mt-4 md:mt-0">
          <div className="relative group shrink-0">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
            <img 
              src={avatar || currentUser?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayName)}`} 
              className="w-32 h-32 md:w-40 md:h-40 rounded-full border-[4px] border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] object-cover relative z-0 transition-transform duration-500 group-hover:scale-105 bg-black/20" 
              alt="Avatar" 
            />
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 p-3 bg-white text-black rounded-full shadow-xl hover:scale-110 transition-transform z-20 border-2 border-transparent">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 pb-2 flex flex-col justify-center h-full">
            <h2 className="text-3xl md:text-4xl font-black mb-3 tracking-tight text-white drop-shadow-md">{displayName}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="flex items-center gap-1.5 text-xs text-white/90 font-bold bg-black/30 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                <MapPin className="w-3.5 h-3.5" /> {displayCity}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-white/90 font-bold bg-black/30 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
                <Shield className="w-3.5 h-3.5" /> Conta {role === 'admin' ? 'Verificada (Admin)' : role === 'professional' ? 'Homologada' : 'Ativa'}
              </span>
            </div>
            <div className="mt-4 flex justify-center md:justify-start">
              <Button className="rounded-xl h-10 px-5 text-xs font-bold gap-2 shadow-lg bg-white/10 text-white hover:bg-white/20 border border-white/10 backdrop-blur-md transition-all">
                <Sparkles className="w-3.5 h-3.5" /> Atualizar Capa
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side: Floating Role Card Overlay */}
        <div className="hidden md:flex ml-auto glass-card p-6 rounded-2xl bg-black/40 backdrop-blur-2xl border-white/10 max-w-sm w-80 shadow-[0_0_40px_rgba(0,0,0,0.5)] items-center gap-5 transition-all hover:scale-105 group relative overflow-hidden z-10">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className={`p-4 bg-white/5 rounded-2xl ${currentRoleStyle.accent} shadow-inner`}>
            <currentRoleStyle.icon className="w-8 h-8" />
          </div>
          <div className="flex-1 space-y-1 z-10">
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] font-black uppercase tracking-widest ${currentRoleStyle.accent}`}>Nível de Acesso</span>
            </div>
            <h4 className="font-black text-lg text-white leading-tight">{currentRoleStyle.title}</h4>
            <p className="text-xs text-white/60 font-medium">{currentRoleStyle.subtitle}</p>
          </div>
        </div>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 bg-card/40 backdrop-blur-md border-white/5 rounded-3xl shadow-xl">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center">
                  <UserIcon className="w-4 h-4" />
                </span>
                Informações Pessoais
              </h3>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2.5">
                    <Label className="font-bold text-xs text-muted-foreground ml-1">Nome Completo</Label>
                    <Input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="h-14 bg-black/20 border-white/5 rounded-2xl text-sm focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:border-foreground/30 transition-all px-5" 
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="font-bold text-xs text-muted-foreground ml-1">E-mail</Label>
                    <Input 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="h-14 bg-black/20 border-white/5 rounded-2xl text-sm focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:border-foreground/30 transition-all px-5" 
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="font-bold text-xs text-muted-foreground ml-1">Telefone</Label>
                    <Input 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      className="h-14 bg-black/20 border-white/5 rounded-2xl text-sm focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:border-foreground/30 transition-all px-5" 
                    />
                  </div>
                  <div className="space-y-2.5">
                    <Label className="font-bold text-xs text-muted-foreground ml-1">Cidade Principal</Label>
                    <Input 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)} 
                      className="h-14 bg-black/20 border-white/5 rounded-2xl text-sm focus-visible:ring-1 focus-visible:ring-foreground/20 focus-visible:border-foreground/30 transition-all px-5" 
                    />
                  </div>
                </div>
                <div className="pt-6 border-t border-white/5 flex justify-end">
                  <Button type="submit" className="w-full md:w-auto px-10 h-14 text-sm font-bold rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all">
                    Salvar Alterações
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Right Column Stats and Progress */}
          <div className="space-y-6">
            <Card className="p-8 bg-card/40 backdrop-blur-md border-white/5 rounded-3xl shadow-xl">
              <h3 className="text-lg font-bold mb-6">Métricas de Acesso</h3>
              <div className="space-y-4">
                {currentRoleStyle.stats.map((stat, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                        <stat.icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground">{stat.label}</span>
                    </div>
                    <span className="text-sm font-black text-foreground">{stat.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Role-specific bottom card */}
            {role === 'client' && (
              <Card className="p-8 bg-gradient-to-br from-primary/10 to-blue-500/5 border-primary/20 rounded-3xl relative overflow-hidden shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black">Progresso VIP</h3>
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">Faltam <strong>3 serviços</strong> para alcançar o nível <strong>Ouro</strong> e ganhar descontos fixos.</p>
                  </div>
                </div>
                <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden mt-6 border border-white/5">
                  <div className="w-[70%] h-full bg-gradient-to-r from-primary to-blue-400 shadow-[0_0_15px_rgba(0,255,255,0.5)]"></div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">7 / 10 Serviços</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">70% Concluído</span>
                </div>
              </Card>
            )}

            {role === 'professional' && (
              <Card className="p-8 bg-gradient-to-br from-orange-500/10 to-amber-500/5 border-orange-500/20 rounded-3xl relative overflow-hidden shadow-xl text-center">
                <Award className="w-12 h-12 text-orange-500 mx-auto mb-4 opacity-80" />
                <h3 className="text-lg font-black text-foreground">Selo de Excelência</h3>
                <p className="text-xs text-muted-foreground mt-2">Mantenha sua nota acima de 4.8 para receber destaque nas buscas da plataforma.</p>
              </Card>
            )}
            
            {role === 'admin' && (
              <Card className="p-8 bg-gradient-to-br from-purple-500/10 to-indigo-500/5 border-purple-500/20 rounded-3xl relative overflow-hidden shadow-xl text-center">
                <Shield className="w-12 h-12 text-purple-500 mx-auto mb-4 opacity-80" />
                <h3 className="text-lg font-black text-foreground">Acesso Master</h3>
                <p className="text-xs text-muted-foreground mt-2">Todas as atividades no painel administrativo são logadas por questões de segurança.</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;