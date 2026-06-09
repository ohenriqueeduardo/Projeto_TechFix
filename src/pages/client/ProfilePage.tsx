import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Camera, Shield, Star, MapPin, Award, CheckCircle, Sparkles } from 'lucide-react';
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
      const res = await fetch(`http://localhost:3000/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name, email, avatar }),
      });

      if (!res.ok) throw new Error('Erro ao salvar no servidor');

      const updatedUser = {
        ...currentUser,
        name,
        email,
        city,
        avatar
      };

      // 1. Update current session
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);

      // 2. Update users list in LocalStorage database
      const localUsers = JSON.parse(localStorage.getItem('techfix_users') || '[]') as User[];
      const updatedUsers = localUsers.map(u => u.id === currentUser.id ? updatedUser : u);
      localStorage.setItem('techfix_users', JSON.stringify(updatedUsers));

      toast.success('Perfil atualizado com sucesso!');
    } catch (err) {
      console.error(err);
      toast.error('Erro ao atualizar perfil.');
    }
  };

  const displayName = name || currentUser?.name || 'Sofia Spencer';
  const displayEmail = email || currentUser?.email || 'sofia@example.com';
  const displayCity = city || currentUser?.city || 'São Paulo, SP';
  const userLevelInfo = currentUser ? calculateUserLevelInfo(currentUser.id) : { level: 'Silver' };
  const userLevel = userLevelInfo.level;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-page-entrance">
      <PageHeader 
        title="Meu Perfil" 
        description="Gerencie suas informações pessoais, visualize seu nível de membro e suas conquistas na plataforma."
      />

      {/* Premium Graphic Banner (Capa) */}
      <div className="relative h-64 rounded-3xl bg-gradient-to-r from-primary/40 via-cyan-900/30 to-blue-900/40 overflow-hidden border border-white/10 flex items-center justify-between p-8 md:p-12">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>

        {/* Floating VIP Card Overlay on the right */}
        <div className="hidden md:flex ml-auto glass-card p-6 rounded-2xl bg-card/40 backdrop-blur-xl border-white/15 max-w-sm w-80 shadow-2xl items-center gap-4 transition-all hover:scale-105">
          <div className="p-3 bg-primary/20 rounded-xl text-primary animate-bounce">
            <Award className="w-8 h-8" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Status da Conta</span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            </div>
            <h4 className="font-black text-lg text-foreground">{displayName}</h4>
            <p className="text-xs text-muted-foreground font-medium">VIP {userLevel} (Desconto Ativo)</p>
          </div>
        </div>
      </div>

      {/* Profile Avatar and Details Card overlay */}
      <div className="px-8 -mt-24 relative z-10">
        <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
          <div className="relative group shrink-0">
            <img 
              src={avatar || currentUser?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayName)}`} 
              className="w-36 h-36 md:w-40 md:h-40 rounded-3xl border-8 border-background shadow-2xl object-cover" 
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
              className="absolute bottom-2 right-2 p-3 bg-primary text-primary-foreground rounded-2xl shadow-lg hover:scale-110 transition-transform">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex-1 pb-4 text-center md:text-left">
            <h2 className="text-3xl font-black mb-1.5">{displayName}</h2>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
                <MapPin className="w-4 h-4 text-primary" /> {displayCity}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
                <Shield className="w-4 h-4 text-primary" /> Nível {userLevel}
              </span>
            </div>
          </div>
          
          <div className="flex gap-3 pb-4 w-full md:w-auto justify-center">
            <Button variant="outline" className="rounded-xl border-white/10 h-11 px-5 text-xs font-bold bg-background/50 hover:bg-white/5">Ver como Público</Button>
            <Button className="btn-primary rounded-xl h-11 px-6 text-xs gap-2">
              <Sparkles className="w-4 h-4" /> Alterar Capa
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 bg-card/30 border-white/5 rounded-3xl">
              <h3 className="text-lg font-bold mb-6">Informações da Conta</h3>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold text-xs ml-1">Nome Completo</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="h-12 bg-background/50 border-white/10 rounded-xl text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-xs ml-1">E-mail</Label>
                    <Input value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 bg-background/50 border-white/10 rounded-xl text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-xs ml-1">Telefone</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-12 bg-background/50 border-white/10 rounded-xl text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold text-xs ml-1">Cidade</Label>
                    <Input value={city} onChange={(e) => setCity(e.target.value)} className="h-12 bg-background/50 border-white/10 rounded-xl text-sm" />
                  </div>
                </div>
                <div className="pt-4">
                  <Button type="submit" className="btn-primary w-full md:w-auto px-10 h-12 text-sm">Salvar Alterações</Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Right Column Stats and Progress (1/3 width) */}
          <div className="space-y-6">
            {/* Quick Metrics */}
            <Card className="p-6 bg-card/30 border-white/5 rounded-3xl">
              <h3 className="text-base font-bold mb-5">Minhas Estatísticas</h3>
              <div className="space-y-3">
                {[
                  { label: 'Serviços Contratados', value: '12', icon: CheckCircle, color: 'text-green-500' },
                  { label: 'Avaliações Enviadas', value: '8', icon: Star, color: 'text-yellow-500' },
                  { label: 'Membro desde', value: 'Jan 2024', icon: Award, color: 'text-primary' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-2.5">
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      <span className="text-xs font-semibold text-muted-foreground">{stat.label}</span>
                    </div>
                    <span className="text-xs font-black text-foreground">{stat.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* VIP Silver progress bar card */}
            <Card className="p-6 bg-gradient-to-br from-primary/10 to-blue-500/5 border-primary/20 rounded-3xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-base font-black">Nível Prata</h3>
                  <p className="text-xs text-muted-foreground mt-1">Faltam **3 serviços** para alcançar o nível **Ouro** e ganhar 10% de desconto fixo.</p>
                </div>
              </div>
              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden mt-5">
                <div className="w-[70%] h-full bg-gradient-to-r from-primary to-blue-400 shadow-[0_0_15px_rgba(0,255,255,0.5)]"></div>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">7 / 10 Serviços</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary">70% Concluído</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;