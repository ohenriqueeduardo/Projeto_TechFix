import React from 'react';
import { useParams, useNavigate, Routes, Route } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle2, Calendar, MapPin, CreditCard, ArrowRight } from 'lucide-react';
import { services, professionals } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';
import type { Professional, Service } from '@/types';
import { toast } from 'sonner';

const Stepper = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { icon: CheckCircle2, label: 'Serviço' },
    { icon: Calendar, label: 'Data & Hora' },
    { icon: MapPin, label: 'Endereço' },
    { icon: CreditCard, label: 'Pagamento' },
  ];

  // Calculate dynamic progress percent
  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="relative mb-16 max-w-2xl mx-auto">
      {/* Background Track Line */}
      <div className="absolute top-5 left-4 right-4 h-[2px] bg-white/10 -translate-y-1/2 -z-10" />
      {/* Animated Colored Progress Bar */}
      <div 
        className="absolute top-5 left-4 h-[2px] bg-primary -translate-y-1/2 -z-10 transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.6)]" 
        style={{ width: `calc(${progressPercent}% - 8px)` }}
      />

      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const isCompleted = i + 1 < currentStep;
          const isActive = i + 1 === currentStep;
          return (
            <div key={i} className="flex flex-col items-center gap-2 relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                isCompleted 
                ? 'bg-primary border-primary text-background' 
                : isActive 
                ? 'bg-background border-primary text-primary scale-110 shadow-[0_0_15px_rgba(6,182,212,0.35)]' 
                : 'border-white/10 text-muted-foreground'
              }`}>
                <step.icon className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'animate-bounce' : ''}`} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider absolute -bottom-6 whitespace-nowrap transition-colors duration-500 ${
                i + 1 <= currentStep ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

type ServiceStepProps = {
  service: Service;
};

type ServiceAndProfessionalStepProps = {
  service: Service;
  professional: Professional;
};

const CheckoutFlow = () => {
  const { id } = useParams();
  const service = services.find(s => s.id === id);
  const professional = professionals.find(p => p.id === service?.professionalId);

  if (!service || !professional) return <div>Serviço não encontrado</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Routes>
        <Route index element={<Step1 service={service} professional={professional} />} />
        <Route path="data-hora" element={<Step2 service={service} />} />
        <Route path="endereco" element={<Step3 service={service} />} />
        <Route path="pagamento" element={<Step4 service={service} />} />
        <Route path="confirmado" element={<OrderConfirmed service={service} professional={professional} />} />
      </Routes>
    </div>
  );
};

