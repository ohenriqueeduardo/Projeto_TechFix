import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { User, Bell, Shield, CreditCard, Smartphone } from "lucide-react";
import { toast } from "sonner";

const SettingsPage = () => {
  const handleSave = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground">Gerencie sua conta e preferências de uso.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <nav className="space-y-2">
          {[
            { icon: User, label: "Perfil", active: true },
            { icon: Bell, label: "Notificações" },
            { icon: Shield, label: "Segurança" },
            { icon: CreditCard, label: "Pagamentos" },
            { icon: Smartphone, label: "Dispositivos" },
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
          <div className="glass-card p-8 rounded-3xl space-y-6">
            <h3 className="text-xl font-bold">Informações Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Nome Completo</Label>
                <Input defaultValue="Sofia Spencer" className="bg-background/50 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input defaultValue="sofia@example.com" className="bg-background/50 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input defaultValue="(11) 99999-9999" className="bg-background/50 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label>CPF</Label>
                <Input defaultValue="***.***.***-**" disabled className="bg-background/50 border-white/10 opacity-50" />
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl space-y-6">
            <h3 className="text-xl font-bold">Preferências de Notificação</h3>
            <div className="space-y-4">
              {[
                { label: "E-mails de marketing", desc: "Receba novidades e promoções exclusivas." },
                { label: "Alertas de pedidos", desc: "Notificações sobre o status dos seus serviços.", checked: true },
                { label: "Mensagens do chat", desc: "Avisar quando um técnico enviar mensagem.", checked: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.checked} />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" className="rounded-xl px-8">Cancelar</Button>
            <Button onClick={handleSave} className="btn-primary rounded-xl px-8">Salvar Alterações</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;