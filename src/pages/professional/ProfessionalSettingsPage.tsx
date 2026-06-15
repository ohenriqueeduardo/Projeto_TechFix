import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, User, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { Professional, User as UserType } from '@/types';

const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
const standardTimes = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const ProfessionalSettingsPage = () => {
  const [profile, setProfile] = useState<Professional | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  
  const [activeMenu, setActiveMenu] = useState('Geral');
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
        if (!storedUser) return;
        
        setCurrentUser(storedUser);
        setName(storedUser.name || '');
        setEmail(storedUser.email || '');
        setAvatar(storedUser.avatar || '');

        const res = await fetch(`/api/professionals/${storedUser.id}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setAvailableDays(data.availableDays || daysOfWeek.slice(0, 5));
          setAvailableTimes(data.availableTimes || standardTimes);
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleDayToggle = (day: string) => {
    setAvailableDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleTimeToggle = (time: string) => {
    setAvailableTimes(prev => 
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time].sort()
    );
  };

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

  const handleSave = async () => {
    if (!profile || !currentUser) return;
    try {
      const res = await fetch(`/api/professionals/${profile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          availableDays,
          availableTimes
        })
      });

      const resUser = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name, email, avatar })
      });

      if (res.ok && resUser.ok) {
        toast.success("Configurações salvas com sucesso!");
        const updatedUser = { ...currentUser, name, email, avatar };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
      } else {
        toast.error("Erro ao salvar configurações.");
      }
    } catch (err) {
      toast.error("Falha na conexão.");
    }
  };

  const scrollToSection = (id: string) => {
    setActiveMenu(id);
    if (id === 'Geral') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -100; 
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <span className="h-10 w-10 rounded-full border-4 border-t-primary border-white/5 animate-spin"></span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-page-entrance pb-20">
      <div>
        <h1 className="text-3xl font-bold mb-2">Configurações do Especialista</h1>
        <p className="text-muted-foreground">Gerencie sua agenda de atendimento e dados do perfil.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <nav className="space-y-2 sticky top-28 h-fit">
          {[
            { icon: SettingsIcon, label: "Geral" },
            { icon: Calendar, label: "Agenda & Horários" },
            { icon: User, label: "Perfil" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => scrollToSection(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeMenu === item.label ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="lg:col-span-3 space-y-8">
          
          <div id="Agenda & Horários" className="space-y-8 scroll-mt-28">
            <h2 className="text-2xl font-bold border-b border-white/10 pb-2">Agenda & Horários</h2>
            
            {/* DIAS DISPONÍVEIS */}
            <div className="glass-card p-8 rounded-3xl space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Dias de Atendimento</h3>
                  <p className="text-xs text-muted-foreground">Selecione os dias da semana que você trabalha.</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4">
                {daysOfWeek.map(day => {
                  const isActive = availableDays.includes(day);
                  return (
                    <button
                      key={day}
                      onClick={() => handleDayToggle(day)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                        isActive 
                        ? 'bg-primary border-primary text-primary-foreground shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-105' 
                        : 'bg-background/50 border-white/10 text-muted-foreground hover:border-white/20'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* HORÁRIOS DISPONÍVEIS */}
            <div className="glass-card p-8 rounded-3xl space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Horários de Atendimento</h3>
                  <p className="text-xs text-muted-foreground">Defina os horários em que os clientes podem agendar com você.</p>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-4">
                {standardTimes.map(time => {
                  const isActive = availableTimes.includes(time);
                  return (
                    <button
                      key={time}
                      onClick={() => handleTimeToggle(time)}
                      className={`py-2.5 rounded-xl text-sm font-bold border transition-all flex items-center justify-center ${
                        isActive 
                        ? 'bg-primary border-primary text-primary-foreground shadow-[0_0_10px_rgba(6,182,212,0.2)]' 
                        : 'bg-background/50 border-white/10 text-muted-foreground hover:border-white/20 hover:bg-white/5'
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div id="Perfil" className="space-y-8 scroll-mt-28">
            <h2 className="text-2xl font-bold border-b border-white/10 pb-2">Perfil</h2>
            <div className="glass-card p-8 rounded-3xl space-y-6 animate-in fade-in">
              <h3 className="text-xl font-bold mb-4">Informações do Perfil</h3>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="relative group shrink-0">
                  <img 
                    src={avatar || currentUser?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`} 
                    className="w-24 h-24 rounded-3xl border-4 border-background shadow-lg object-cover" 
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
                    className="absolute -bottom-2 -right-2 p-2 bg-primary text-primary-foreground rounded-xl shadow-lg hover:scale-110 transition-transform">
                    <User className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h4 className="font-bold">{name || 'Seu Nome'}</h4>
                  <p className="text-sm text-muted-foreground">Atualize sua foto de perfil</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome Completo</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-background/50 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>E-mail</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} className="bg-background/50 border-white/10" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-white/5">
            <Button variant="outline" className="rounded-xl px-8 border-white/10">Cancelar</Button>
            <Button onClick={handleSave} className="btn-primary rounded-xl px-8">Salvar Configurações</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSettingsPage;
