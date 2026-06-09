import React from 'react';
import { useParams, useNavigate, Routes, Route, useLocation, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  CreditCard, 
  ArrowRight, 
  Star, 
  Clock, 
  UserCheck, 
  Copy, 
  Check, 
  CreditCard as CardIcon,
  Laptop
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { services, professionals } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';
import type { Professional, Service } from '@/types';
import { toast } from 'sonner';
import { saveLocalOrders, getLocalOrders, getLocalServices, getLocalProfessionals } from '@/utils/localDb';
import { useNotifications } from '@/context/NotificationsContext';

const Stepper = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { icon: UserCheck, label: 'Técnico' },
    { icon: Calendar, label: 'Data & Hora' },
    { icon: MapPin, label: 'Endereço' },
    { icon: CreditCard, label: 'Pagamento' },
  ];

  const progressPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="relative mb-16 max-w-2xl mx-auto">
      <div className="absolute top-5 left-4 right-4 h-[2px] bg-foreground/10 -translate-y-1/2 -z-10" />
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
                : 'border-foreground/10 text-muted-foreground'
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

const CheckoutFlow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  // Load from local storage or static mock data
  const localServices = getLocalServices();
  const activeServices = localServices.length > 0 ? localServices : services;
  const service = activeServices.find(s => s.id === id);

  const [searchParams] = useSearchParams();
  const requestedProfId = searchParams.get('prof');

  const [activeProfessionals, setActiveProfessionals] = React.useState<Professional[]>([]);
  const [selectedProf, setSelectedProf] = React.useState<Professional | null>(null);
  const [isLoadingProfs, setIsLoadingProfs] = React.useState(true);

  React.useEffect(() => {
    const fetchProfs = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/professionals');
        let profsToSet: Professional[] = [];
        
        if (res.ok) {
          const dbData = await res.json();
          const localProfs = getLocalProfessionals();
          const merged = [...dbData];
          localProfs.forEach((localProf: any) => {
            if (!merged.find(p => (p.userId === localProf.id || p.userId === localProf.userId || p.id === localProf.id))) {
              merged.push(localProf);
            }
          });
          profsToSet = merged;
        } else {
          const localProfs = getLocalProfessionals();
          profsToSet = localProfs.length > 0 ? localProfs : professionals;
        }
        
        if (requestedProfId) {
          profsToSet = profsToSet.filter((p: Professional) => p.id === requestedProfId || p.userId === requestedProfId);
        } else if (service?.professionalId) {
          profsToSet = profsToSet.filter((p: Professional) => p.id === service.professionalId || p.userId === service.professionalId);
        }
        
        if (profsToSet.length > 0) {
          setActiveProfessionals(profsToSet);
          setSelectedProf(profsToSet[0]);
        } else {
          setActiveProfessionals([]);
          setSelectedProf(null);
        }
      } catch (e) {
        console.error('Failed to fetch professionals');
      } finally {
        setIsLoadingProfs(false);
      }
    };
    fetchProfs();
  }, [requestedProfId, service?.professionalId]);
  const [selectedDate, setSelectedDate] = React.useState('');
  const [selectedTime, setSelectedTime] = React.useState('');
  
  const [cep, setCep] = React.useState('');
  const [street, setStreet] = React.useState('');
  const [number, setNumber] = React.useState('');
  const [complement, setComplement] = React.useState('');
  const [neighborhood, setNeighborhood] = React.useState('');
  const [city, setCity] = React.useState('');
  const [state, setState] = React.useState('');
  const [phone, setPhone] = React.useState('');

  const [showSuccessPopup, setShowSuccessPopup] = React.useState(false);
  const [finishedOrder, setFinishedOrder] = React.useState<{ code: string; price: number } | null>(null);

  const [paymentMethod, setPaymentMethod] = React.useState('pix'); // pix, credit, debit
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardName, setCardName] = React.useState('');
  const [cardExpiry, setCardExpiry] = React.useState('');
  const [cardCvv, setCardCvv] = React.useState('');
  const [installments, setInstallments] = React.useState(1);

  if (!service) return <div className="p-8 text-center text-red-500 font-bold glass-card border border-red-500/20 max-w-md mx-auto mt-20">Serviço não encontrado</div>;
  if (isLoadingProfs || !selectedProf) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <span className="h-10 w-10 rounded-full border-4 border-t-primary border-white/5 animate-spin"></span>
    </div>
  );

  const handleFinish = async () => {
    // Generate order and save to LocalStorage
    const orderId = `o_${Date.now()}`;
    const orderCode = `TF-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    
    // Calculate final transaction price with fees/discounts
    const basePrice = service.price + 15;
    const isPix = paymentMethod === 'pix';
    const isCredit = paymentMethod === 'credit';
    const finalPrice = isPix 
      ? basePrice * 0.95 
      : (isCredit && Number(installments) === 6 
          ? basePrice * 1.05 
          : (isCredit && Number(installments) === 12 
              ? basePrice * 1.1 
              : basePrice
            )
        );

    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    const professionalIdToUse = selectedProf ? ((selectedProf as any).userId || selectedProf.id) : '';

    const newOrder = {
      id: orderId,
      code: orderCode,
      serviceId: service.id,
      serviceTitle: service.title,
      clientName: currentUser?.name || "Cliente",
      clientId: currentUser?.id || "u1",
      professionalId: professionalIdToUse,
      professionalName: selectedProf.name,
      date: selectedDate || "28/05",
      time: selectedTime || "14:00",
      status: "pending" as const, // Start as pending instead of scheduled so professional can accept
      price: finalPrice,
      paymentMethod: paymentMethod as "pix" | "debit" | "credit",
      address: `${street}, ${number} - ${neighborhood}, ${city} - ${state}`
    };

    const currentOrders = getLocalOrders();
    currentOrders.push(newOrder);
    saveLocalOrders(currentOrders);

    // Sync with backend
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          serviceId: service.id,
          serviceTitle: service.title,
          clientId: currentUser?.id || "u1",
          professionalId: professionalIdToUse,
          date: selectedDate || "28/05",
          time: selectedTime || "14:00",
          price: finalPrice,
          paymentMethod,
          address: `${street}, ${number} - ${neighborhood}, ${city} - ${state}`
        })
      });
      
      if (!res.ok) {
        console.warn('Backend sync returned error:', res.status, await res.text());
        throw new Error('Backend sync failed with status ' + res.status);
      }
    } catch (err) {
      console.warn('Backend sync failed, using localStorage:', err);
    }

    // Trigger success notification
    addNotification(
      "Agendamento Confirmado",
      `Seu chamado de ${service.title} com ${selectedProf.name} foi solicitado para o dia ${selectedDate} às ${selectedTime}.`,
      "success"
    );

    toast.success('Pedido agendado com sucesso!');
    setFinishedOrder({ code: orderCode, price: finalPrice });
    setShowSuccessPopup(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Routes>
        <Route index element={
          <Step1 
            service={service} 
            selectedProf={selectedProf} 
            setSelectedProf={setSelectedProf} 
            professionals={activeProfessionals}
          />
        } />
        <Route path="data-hora" element={
          <Step2 
            service={service} 
            selectedProf={selectedProf}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
          />
        } />
        <Route path="endereco" element={
          <Step3 
            service={service}
            cep={cep} setCep={setCep}
            street={street} setStreet={setStreet}
            number={number} setNumber={setNumber}
            complement={complement} setComplement={setComplement}
            neighborhood={neighborhood} setNeighborhood={setNeighborhood}
            city={city} setCity={setCity}
            state={state} setState={setState}
            phone={phone} setPhone={setPhone}
          />
        } />
        <Route path="pagamento" element={
          <Step4 
            service={service}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            cardNumber={cardNumber} setCardNumber={setCardNumber}
            cardName={cardName} setCardName={setCardName}
            cardExpiry={cardExpiry} setCardExpiry={setCardExpiry}
            cardCvv={cardCvv} setCardCvv={setCardCvv}
            installments={installments} setInstallments={setInstallments}
            handleFinish={handleFinish}
          />
        } />
        <Route path="confirmado" element={
          <OrderConfirmed 
            service={service} 
            selectedProf={selectedProf}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
          />
        } />
      </Routes>

      {showSuccessPopup && finishedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in zoom-in duration-300">
          <div className="bg-card border border-foreground/10 shadow-2xl rounded-3xl p-8 max-w-md w-full mx-4 text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="text-primary w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-black mb-2">Pedido Realizado!</h2>
              <p className="text-muted-foreground text-sm">
                Seu chamado para <strong>{service.title}</strong> foi agendado com sucesso.
              </p>
            </div>
            
            <div className="bg-foreground/5 rounded-2xl p-4 text-left space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Código</span>
                <span className="font-mono font-bold text-primary">{finishedOrder.code}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Técnico</span>
                <span className="font-bold text-primary">{selectedProf.name}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Data/Hora</span>
                <span className="font-bold">{selectedDate} às {selectedTime}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Total Pago</span>
                <span className="font-bold">{formatCurrency(finishedOrder.price)}</span>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              <Button 
                onClick={() => navigate('/cliente/meus-pedidos')} 
                className="w-full btn-primary h-12 text-sm font-black"
              >
                Ver Minhas Solicitações
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/cliente/dashboard')} 
                className="w-full h-12 rounded-xl text-sm font-bold border-foreground/10"
              >
                Voltar para o Início
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// STEP 1: CHOOSE PROFESSIONAL
const Step1 = ({ 
  service, selectedProf, setSelectedProf, professionals 
}: { 
  service: Service, selectedProf: Professional, setSelectedProf: (p: Professional) => void, professionals: Professional[] 
}) => {
  const navigate = useNavigate();

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
      <Stepper currentStep={1} />
      
      <div className="glass-card p-8 rounded-3xl space-y-6">
        <div>
          <h2 className="text-2xl font-black mb-1">Selecione o Especialista</h2>
          <p className="text-xs text-muted-foreground">Escolha o técnico parceiro ideal para realizar seu suporte técnico.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {professionals.map((prof) => {
            const isSelected = selectedProf.id === prof.id;
            return (
              <div 
                key={prof.id} 
                onClick={() => setSelectedProf(prof)}
                className={`p-6 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between h-56 relative overflow-hidden group ${
                  isSelected ? 'bg-primary/5 border-primary shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-foreground/10 hover:border-foreground/20 hover:bg-card/25'
                }`}
              >
                <div className="flex gap-4 p-4 items-center">
                  <img src={prof.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(prof.name)}`} className="w-16 h-16 rounded-2xl object-cover border border-white/10" alt={prof.name} />
                  <div className="flex-1">
                    <h3 className="font-bold text-sm leading-tight flex items-center gap-2">
                      {prof.name}
                      {isSelected && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Selecionado"></span>}
                    </h3>
                    <p className="text-[10px] text-primary font-bold mt-0.5">{prof.specialty}</p>
                    <div className="flex items-center gap-1.5 text-xs text-yellow-500 font-bold mt-1">
                      <Star className="w-3.5 h-3.5 fill-current" /> {prof.rating} <span className="text-muted-foreground font-semibold">({prof.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{prof.bio}</p>

                <div className="flex justify-between items-center pt-3 border-t border-foreground/5">
                  <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{prof.city}</span>
                  <Badge variant="outline" className={`text-[10px] font-black uppercase ${isSelected ? 'bg-primary text-background' : 'bg-foreground/5 border-transparent'}`}>
                    {isSelected ? 'Selecionado' : 'Escolher'}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-foreground/5 shrink-0">
          <img src={service.image} className="w-14 h-14 rounded-xl object-cover" alt="" />
          <div>
            <h4 className="font-bold text-sm">{service.title}</h4>
            <p className="text-xs text-muted-foreground">Valor Estimado: <strong className="text-primary">{formatCurrency(service.price)}</strong></p>
          </div>
        </div>

        <Button onClick={() => navigate(`/cliente/contratar/${service.id}/data-hora`)} disabled={!selectedProf} className="w-full btn-primary h-12 text-sm font-black gap-2">
          Confirmar e Agendar Horário <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

// STEP 2: CHOOSE DATE AND TIME
const Step2 = ({ 
  service, selectedProf, selectedDate, setSelectedDate, selectedTime, setSelectedTime 
}: { 
  service: Service, selectedProf: Professional, selectedDate: string, setSelectedDate: (d: string) => void, selectedTime: string, setSelectedTime: (t: string) => void 
}) => {
  const navigate = useNavigate();
  
  const dates = React.useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Map JS getDay() 0-6 (Sun-Sat) to the Portuguese names used in our availableDays
    const jsDayToPt = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const profDays = selectedProf?.availableDays || ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

    const monthDates = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dateObj = new Date(year, month, i);
      const dayName = jsDayToPt[dateObj.getDay()];
      
      // Somente incluir se for um dia da semana em que o profissional trabalha
      if (profDays.includes(dayName)) {
        const dayStr = i.toString().padStart(2, '0');
        const monthStr = (month + 1).toString().padStart(2, '0');
        monthDates.push(`${dayStr}/${monthStr}`);
      }
    }
    return monthDates;
  }, [selectedProf]);

  const times = selectedProf?.availableTimes?.length ? selectedProf.availableTimes : ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
      <Stepper currentStep={2} />
      <div className="glass-card p-8 rounded-3xl space-y-6">
        <h2 className="text-2xl font-black">Escolha Data e Hora</h2>
        
        <div className="space-y-3">
          <Label className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Selecione o Dia</Label>
          <div className="flex gap-3 overflow-x-auto pb-2 select-none">
            {dates.map(d => (
              <button 
                key={d} 
                onClick={() => setSelectedDate(d)}
                className={`px-6 py-3 rounded-xl border text-sm transition-all shrink-0 ${
                  selectedDate === d ? 'bg-primary border-primary text-background font-black shadow-lg shadow-primary/20 scale-105' : 'border-foreground/10 hover:border-foreground/20'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Selecione o Horário</Label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {times.map(t => (
              <button 
                key={t} 
                onClick={() => setSelectedTime(t)}
                className={`py-3 rounded-xl border text-sm transition-all ${
                  selectedTime === t ? 'bg-primary border-primary text-background font-black shadow-lg shadow-primary/20 scale-105' : 'border-foreground/10 hover:border-foreground/20'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={() => navigate(-1)} className="h-12 px-6 rounded-xl text-xs font-bold border-foreground/10">Voltar</Button>
          <Button 
            onClick={() => navigate(`/cliente/contratar/${service.id}/endereco`)} 
            disabled={!selectedDate || !selectedTime}
            className="flex-1 btn-primary h-12 text-sm font-black gap-2"
          >
            Continuar para Endereço <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface Step3Props {
  service: Service;
  cep: string;
  setCep: (val: string) => void;
  street: string;
  setStreet: (val: string) => void;
  number: string;
  setNumber: (val: string) => void;
  complement: string;
  setComplement: (val: string) => void;
  neighborhood: string;
  setNeighborhood: (val: string) => void;
  city: string;
  setCity: (val: string) => void;
  state: string;
  setState: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
}

// STEP 3: ADDRESS CEP FETCH + MASK
const Step3 = ({
  service,
  cep, setCep,
  street, setStreet,
  number, setNumber,
  complement, setComplement,
  neighborhood, setNeighborhood,
  city, setCity,
  state, setState,
  phone, setPhone
}: Step3Props) => {
  const navigate = useNavigate();
  const [isSearchingCep, setIsSearchingCep] = React.useState(false);

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Mask CEP: 00000-000
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    
    let formatted = value;
    if (value.length > 5) {
      formatted = `${value.slice(0, 5)}-${value.slice(5)}`;
    }
    setCep(formatted);

    // Call ViaCEP at 8 digits
    if (value.length === 8) {
      setIsSearchingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
        const data = await response.json();
        
        if (data.erro) {
          toast.error('CEP não encontrado. Por favor, preencha manualmente.');
        } else {
          setStreet(data.logradouro || '');
          setNeighborhood(data.bairro || '');
          setCity(data.localidade || '');
          setState(data.uf || '');
          toast.success('Endereço auto-preenchido com sucesso!');
        }
      } catch (err) {
        toast.error('Erro ao conectar na API de busca de CEP.');
      } finally {
        setIsSearchingCep(false);
      }
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Mask Phone: (00) 00000-0000
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    let formatted = value;
    if (value.length > 2) {
      formatted = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 7) {
      formatted = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    }
    setPhone(formatted);
  };

  const isValid = street && number && neighborhood && city && state && phone.length >= 14;

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
      <Stepper currentStep={3} />
      <div className="glass-card p-8 rounded-3xl space-y-6">
        <div>
          <h2 className="text-2xl font-black mb-1">Local de Atendimento</h2>
          <p className="text-xs text-muted-foreground">Preencha seu CEP para que possamos verificar a logística de atendimento.</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 space-y-1.5 relative">
              <Label htmlFor="cep" className="font-bold text-xs">CEP</Label>
              <Input 
                id="cep" 
                placeholder="00000-000" 
                value={cep} 
                onChange={handleCepChange} 
                className="bg-card/50 border-foreground/10 h-12 rounded-xl text-sm" 
              />
              {isSearchingCep && (
                <span className="absolute bottom-3 right-3 h-5 w-5 rounded-full border-2 border-t-primary border-white/5 animate-spin"></span>
              )}
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <Label htmlFor="street" className="font-bold text-xs">Endereço</Label>
              <Input 
                id="street" 
                placeholder="Rua, Avenida..." 
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="bg-card/50 border-foreground/10 h-12 rounded-xl text-sm" 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="number" className="font-bold text-xs">Número</Label>
              <Input 
                id="number" 
                placeholder="123" 
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="bg-card/50 border-foreground/10 h-12 rounded-xl text-sm" 
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="complement" className="font-bold text-xs">Complemento (Opcional)</Label>
              <Input 
                id="complement" 
                placeholder="Apto, Bloco..." 
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
                className="bg-card/50 border-foreground/10 h-12 rounded-xl text-sm" 
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="neighborhood" className="font-bold text-xs">Bairro</Label>
              <Input 
                id="neighborhood" 
                placeholder="Bairro" 
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="bg-card/50 border-foreground/10 h-12 rounded-xl text-sm" 
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="city" className="font-bold text-xs">Cidade</Label>
              <Input 
                id="city" 
                placeholder="São Paulo" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-card/50 border-foreground/10 h-12 rounded-xl text-sm" 
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="state" className="font-bold text-xs">Estado</Label>
              <Input 
                id="state" 
                placeholder="SP" 
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="bg-card/50 border-foreground/10 h-12 rounded-xl text-sm" 
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="font-bold text-xs">Telefone para Contato</Label>
            <Input 
              id="phone" 
              placeholder="(11) 99999-9999" 
              value={phone} 
              onChange={handlePhoneChange}
              className="bg-card/50 border-foreground/10 h-12 rounded-xl text-sm" 
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={() => navigate(-1)} className="h-12 px-6 rounded-xl text-xs font-bold border-foreground/10">Voltar</Button>
          <Button 
            onClick={() => navigate(`/cliente/contratar/${service.id}/pagamento`)} 
            disabled={!isValid}
            className="flex-1 btn-primary h-12 text-sm font-black gap-2"
          >
            Continuar para Pagamento <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface Step4Props {
  service: Service;
  paymentMethod: string;
  setPaymentMethod: (val: string) => void;
  cardNumber: string;
  setCardNumber: (val: string) => void;
  cardName: string;
  setCardName: (val: string) => void;
  cardExpiry: string;
  setCardExpiry: (val: string) => void;
  cardCvv: string;
  setCardCvv: (val: string) => void;
  installments: number;
  setInstallments: (val: number) => void;
  handleFinish: () => void;
}

// STEP 4: REALISTIC PAYMENT METHOD selector & installments
const Step4 = ({
  service,
  paymentMethod, setPaymentMethod,
  cardNumber, setCardNumber,
  cardName, setCardName,
  cardExpiry, setCardExpiry,
  cardCvv, setCardCvv,
  installments, setInstallments,
  handleFinish
}: Step4Props) => {
  const navigate = useNavigate();
  const [pixCopied, setPixCopied] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(600); // 10 minutes

  React.useEffect(() => {
    if (paymentMethod === 'pix' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [paymentMethod, timeLeft]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    let formatted = value;
    if (value.length > 2) {
      formatted = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardExpiry(formatted);
  };

  const handleCardCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.slice(0, 3);
    setCardCvv(value);
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText("00020101021226870014br.gov.bcb.pix2565pix.techfix.com.br/custody/qrcodepix892389");
    setPixCopied(true);
    toast.success('Código PIX copiado para a área de transferência!');
    setTimeout(() => setPixCopied(false), 2000);
  };

  const totalPrice = service.price + 15;
  const isPix = paymentMethod === 'pix';
  const isDebit = paymentMethod === 'debit';
  const isCredit = paymentMethod === 'credit';

  const installmentOptions = [
    { number: 1, text: `1x de ${formatCurrency(totalPrice)} (Sem Juros)` },
    { number: 2, text: `2x de ${formatCurrency(totalPrice / 2)} (Sem Juros)` },
    { number: 3, text: `3x de ${formatCurrency(totalPrice / 3)} (Sem Juros)` },
    { number: 6, text: `6x de ${formatCurrency((totalPrice * 1.05) / 6)} (Com Juros 5%)` },
    { number: 12, text: `12x de ${formatCurrency((totalPrice * 1.1) / 12)} (Com Juros 10%)` },
  ];

  const getCardIcon = (num: string) => {
    const cleanNum = num.replace(/\s/g, '');
    if (cleanNum.startsWith('4')) return 'Visa';
    if (cleanNum.startsWith('5')) return 'Mastercard';
    return 'Cartão';
  };

  const isFormValid = isPix || isDebit 
    ? true 
    : (cardNumber.length === 19 && cardName && cardExpiry.length === 5 && cardCvv.length === 3);

  return (
    <div className="animate-in fade-in slide-in-from-right-8 duration-500 space-y-8">
      <Stepper currentStep={4} />
      <div className="glass-card p-8 rounded-3xl space-y-6">
        <div>
          <h2 className="text-2xl font-black mb-1">Pagamento Seguro</h2>
          <p className="text-xs text-muted-foreground">Escolha a melhor forma de pagamento em custódia segura na TechFix.</p>
        </div>

        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Label 
            htmlFor="pix" 
            className={`flex flex-col justify-between p-4 rounded-xl border cursor-pointer transition-all ${
              isPix ? 'bg-primary/5 border-primary' : 'border-foreground/10 hover:bg-card/25'
            }`}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="pix" id="pix" />
              <div>
                <p className="font-bold text-sm">PIX</p>
                <p className="text-[10px] text-muted-foreground">Instantâneo</p>
              </div>
            </div>
            <span className="text-primary font-black text-xs mt-3 block">-5% OFF</span>
          </Label>

          <Label 
            htmlFor="credit" 
            className={`flex flex-col justify-between p-4 rounded-xl border cursor-pointer transition-all ${
              isCredit ? 'bg-primary/5 border-primary' : 'border-foreground/10 hover:bg-card/25'
            }`}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="credit" id="credit" />
              <div>
                <p className="font-bold text-sm">Cartão Crédito</p>
                <p className="text-[10px] text-muted-foreground">Até 12x</p>
              </div>
            </div>
            <CardIcon className="text-muted-foreground w-5 h-5 mt-3 self-end" />
          </Label>

          <Label 
            htmlFor="debit" 
            className={`flex flex-col justify-between p-4 rounded-xl border cursor-pointer transition-all ${
              isDebit ? 'bg-primary/5 border-primary' : 'border-foreground/10 hover:bg-card/25'
            }`}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem value="debit" id="debit" />
              <div>
                <p className="font-bold text-sm">Cartão Débito</p>
                <p className="text-[10px] text-muted-foreground">À Vista</p>
              </div>
            </div>
            <CardIcon className="text-muted-foreground w-5 h-5 mt-3 self-end" />
          </Label>
        </RadioGroup>

        {/* PIX DETAILED INTERACTIVE SECTION */}
        {isPix && (
          <div className="p-6 rounded-2xl bg-foreground/5 border border-foreground/5 space-y-6 animate-in fade-in duration-300">
            <h3 className="font-bold text-base text-center">Efetue o Pagamento via Pix</h3>
            
            <div className="flex flex-col md:flex-row items-center gap-6 justify-center">
              {/* QR Code */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shrink-0">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=techfix_pix_payload_demo_value" 
                  alt="QR Code Pix"
                  className="w-36 h-36"
                />
              </div>

              {/* Explanatory text + copy and paste */}
              <div className="space-y-4 flex-1">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Escaneie o QR Code ou copie o código Pix abaixo para realizar o pagamento no aplicativo do seu banco.</p>
                  <p className="text-xs text-primary font-bold">Expira em: <strong className="text-sm font-black">{formatTime(timeLeft)}</strong></p>
                </div>

                <div className="relative group flex items-center">
                  <Input 
                    readOnly
                    value="00020101021226870014br.gov.bcb.pix2565pix.techfix.com.br/custody/qrcodepix892389" 
                    className="h-10 pr-24 bg-card/50 border-foreground/10 text-xs font-mono select-all rounded-xl"
                  />
                  <Button 
                    onClick={copyPixCode}
                    className="absolute right-1.5 h-7 rounded-lg px-3 btn-primary text-[10px] font-bold gap-1"
                  >
                    {pixCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {pixCopied ? 'Copiado' : 'Copiar'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CREDIT CARD DETAILED INTERACTIVE SECTION */}
        {isCredit && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-2xl bg-foreground/5 border border-foreground/5 animate-in fade-in duration-300">
            {/* Credit Card Form */}
            <div className="space-y-3.5">
              <h3 className="font-bold text-base">Dados do Cartão</h3>
              
              <div className="space-y-1.5">
                <Label htmlFor="cardNum" className="font-bold text-[10px] uppercase text-muted-foreground">Número do Cartão</Label>
                <Input 
                  id="cardNum" 
                  placeholder="0000 0000 0000 0000" 
                  value={cardNumber} 
                  onChange={handleCardNumberChange}
                  className="bg-card/50 border-foreground/10 h-10 rounded-xl text-xs" 
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cardHolder" className="font-bold text-[10px] uppercase text-muted-foreground">Nome Impresso no Cartão</Label>
                <Input 
                  id="cardHolder" 
                  placeholder="NOME COMPLETO" 
                  value={cardName} 
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  className="bg-card/50 border-foreground/10 h-10 rounded-xl text-xs" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="cardExp" className="font-bold text-[10px] uppercase text-muted-foreground">Validade</Label>
                  <Input 
                    id="cardExp" 
                    placeholder="MM/AA" 
                    value={cardExpiry} 
                    onChange={handleCardExpiryChange}
                    className="bg-card/50 border-foreground/10 h-10 rounded-xl text-xs text-center" 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cardCvv" className="font-bold text-[10px] uppercase text-muted-foreground">CVV</Label>
                  <Input 
                    id="cardCvv" 
                    placeholder="123" 
                    type="password"
                    value={cardCvv} 
                    onChange={handleCardCvvChange}
                    className="bg-card/50 border-foreground/10 h-10 rounded-xl text-xs text-center" 
                  />
                </div>
              </div>

              {/* Installment selection */}
              <div className="space-y-1.5">
                <Label htmlFor="instSelect" className="font-bold text-[10px] uppercase text-muted-foreground">Opções de Parcelamento</Label>
                <select 
                  id="instSelect"
                  value={installments} 
                  onChange={(e) => setInstallments(Number(e.target.value))}
                  className="w-full bg-card border border-foreground/10 rounded-xl h-10 px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  {installmentOptions.map(opt => (
                    <option key={opt.number} value={opt.number}>{opt.text}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* CARD 3D PREVIEW */}
            <div className="flex items-center justify-center shrink-0">
              <div className="w-72 h-44 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-800 text-white p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-28 h-28 bg-primary/10 rounded-full blur-2xl"></div>
                
                <div className="flex justify-between items-start">
                  <span className="font-black text-sm tracking-wider uppercase">TechFix</span>
                  <span className="font-black text-xs text-primary bg-background/20 px-2 py-0.5 rounded uppercase">
                    {getCardIcon(cardNumber)}
                  </span>
                </div>

                <div className="w-10 h-7 rounded-md bg-yellow-500/80 mb-2"></div>

                <div className="font-mono text-base tracking-widest text-center truncate">
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>

                <div className="flex justify-between text-[10px] font-mono">
                  <div className="truncate pr-4 uppercase">
                    <span className="text-[7px] text-slate-300 block">Titular</span>
                    {cardName || 'NOME IMPRESSO'}
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-[7px] text-slate-300 block">Validade</span>
                    {cardExpiry || 'MM/AA'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DEBIT CARD DETAILED INTERACTIVE SECTION */}
        {isDebit && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 rounded-2xl bg-foreground/5 border border-foreground/5 animate-in fade-in duration-300">
            {/* Debit Card Form */}
            <div className="space-y-3.5">
              <h3 className="font-bold text-base">Dados do Cartão de Débito</h3>
              
              <div className="space-y-1.5">
                <Label htmlFor="cardNum" className="font-bold text-[10px] uppercase text-muted-foreground">Número do Cartão</Label>
                <Input 
                  id="cardNum" 
                  placeholder="0000 0000 0000 0000" 
                  value={cardNumber} 
                  onChange={handleCardNumberChange}
                  className="bg-card/50 border-foreground/10 h-10 rounded-xl text-xs" 
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cardHolder" className="font-bold text-[10px] uppercase text-muted-foreground">Nome Impresso no Cartão</Label>
                <Input 
                  id="cardHolder" 
                  placeholder="NOME COMPLETO" 
                  value={cardName} 
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  className="bg-card/50 border-foreground/10 h-10 rounded-xl text-xs" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="cardExp" className="font-bold text-[10px] uppercase text-muted-foreground">Validade</Label>
                  <Input 
                    id="cardExp" 
                    placeholder="MM/AA" 
                    value={cardExpiry} 
                    onChange={handleCardExpiryChange}
                    className="bg-card/50 border-foreground/10 h-10 rounded-xl text-xs text-center" 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cardCvv" className="font-bold text-[10px] uppercase text-muted-foreground">CVV</Label>
                  <Input 
                    id="cardCvv" 
                    placeholder="123" 
                    type="password"
                    value={cardCvv} 
                    onChange={handleCardCvvChange}
                    className="bg-card/50 border-foreground/10 h-10 rounded-xl text-xs text-center" 
                  />
                </div>
              </div>
            </div>

            {/* CARD PREVIEW */}
            <div className="flex items-center justify-center shrink-0">
              <div className="w-72 h-44 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-800 text-white p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-28 h-28 bg-primary/10 rounded-full blur-2xl"></div>
                
                <div className="flex justify-between items-start">
                  <span className="font-black text-sm tracking-wider uppercase">TechFix DEBIT</span>
                  <span className="font-black text-xs text-primary bg-background/20 px-2 py-0.5 rounded uppercase">
                    {getCardIcon(cardNumber)}
                  </span>
                </div>

                <div className="w-10 h-7 rounded-md bg-yellow-500/80 mb-2"></div>

                <div className="font-mono text-base tracking-widest text-center truncate">
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>

                <div className="flex justify-between text-[10px] font-mono">
                  <div className="truncate pr-4 uppercase">
                    <span className="text-[7px] text-slate-300 block">Titular</span>
                    {cardName || 'NOME IMPRESSO'}
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="text-[7px] text-slate-300 block">Validade</span>
                    {cardExpiry || 'MM/AA'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invoice Summary */}
        <div className="p-6 rounded-2xl bg-foreground/5 border border-foreground/5 space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Subtotal do Serviço</span>
            <span>{formatCurrency(service.price)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Taxa Administrativa TechFix</span>
            <span>R$ 15,00</span>
          </div>
          {isPix && (
            <div className="flex justify-between text-xs text-green-500 font-bold">
              <span>Desconto de 5% (Pix)</span>
              <span>-{formatCurrency(totalPrice * 0.05)}</span>
            </div>
          )}
          {isCredit && Number(installments) > 3 && (
            <div className="flex justify-between text-xs text-red-500 font-bold">
              <span>Juros de Parcelamento</span>
              <span>{formatCurrency(Number(installments) === 6 ? totalPrice * 0.05 : totalPrice * 0.1)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-black pt-3 border-t border-foreground/5">
            <span>Total da Transação</span>
            <span className="text-primary">
              {formatCurrency(
                isPix 
                  ? totalPrice * 0.95 
                  : (isCredit && Number(installments) === 6 
                      ? totalPrice * 1.05 
                      : (isCredit && Number(installments) === 12 
                          ? totalPrice * 1.1 
                          : totalPrice
                        )
                    )
              )}
            </span>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={() => navigate(-1)} className="h-12 px-6 rounded-xl text-xs font-bold border-foreground/10">Voltar</Button>
          <Button 
            onClick={handleFinish} 
            disabled={!isFormValid}
            className="flex-1 btn-primary h-12 text-sm font-black"
          >
            Finalizar Pagamento Seguro
          </Button>
        </div>
      </div>
    </div>
  );
};

interface OrderConfirmedProps {
  service: Service;
  selectedProf: Professional;
  selectedDate: string;
  selectedTime: string;
}

// ORDER CONFIRMED SCREEN
const OrderConfirmed = ({ service, selectedProf, selectedDate, selectedTime }: OrderConfirmedProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderCode, price } = (location.state as { orderCode?: string, price?: number }) || {};

  return (
    <div className="text-center space-y-8 animate-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-float">
        <CheckCircle2 className="text-primary w-10 h-10" />
      </div>
      <div>
        <h1 className="text-3xl font-black mb-1.5">Pagamento Custodiado!</h1>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          Seu chamado foi aberto com sucesso e o saldo está guardado com total segurança.
        </p>
      </div>

      <div className="glass-card p-6 rounded-2xl max-w-sm mx-auto text-left space-y-3.5 border border-foreground/5">
        {orderCode && (
          <div className="flex justify-between text-xs pb-3 border-b border-foreground/5">
            <span className="text-muted-foreground">Código do Chamado</span>
            <span className="font-mono font-bold text-primary">{orderCode}</span>
          </div>
        )}
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Serviço</span>
          <span className="font-bold">{service.title}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Técnico Escolhido</span>
          <span className="font-bold text-primary">{selectedProf.name}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Horário Marcado</span>
          <span className="font-bold">{selectedDate || '28/05'} às {selectedTime || '14:00'}</span>
        </div>
        <div className="pt-3 border-t border-foreground/5 flex justify-between text-base font-black">
          <span>Total Pago</span>
          <span className="text-primary">{formatCurrency(price || (service.price + 15))}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xs mx-auto">
        <Button onClick={() => navigate('/cliente/meus-pedidos')} className="btn-primary h-12 flex-1 text-xs font-black">Acompanhar Chamado</Button>
        <Button variant="outline" onClick={() => navigate('/cliente/dashboard')} className="h-12 flex-1 rounded-xl text-xs font-bold border-foreground/10">Voltar para a Home</Button>
      </div>
    </div>
  );
};

export default CheckoutFlow;
