import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  Camera,
  Sparkles,
  MapPin,
  DollarSign,
  Activity,
  FileText,
  UserCheck
} from 'lucide-react';
import { useNotifications } from '@/context/NotificationsContext';
import { toast } from 'sonner';

const NewServiceRequestPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addNotification } = useNotifications();
  const profId = searchParams.get('prof');

  const currentUserStr = localStorage.getItem('user');
  const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
  const [assignedProfessional, setAssignedProfessional] = React.useState<{ id: string, name: string } | null>(null);

  React.useEffect(() => {
    if (profId) {
      const fetchProf = async () => {
        try {
          const res = await fetch(`/api/professionals/${profId}`);
          if (res.ok) {
            const data = await res.json();
            setAssignedProfessional({ id: data.id, name: data.name });
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchProf();
    }
  }, [profId]);

  // Form states
  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState('Manutenção');
  const [description, setDescription] = React.useState('');
  const [expectedValue, setExpectedValue] = React.useState('');
  const [serviceType, setServiceType] = React.useState('Presencial'); // Presencial or Remoto
  const [city, setCity] = React.useState('');
  const [urgency, setUrgency] = React.useState('Média'); // Baixa, Média, Alta

  const getCategoryBanner = (cat: string) => {
    const banners: Record<string, string> = {
      'Manutenção': 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
      'Upgrade': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      'Formatação': 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80',
      'Redes': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
      'Recuperação': 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
      'Montagem Gamer': 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
      'Diagnóstico': 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&w=800&q=80',
      'Suporte remoto': 'https://images.unsplash.com/photo-1588508065123-287b28e01390?auto=format&fit=crop&w=800&q=80'
    };
    return banners[cat] || banners['Manutenção'];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !expectedValue || !city) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!currentUser) {
      toast.error('Sessão expirada. Faça login novamente.');
      return;
    }

    try {
      const payload = {
        serviceId: 's_custom',
        serviceTitle: title,
        clientId: currentUser.id,
        clientName: currentUser.name,
        professionalId: assignedProfessional?.id || null, // Will be picked up by any professional if null
        professionalName: assignedProfessional?.name || null,
        date: new Date().toLocaleDateString('pt-BR').slice(0, 5),
        time: 'A Combinar',
        price: Number(expectedValue),
        paymentMethod: 'pix',
        address: `Suporte ${serviceType} - ${city}`
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Falha ao criar chamado técnico');
      }

      // Dynamic notification
      addNotification(
        "Suporte Aberto via Classificados",
        `Sua solicitação de chamado para "${title}" foi criada no painel com sucesso. Aguarde orçamentos ou aceite do profissional selecionado.`,
        "info"
      );

      toast.success('Chamado de suporte publicado com sucesso!');
      navigate('/cliente/meus-pedidos');
    } catch (e) {
      console.error(e);
      toast.error('Erro ao publicar chamado técnico.');
    }
  };

  const isFormValid = title && description && expectedValue && city;

  return (
    <div className="space-y-8 animate-page-entrance max-w-3xl mx-auto">
      <PageHeader
        title="Solicitar Novo Serviço"
        description="Publique um anúncio de suporte técnico para que especialistas possam lhe enviar orçamentos personalizados."
      />

      {assignedProfessional && profId && (
        <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-2xl animate-in zoom-in-95 duration-300">
          <span className="w-2.5 h-2.5 bg-primary rounded-full animate-ping shrink-0" />
          <p className="text-xs font-bold text-primary">
            Este orçamento será direcionado diretamente para o especialista: <strong className="text-foreground underline">{assignedProfessional.name}</strong>
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl space-y-6 border border-foreground/5 bg-card/20">

        {/* Dynamic Category Banner */}
        <div className="space-y-3">
          <Label className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Banner Gerado Automaticamente</Label>
          <div className="w-full h-44 rounded-2xl overflow-hidden relative shadow-lg">
            <img 
              src={getCategoryBanner(category)} 
              alt={category} 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/20 px-2 py-1 rounded-md backdrop-blur-md">
                  {category}
                </span>
                <p className="text-white text-xs font-medium opacity-90">
                  Esta imagem ilustrará seu chamado no mural de serviços.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title" className="font-bold text-xs">Título do Chamado *</Label>
            <Input
              id="title"
              placeholder="Ex: Notebook Asus travando na tela de boot"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-12 bg-card/50 border-foreground/10 rounded-xl text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="category" className="font-bold text-xs">Categoria *</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-card/50 border border-foreground/10 rounded-xl h-12 px-3 text-sm text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
              >
                {['Manutenção', 'Upgrade', 'Formatação', 'Redes', 'Recuperação', 'Montagem Gamer', 'Diagnóstico', 'Suporte remoto'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="expected" className="font-bold text-xs">Valor Máximo Esperado (R$) *</Label>
              <Input
                id="expected"
                type="number"
                placeholder="Ex: 250"
                value={expectedValue}
                onChange={(e) => setExpectedValue(e.target.value)}
                required
                className="h-12 bg-card/50 border-foreground/10 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="desc" className="font-bold text-xs">Descrição Detalhada do Problema *</Label>
            <Textarea
              id="desc"
              placeholder="Descreva minuciosamente o defeito do equipamento, comportamento e o que precisa ser resolvido."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="bg-card/50 border-foreground/10 rounded-xl text-sm min-h-[100px] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="type" className="font-bold text-xs">Tipo de Suporte *</Label>
              <select
                id="type"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full bg-card/50 border border-foreground/10 rounded-xl h-12 px-3 text-sm text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
              >
                <option value="Presencial">Presencial (Técnico vai ao local)</option>
                <option value="Remoto">Remoto (Suporte online)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="city" className="font-bold text-xs">Cidade / Estado *</Label>
              <Input
                id="city"
                placeholder="Ex: São Paulo, SP"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="h-12 bg-card/50 border-foreground/10 rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="urgency" className="font-bold text-xs">Nível de Urgência *</Label>
              <select
                id="urgency"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="w-full bg-card/50 border border-foreground/10 rounded-xl h-12 px-3 text-sm text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
              >
                <option value="Baixa">Baixa (Pode esperar dias)</option>
                <option value="Média">Média (Aguardando orçamentos)</option>
                <option value="Alta">Alta (Precisa resolver em 24h)</option>
              </select>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={!isFormValid}
          className="w-full btn-primary h-12 text-sm font-black gap-2 mt-4"
        >
          Publicar Chamado Técnico <Sparkles className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
};

export default NewServiceRequestPage;
