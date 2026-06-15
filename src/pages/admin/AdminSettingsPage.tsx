import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Shield, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";

const AdminSettingsPage = () => {
  const [activeMenu, setActiveMenu] = useState('Geral');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['Geral', 'Perfil', 'Notificações Globais', 'Segurança de Acesso'];
      let current = 'Geral';
      
      const scrollPosition = window.scrollY + 150; // offset to trigger earlier

      for (const section of sections) {
        if (section === 'Geral') continue;
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition) {
          current = section;
        }
      }
      
      if (window.scrollY < 100) {
        current = 'Geral';
      }

      setActiveMenu(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSave = () => {
    toast.success("Configurações do painel atualizadas com sucesso!");
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

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-page-entrance pb-20">
      <div>
        <h1 className="text-3xl font-bold mb-2">Ajustes Root</h1>
        <p className="text-muted-foreground">Gerencie as configurações da sua conta de administrador e alertas globais.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative items-start">
        <nav className="space-y-2 sticky top-32 self-start h-fit w-full">
          {[
            { icon: SettingsIcon, label: "Geral" },
            { icon: User, label: "Perfil" },
            { icon: Bell, label: "Notificações Globais" },
            { icon: Shield, label: "Segurança de Acesso" },
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
          
          <div id="Perfil" className="space-y-8 scroll-mt-28">
            <h2 className="text-2xl font-bold border-b border-white/10 pb-2 flex items-center gap-2">
              <User className="w-6 h-6 text-primary" /> Perfil Admin
            </h2>
            <div className="glass-card p-8 rounded-3xl space-y-6">
              <h3 className="text-xl font-bold">Dados de Acesso</h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label>Nome de Exibição</Label>
                  <Input defaultValue="Henrique Eduardo" className="bg-background/50 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>E-mail Corporativo</Label>
                  <Input defaultValue="admin@techfix.com" className="bg-background/50 border-white/10" />
                </div>
              </div>
            </div>
          </div>

          <div id="Notificações Globais" className="space-y-8 scroll-mt-28">
            <h2 className="text-2xl font-bold border-b border-white/10 pb-2 flex items-center gap-2">
              <Bell className="w-6 h-6 text-primary" /> Notificações Globais
            </h2>
            <div className="glass-card p-8 rounded-3xl space-y-6">
              <h3 className="text-xl font-bold">Alertas do Sistema</h3>
              <p className="text-sm text-muted-foreground mb-4">Escolha quais eventos do sistema disparam notificações para você.</p>
              <div className="space-y-4">
                {[
                  { label: "Novos Técnicos", desc: "Avisar quando um profissional enviar documentos para análise.", checked: true },
                  { label: "Solicitações de Saque", desc: "Avisar quando houver pedidos de retirada pendentes.", checked: true },
                  { label: "Relatórios de Faturamento", desc: "Resumo financeiro no final do dia.", checked: false },
                  { label: "Erros de Servidor (Logs)", desc: "Alertas críticos sobre quedas ou bugs.", checked: true },
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
          </div>

          <div id="Segurança de Acesso" className="space-y-8 scroll-mt-28">
            <h2 className="text-2xl font-bold border-b border-white/10 pb-2 flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" /> Segurança
            </h2>
            <div className="glass-card p-8 rounded-3xl space-y-6">
              <h3 className="text-xl font-bold">Credenciais de Nível Root</h3>
              <p className="text-sm text-destructive mb-4 font-bold">Aviso: A alteração da senha mestre desconectará todas as outras instâncias logadas imediatamente.</p>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Senha Mestre Atual</Label>
                  <Input type="password" placeholder="********" className="bg-background/50 border-white/10" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Nova Senha</Label>
                    <Input type="password" placeholder="Nova senha mestre" className="bg-background/50 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirmar Nova Senha</Label>
                    <Input type="password" placeholder="Repita a senha mestre" className="bg-background/50 border-white/10" />
                  </div>
                </div>
                <div className="flex items-center justify-between py-4 border-t border-white/10 mt-4">
                  <div className="space-y-0.5">
                    <p className="font-medium">Modo de Acesso Restrito (IP)</p>
                    <p className="text-xs text-muted-foreground">Bloqueia o login administrativo para IPs desconhecidos.</p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-white/5">
            <Button variant="outline" className="rounded-xl px-8 border-white/10">Cancelar Modificações</Button>
            <Button onClick={handleSave} className="btn-primary rounded-xl px-8">Salvar Configurações Root</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
