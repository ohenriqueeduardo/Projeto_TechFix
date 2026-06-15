import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User, Bell, Shield, Settings as SettingsIcon, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { User as UserType } from '@/types';

const AdminSettingsPage = () => {
  const [activeMenu, setActiveMenu] = useState('perfil');
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [avatar, setAvatar] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
      setCurrentUser(user);
      setAvatar(user.avatar || '');
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveMenu(entry.target.id);
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px' });

    const sections = [
      { id: 'perfil', label: 'Perfil' },
      { id: 'notificacoes', label: 'Notificações Globais' },
      { id: 'seguranca', label: 'Segurança de Acesso' },
      { id: 'zona-perigo', label: 'Zona de Perigo' }
    ];
    sections.forEach(section => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setAvatar(result);
        if (currentUser) {
          const updatedUser = { ...currentUser, avatar: result };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setCurrentUser(updatedUser);
          toast.success("Foto de perfil atualizada!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    toast.success("Configurações do painel atualizadas com sucesso!");
  };

  const scrollToSection = (id: string) => {
    setActiveMenu(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
            { icon: User, label: "Perfil", id: "perfil" },
            { icon: Bell, label: "Notificações Globais", id: "notificacoes" },
            { icon: Shield, label: "Segurança de Acesso", id: "seguranca" },
            { icon: AlertTriangle, label: "Zona de Perigo", id: "zona-perigo" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => scrollToSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeMenu === item.id ? 'bg-primary text-primary-foreground shadow-[0_0_15px_rgba(6,182,212,0.2)]' : 'text-muted-foreground hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="lg:col-span-3 space-y-12">
          
          <div id="perfil" className="space-y-8 scroll-mt-28">
            <h2 className="text-2xl font-bold border-b border-white/10 pb-2 flex items-center gap-2">
              <User className="w-6 h-6 text-primary" /> Perfil Admin
            </h2>
            <div className="glass-card p-8 rounded-3xl space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/10">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full bg-background border-2 border-primary object-cover" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-3xl font-bold overflow-hidden">
                    {currentUser?.name?.substring(0, 2).toUpperCase() || 'HE'}
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                />
                <div className="space-y-2 text-center sm:text-left">
                  <h3 className="font-bold">Foto de Perfil</h3>
                  <p className="text-xs text-muted-foreground">Recomendado imagem quadrada, no formato PNG ou JPG.</p>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline" 
                    size="sm" 
                    className="mt-2 text-xs border-white/10 hover:bg-white/5"
                  >
                    Alterar Imagem
                  </Button>
                </div>
              </div>

              <h3 className="text-xl font-bold">Dados de Acesso</h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label>Nome de Exibição</Label>
                  <Input defaultValue={currentUser?.name || "Henrique Eduardo"} className="bg-background/50 border-white/10" />
                </div>
                <div className="space-y-2">
                  <Label>E-mail Corporativo</Label>
                  <Input defaultValue={currentUser?.email || "admin@techfix.com"} className="bg-background/50 border-white/10" />
                </div>
              </div>
            </div>
          </div>

          <div id="notificacoes" className="space-y-8 scroll-mt-28">
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

          <div id="seguranca" className="space-y-8 scroll-mt-28">
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

          <div id="zona-perigo" className="space-y-8 scroll-mt-28">
            <h2 className="text-2xl font-bold border-b border-destructive/30 pb-2 flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-6 h-6" /> Zona de Perigo
            </h2>
            <div className="glass-card p-8 rounded-3xl border border-destructive/20 bg-destructive/5 space-y-6">
              <h3 className="text-xl font-bold text-destructive">Excluir Conta Administrativa</h3>
              <p className="text-sm text-muted-foreground">
                Ao excluir sua conta administrativa, você perderá acesso permanente a todos os controles da plataforma e seu registro de auditoria. Esta ação é irreversível.
              </p>
              <div className="pt-2">
                <Button variant="destructive" className="rounded-xl px-8 font-bold">Excluir Minha Conta Permanentemente</Button>
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
