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
import { getLocalOrders, saveLocalOrders, getLocalProfessionals } from '@/utils/localDb';
import { useNotifications } from '@/context/NotificationsContext';
import { toast } from 'sonner';

const NewServiceRequestPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addNotification } = useNotifications();
  const profId = searchParams.get('prof');

  const [assignedProfessional, setAssignedProfessional] = React.useState<{ id: string, name: string } | null>(null);

  React.useEffect(() => {
    const profs = getLocalProfessionals();
    if (profId) {
      const found = profs.find(p => p.id === profId);
      if (found) {
        setAssignedProfessional({ id: found.id, name: found.name });
      }
    }
  }, [profId]);

  // Form states
  const [photo, setPhoto] = React.useState<string | null>(null);
  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState('Manutenção');
  const [description, setDescription] = React.useState('');
  const [expectedValue, setExpectedValue] = React.useState('');
  const [serviceType, setServiceType] = React.useState('Presencial'); // Presencial or Remoto
  const [city, setCity] = React.useState('');
  const [urgency, setUrgency] = React.useState('Média'); // Baixa, Média, Alta

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success('Imagem carregada com sucesso!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !expectedValue || !city) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const orderId = `o_request_${Date.now()}`;
    const orderCode = `TF-REQ-${Math.floor(10000 + Math.random() * 90000)}`;

    const newRequestedOrder = {
      id: orderId,
      code: orderCode,
      serviceId: 's_custom',
      serviceTitle: title,
      clientName: "Sofia Spencer",
      clientId: "u1",
      professionalId: assignedProfessional?.id || 'p1',
      professionalName: assignedProfessional?.name || 'Carlos Mendes',
      date: new Date().toLocaleDateString('pt-BR').slice(0, 5),
      time: 'A Combinar',
      status: 'pending' as const, // pending since it's a custom request awaiting offers
      price: Number(expectedValue),
      paymentMethod: 'pix' as const,
      address: `Suporte ${serviceType} - ${city}`
    };

    // Save locally
    const currentOrders = getLocalOrders();
    currentOrders.unshift(newRequestedOrder);
    saveLocalOrders(currentOrders);

    // Dynamic notification
    addNotification(
      "Suporte Aberto via Classificados",
      `Sua solicitação de chamado para "${title}" foi criada no painel local com sucesso.`,
      "info"
    );

    toast.success('Chamado de suporte publicado com sucesso!');
    navigate('/cliente/meus-pedidos');
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

        {/* Photo Upload Section */}
        <div className="space-y-3">
          <Label className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Foto Ilustrativa do Equipamento</Label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-foreground/10 hover:border-primary/45 rounded-2xl cursor-pointer transition-all bg-card/30 relative overflow-hidden group">
              {photo ? (
                <img src={photo} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center space-y-2">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Camera className="w-6 h-6 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground font-bold">Arraste ou clique para carregar uma imagem</p>
                  <p className="text-[10px] text-muted-foreground uppercase">PNG, JPG ou WEBP (Max 5MB)</p>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
            </label>
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
