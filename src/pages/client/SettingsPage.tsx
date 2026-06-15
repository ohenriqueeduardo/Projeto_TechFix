import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Shield, CreditCard, Smartphone, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";

const SettingsPage = () => {
  const [activeMenu, setActiveMenu] = useState('Geral');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['Geral', 'Perfil', 'Notificações', 'Segurança', 'Pagamentos', 'Dispositivos'];
      let current = 'Geral';
      
      for (const section of sections) {
        if (section === 'Geral') continue;
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) {
            current = section;
          }
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
    toast.success("Configurações salvas com sucesso!");
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
        <h1 className="text-3xl font-bold mb-2">Configurações</h1>
        <p className="text-muted-foreground">Gerencie sua conta e preferências de uso.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 relative items-start">
        <nav className="space-y-2 sticky top-32 self-start h-fit w-full">
          {[
            { icon: SettingsIcon, label: "Geral" },
            { icon: User, label: "Perfil" },
            { icon: Bell, label: "Notificações" },
            { icon: Shield, label: "Segurança" },
            { icon: CreditCard, label: "Pagamentos" },
            { icon: Smartphone, label: "Dispositivos" },
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
              <User className="w-6 h-6 text-primary" /> Perfil
            </h2>
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
          </div>

          <div id="Notificações" className="space-y-8 scroll-mt-28">
            <h2 className="text-2xl font-bold border-b border-white/10 pb-2 flex items-center gap-2">
              <Bell className="w-6 h-6 text-primary" /> Notificações
            </h2>
            <div className="glass-card p-8 rounded-3xl space-y-6">
              <h3 className="text-xl font-bold">Preferências de Notificação</h3>
              <div className="space-y-4">
                {[
                  { label: "E-mails de marketing", desc: "Receba novidades e promoções exclusivas.", checked: false },
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
          </div>

          <div id="Segurança" className="space-y-8 scroll-mt-28">
            <h2 className="text-2xl font-bold border-b border-white/10 pb-2 flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" /> Segurança
            </h2>
            <div className="glass-card p-8 rounded-3xl space-y-6">
              <h3 className="text-xl font-bold">Segurança da Conta</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>Senha Atual</Label>
                  <Input type="password" placeholder="********" className="bg-background/50 border-white/10" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Nova Senha</Label>
                    <Input type="password" placeholder="Nova senha" className="bg-background/50 border-white/10" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirmar Nova Senha</Label>
                    <Input type="password" placeholder="Confirmar nova senha" className="bg-background/50 border-white/10" />
                  </div>
                </div>
                <div className="flex items-center justify-between py-4 border-t border-white/10">
                  <div className="space-y-0.5">
                    <p className="font-medium">Autenticação de Dois Fatores (2FA)</p>
                    <p className="text-xs text-muted-foreground">Proteja sua conta com uma camada extra de segurança.</p>
                  </div>
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">Ativar 2FA</Button>
                </div>
              </div>
            </div>
          </div>

          <div id="Pagamentos" className="space-y-8 scroll-mt-28">
            <h2 className="text-2xl font-bold border-b border-white/10 pb-2 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-primary" /> Pagamentos
            </h2>
            <div className="glass-card p-8 rounded-3xl space-y-6">
              <h3 className="text-xl font-bold">Métodos de Pagamento</h3>
              <p className="text-sm text-muted-foreground mb-4">Gerencie os cartões e chaves PIX salvos para pagamento rápido.</p>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-slate-800 rounded flex items-center justify-center">
                      <span className="font-bold text-xs">VISA</span>
                    </div>
                    <div>
                      <p className="font-bold">Visa terminando em 4242</p>
                      <p className="text-xs text-muted-foreground">Expira em 12/28</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive text-xs">Remover</Button>
                </div>
                <Button variant="outline" className="w-full border-dashed border-white/20 text-muted-foreground hover:text-white">
                  + Adicionar novo cartão
                </Button>
              </div>
            </div>
          </div>

          <div id="Dispositivos" className="space-y-8 scroll-mt-28">
            <h2 className="text-2xl font-bold border-b border-white/10 pb-2 flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-primary" /> Dispositivos
            </h2>
            <div className="glass-card p-8 rounded-3xl space-y-6">
              <h3 className="text-xl font-bold">Sessões Ativas</h3>
              <p className="text-sm text-muted-foreground mb-4">Veja de onde você está conectado e desconecte dispositivos desconhecidos.</p>
              
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Smartphone className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-bold">iPhone 14 Pro Max <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full ml-2">Atual</span></p>
                      <p className="text-xs text-muted-foreground">São Paulo, Brasil • App Mobile</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 flex items-center justify-center"><span className="text-muted-foreground text-xs">💻</span></div>
                    <div>
                      <p className="font-bold">Chrome no Windows</p>
                      <p className="text-xs text-muted-foreground">Rio de Janeiro, Brasil • Último acesso ontem</p>
                    </div>
                  </div>
                  <Button variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive text-xs">Desconectar</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-white/5">
            <Button variant="outline" className="rounded-xl px-8 border-white/10">Descartar</Button>
            <Button onClick={handleSave} className="btn-primary rounded-xl px-8">Salvar Alterações</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;