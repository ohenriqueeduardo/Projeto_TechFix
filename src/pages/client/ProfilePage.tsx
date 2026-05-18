import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Camera, Shield, Star, MapPin, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';

const ProfilePage = () => {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Perfil atualizado com sucesso!');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="relative h-48 rounded-[3rem] bg-gradient-to-r from-primary/20 to-blue-600/20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
      </div>

      <div className="px-8 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
          <div className="relative group">
            <img 
              src="https://i.pravatar.cc/150?u=sofia" 
              className="w-40 h-40 rounded-[2.5rem] border-8 border-background shadow-2xl object-cover" 
              alt="Avatar" 
            />
            <button className="absolute bottom-2 right-2 p-3 bg-primary text-background rounded-2xl shadow-lg hover:scale-110 transition-transform">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 pb-4">
            <h1 className="text-4xl font-black mb-1">Sofia Spencer</h1>
            <div className="flex flex-wrap gap-4">
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
                <MapPin className="w-4 h-4 text-primary" /> São Paulo, SP
              </span>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
                <Shield className="w-4 h-4 text-primary" /> Cliente Prata
              </span>
            </div>
          </div>
          <div className="flex gap-3 pb-4">
            <Button variant="outline" className="rounded-xl border-white/10 h-12 px-6">Ver como Público</Button>
            <Button className="btn-primary rounded-xl h-12 px-8">Editar Capa</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 bg-card/30 border-white/5 rounded-[2.5rem]">
              <h3 className="text-xl font-bold mb-6">Informações da Conta</h3>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="font-bold ml-1">Nome Completo</Label>
                    <Input defaultValue="Sofia Spencer" className="h-14 bg-background/50 border-white/10 rounded-2xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold ml-1">E-mail</Label>
                    <Input defaultValue="sofia@example.com" className="h-14 bg-background/50 border-white/10 rounded-2xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold ml-1">Telefone</Label>
                    <Input defaultValue="(11) 99999-9999" className="h-14 bg-background/50 border-white/10 rounded-2xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold ml-1">Cidade</Label>
                    <Input defaultValue="São Paulo, SP" className="h-14 bg-background/50 border-white/10 rounded-2xl" />
                  </div>
                </div>
                <div className="pt-4">
                  <Button type="submit" className="btn-primary w-full md:w-auto px-12 h-14 text-lg">Salvar Alterações</Button>
                </div>
              </form>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-8 bg-card/30 border-white/5 rounded-[2.5rem]">
              <h3 className="text-xl font-bold mb-6">Estatísticas</h3>
              <div className="space-y-4">
                {[
                  { label: 'Serviços Contratados', value: '12', icon: Star, color: 'text-yellow-500' },
                  { label: 'Membro desde', value: 'Jan 2024', icon: Shield, color: 'text-blue-500' },
                  { label: 'Avaliações Dadas', value: '8', icon: Star, color: 'text-primary' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                    <div className="flex items-center gap-3">
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                      <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                    </div>
                    <span className="font-bold">{stat.value}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-8 bg-primary/5 border-primary/10 rounded-[2.5rem]">
              <h3 className="text-xl font-bold mb-2">Nível Prata</h3>
              <p className="text-sm text-muted-foreground mb-6">Você está a 3 serviços de se tornar um cliente <strong>Ouro</strong> e ganhar 10% de desconto fixo.</p>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-primary shadow-[0_0_15px_rgba(0,255,255,0.5)]"></div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest mt-3 text-right text-primary">70% Concluído</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;