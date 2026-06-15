import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, User, Briefcase, Settings as SettingsIcon, AlertTriangle } from "lucide-react";
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
  const [specialty, setSpecialty] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [basePrice, setBasePrice] = useState('150');
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveMenu(entry.target.id);
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px' });

    const sections = ['Geral', 'Atuação Profissional', 'Agenda & Horários', 'Perfil', 'Zona de Perigo'];
    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

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
          setSpecialty(data.specialty || '');
          setCity(data.city || '');
          setBio(data.bio || '');
          setBasePrice(data.price?.toString() || '150');
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
      const parsedPrice = parseFloat(basePrice);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        toast.error("O preço base deve ser um número válido e positivo.");
        return;
      }

      const res = await fetch(`/api/professionals/${profile.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          availableDays,
          availableTimes,
          specialty,
          city,
          bio,
          price: parsedPrice
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
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        <p className="text-muted-foreground">Gerencie sua agenda de atendimento, sua vitrine profissional e dados do perfil.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative items-start">
        <nav className="space-y-2 sticky top-32 self-start h-fit w-full">
          {[
            { icon: SettingsIcon, label: "Geral" },
            { icon: Briefcase, label: "Atuação Profissional" },
            { icon: Calendar, label: "Agenda & Horários" },
            { icon: User, label: "Perfil" },
            { icon: AlertTriangle, label: "Zona de Perigo" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => scrollToSection(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeMenu === item.label ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'text-muted-foreground hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="lg:col-span-3 space-y-12">
          
          <div id="Atuação Profissional" className="space-y-8 scroll-mt-28">
            <h2 className="text-2xl font-bold border-b border-white/10 pb-2 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-primary" /> Atuação Profissional
            </h2>
            <div className="glass-card p-8 rounded-3xl space-y-6">
              <h3 className="text-xl font-bold mb-2">Sua Vitrine</h3>
              <p className="text-sm text-muted-foreground mb-6">Estes dados aparecem no seu card quando os clientes buscam por profissionais.</p>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Especialidade Principal</Label>
                    <Input 
                      value={specialty} 
                      onChange={(e) => setSpecialty(e.target.value)} 
                      placeholder="Ex: Hardware e Redes" 
                      className="bg-background/50 border-white/10" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Taxa Base / Valor Mínimo (R$)</Label>
                    <Input 
                      type="number"
                      value={basePrice} 
                      onChange={(e) => setBasePrice(e.target.value)} 
                      className="bg-background/50 border-white/10" 
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Cidades de Atendimento</Label>
                  <Input 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    placeholder="Ex: São Paulo, SP" 
                    className="bg-background/50 border-white/10" 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Resumo Profissional (Bio)</Label>
                  <textarea 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Conte um pouco sobre sua experiência e como você resolve os problemas dos clientes." 
                    className="flex min-h-[120px] w-full rounded-2xl border border-white/10 bg-background/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>

          <div id="Agenda & Horários" className="space-y-8 scroll-mt-28">
            <h2 className="text-2xl font-bold border-b border-white/10 pb-2 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" /> Agenda & Horários
            </h2>
            
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
            <h2 className="text-2xl font-bold border-b border-white/10 pb-2 flex items-center gap-2">
              <User className="w-6 h-6 text-primary" /> Perfil
            </h2>
            <div className="glass-card p-8 rounded-3xl space-y-6">
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

          <div id="Zona de Perigo" className="space-y-8 scroll-mt-28">
            <h2 className="text-2xl font-bold border-b border-destructive/30 pb-2 flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-6 h-6" /> Zona de Perigo
            </h2>
            <div className="glass-card p-8 rounded-3xl border border-destructive/20 bg-destructive/5 space-y-6">
              <h3 className="text-xl font-bold text-destructive">Excluir Conta</h3>
              <p className="text-sm text-muted-foreground">
                Ao excluir sua conta, você perderá acesso permanente a todos os seus dados, histórico de serviços e configurações. Esta ação é irreversível.
              </p>
              <div className="pt-2">
                <Button variant="destructive" className="rounded-xl px-8 font-bold">Excluir Minha Conta Permanentemente</Button>
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
