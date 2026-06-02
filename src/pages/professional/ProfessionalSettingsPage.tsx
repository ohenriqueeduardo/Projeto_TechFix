import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, User, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { Professional } from '@/types';

const daysOfWeek = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
const standardTimes = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

const ProfessionalSettingsPage = () => {
  const [profile, setProfile] = useState<Professional | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
        if (!storedUser) return;
        
        const res = await fetch(`http://localhost:3000/api/professionals/${storedUser.id}`);
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

  const handleSave = async () => {
    if (!profile) return;
    try {
      const res = await fetch(`http://localhost:3000/api/professionals/${profile.userId}`, {
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

      if (res.ok) {
        toast.success("Configurações salvas com sucesso!");
      } else {
        toast.error("Erro ao salvar configurações.");
      }
    } catch (err) {
      toast.error("Falha na conexão.");
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
    <div className="max-w-4xl mx-auto space-y-10 animate-page-entrance">
      <div>
        <h1 className="text-3xl font-bold mb-2">Configurações do Especialista</h1>
        <p className="text-muted-foreground">Gerencie sua agenda de atendimento e dados do perfil.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <nav className="space-y-2">
          {[
            { icon: Calendar, label: "Agenda & Horários", active: true },
            { icon: User, label: "Perfil" },
            { icon: SettingsIcon, label: "Geral" },
          ].map((item, i) => (
            <button
              key={i}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="lg:col-span-3 space-y-8">
          
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

          <div className="flex justify-end gap-4">
            <Button variant="outline" className="rounded-xl px-8 border-white/10">Cancelar</Button>
            <Button onClick={handleSave} className="btn-primary rounded-xl px-8">Salvar Agenda</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalSettingsPage;