const Step1 = ({ service, professional }: ServiceAndProfessionalStepProps) => {
  const navigate = useNavigate();
  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
      <Stepper currentStep={1} />
      <div className="glass-card p-8 rounded-3xl space-y-6">
        <h2 className="text-2xl font-bold">Resumo do Serviço</h2>
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5">
          <img src={service.image} className="w-20 h-20 rounded-xl object-cover" alt="" />
          <div>
            <h3 className="font-bold text-lg">{service.title}</h3>
            <p className="text-sm text-muted-foreground">Técnico: {professional.name}</p>
            <p className="text-sm text-primary font-bold">{formatCurrency(service.price)}</p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Duração estimada: <strong>{service.duration}</strong></p>
          <p className="text-sm text-muted-foreground">O valor final pode variar dependendo da complexidade encontrada pelo técnico.</p>
        </div>
        <Button onClick={() => navigate('data-hora')} className="w-full btn-primary h-14 text-lg gap-2">
          Continuar <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

const Step2 = ({ service }: ServiceStepProps) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = React.useState('');
  const [selectedTime, setSelectedTime] = React.useState('');

  const dates = ['22/05', '23/05', '24/05', '25/05', '26/05'];
  const times = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
      <Stepper currentStep={2} />
      <div className="glass-card p-8 rounded-3xl space-y-8">
        <h2 className="text-2xl font-bold">Escolha a Data e Hora</h2>
        
        <div className="space-y-4">
          <Label>Selecione o dia</Label>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {dates.map(d => (
              <button 
                key={d} 
                onClick={() => setSelectedDate(d)}
                className={`px-6 py-3 rounded-xl border transition-all shrink-0 ${
                  selectedDate === d ? 'bg-primary border-primary text-background font-bold' : 'border-white/10 hover:border-white/30'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label>Selecione o horário</Label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {times.map(t => (
              <button 
                key={t} 
                onClick={() => setSelectedTime(t)}
                className={`py-3 rounded-xl border transition-all ${
                  selectedTime === t ? 'bg-primary border-primary text-background font-bold' : 'border-white/10 hover:border-white/30'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={() => navigate(-1)} className="h-14 px-8 rounded-xl">Voltar</Button>
          <Button 
            onClick={() => navigate('../endereco')} 
            disabled={!selectedDate || !selectedTime}
            className="flex-1 btn-primary h-14 text-lg gap-2"
          >
            Continuar <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const Step3 = ({ service }: ServiceStepProps) => {
  const navigate = useNavigate();
  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
      <Stepper currentStep={3} />
      <div className="glass-card p-8 rounded-3xl space-y-6">
        <h2 className="text-2xl font-bold">Endereço de Atendimento</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-2">
              <Label>CEP</Label>
              <Input placeholder="00000-000" className="bg-card/50 border-white/10" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label>Endereço</Label>
              <Input placeholder="Rua, Avenida..." className="bg-card/50 border-white/10" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Número</Label>
              <Input placeholder="123" className="bg-card/50 border-white/10" />
            </div>
            <div className="space-y-2">
              <Label>Complemento</Label>
              <Input placeholder="Apto, Bloco..." className="bg-card/50 border-white/10" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Telefone para contato</Label>
            <Input placeholder="(11) 99999-9999" className="bg-card/50 border-white/10" />
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={() => navigate(-1)} className="h-14 px-8 rounded-xl">Voltar</Button>
          <Button onClick={() => navigate('../pagamento')} className="flex-1 btn-primary h-14 text-lg gap-2">
            Continuar <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const Step4 = ({ service }: ServiceStepProps) => {
  const navigate = useNavigate();
  const [method, setMethod] = React.useState('pix');

  const handleFinish = () => {
    toast.success('Pedido realizado com sucesso!');
    navigate('../confirmado');
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
      <Stepper currentStep={4} />
      <div className="glass-card p-8 rounded-3xl space-y-8">
        <h2 className="text-2xl font-bold">Forma de Pagamento</h2>
        
        <RadioGroup value={method} onValueChange={setMethod} className="grid grid-cols-1 gap-4">
          <Label 
            htmlFor="pix" 
            className={`flex items-center justify-between p-6 rounded-2xl border cursor-pointer transition-all ${
              method === 'pix' ? 'bg-primary/10 border-primary' : 'border-white/10 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-4">
              <RadioGroupItem value="pix" id="pix" />
              <div>
                <p className="font-bold">PIX</p>
                <p className="text-xs text-muted-foreground">Aprovação instantânea</p>
              </div>
            </div>
            <span className="text-primary font-bold">-5% OFF</span>
          </Label>

          <Label 
            htmlFor="card" 
            className={`flex items-center justify-between p-6 rounded-2xl border cursor-pointer transition-all ${
              method === 'card' ? 'bg-primary/10 border-primary' : 'border-white/10 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-4">
              <RadioGroupItem value="card" id="card" />
              <div>
                <p className="font-bold">Cartão de Crédito</p>
                <p className="text-xs text-muted-foreground">Em até 12x sem juros</p>
              </div>
            </div>
            <CreditCard className="text-muted-foreground" />
          </Label>
        </RadioGroup>

        <div className="p-6 rounded-2xl bg-white/5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(service.price)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Taxa de serviço</span>
            <span>R$ 15,00</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-3 border-t border-white/5">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(service.price + 15)}</span>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={() => navigate(-1)} className="h-14 px-8 rounded-xl">Voltar</Button>
          <Button onClick={handleFinish} className="flex-1 btn-primary h-14 text-lg">
            Finalizar Pedido
          </Button>
        </div>
      </div>
    </div>
  );
};

const OrderConfirmed = ({ service, professional }: ServiceAndProfessionalStepProps) => {
  const navigate = useNavigate();
  return (
    <div className="text-center space-y-8 animate-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
        <CheckCircle2 className="text-primary w-12 h-12" />
      </div>
      <div>
        <h1 className="text-4xl font-bold mb-2">Pedido Confirmado!</h1>
        <p className="text-muted-foreground text-lg">Seu pedido #TF-2024-00842 foi registrado com sucesso.</p>
      </div>

      <div className="glass-card p-8 rounded-3xl max-w-md mx-auto text-left space-y-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Serviço</span>
          <span className="font-bold">{service.title}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Técnico</span>
          <span className="font-bold">{professional.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Data</span>
          <span className="font-bold">22/05 às 14:00</span>
        </div>
        <div className="pt-4 border-t border-white/5 flex justify-between text-lg font-bold">
          <span>Total Pago</span>
          <span className="text-primary">{formatCurrency(service.price + 15)}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={() => navigate('/cliente/meus-pedidos')} className="btn-primary h-12 px-8">Acompanhar Pedido</Button>
        <Button variant="outline" onClick={() => navigate('/cliente/dashboard')} className="h-12 px-8 rounded-xl">Voltar ao Início</Button>
      </div>
    </div>
  );
};

export default CheckoutFlow;
