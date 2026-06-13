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
  Laptop,
  Plus
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { services } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';
import type { Professional, Service } from '@/types';
import { toast } from 'sonner';
import { saveLocalOrders, getLocalOrders, getLocalServices, getLocalProfessionals } from '@/utils/localDb';
import { useNotifications } from '@/context/NotificationsContext';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { initMercadoPago } from '@mercadopago/sdk-react';

// Inicializar Mercado Pago
initMercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || 'TEST-42f268d3-3ae3-4cbd-81e6-33e507dd8645');

// StripeCreditCardForm removed

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
        const res = await fetch('/api/professionals');
        let profsToSet: Professional[] = [];
        
        if (res.ok) {
          const dbData = await res.json();
          profsToSet = dbData;
        } else {
          profsToSet = [];
        }
        
        if (requestedProfId) {
          profsToSet = profsToSet.filter((p: Professional & { userId?: string }) => p.id === requestedProfId || p.userId === requestedProfId);
        } else if (service?.professionalId) {
          profsToSet = profsToSet.filter((p: Professional & { userId?: string }) => p.id === service.professionalId || p.userId === service.professionalId);
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
  const [cpf, setCpf] = React.useState('');
  const [cardFocus, setCardFocus] = React.useState<'number' | 'name' | 'expiry' | 'cvc' | ''>('');
  const [isProcessing, setIsProcessing] = React.useState(false);

  React.useEffect(() => {
    // Carrega o SDK V2 do Mercado Pago manualmente para suportar tokenização segura de formulário customizado
    const win = window as unknown as { MercadoPago?: unknown };
    if (!win.MercadoPago) {
      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  if (!service) return <div className="p-8 text-center text-red-500 font-bold glass-card border border-red-500/20 max-w-md mx-auto mt-20">Serviço não encontrado</div>;
  if (isLoadingProfs || !selectedProf) return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <span className="h-10 w-10 rounded-full border-4 border-t-primary border-white/5 animate-spin"></span>
    </div>
  );

  const handleFinish = async () => {
    setIsProcessing(true);
    
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
    const professionalIdToUse = selectedProf ? ((selectedProf as Professional & { userId?: string }).userId || selectedProf.id) : '';

    const token = localStorage.getItem('token');
    
    try {
      // 1. Create order on backend
      const res = await fetch('/api/orders', {
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
        const errorText = await res.text();
        console.error('Backend sync returned error:', res.status, errorText);
        
        if (res.status === 401 || res.status === 403) {
          toast.error('Sua sessão expirou ou é inválida. Por favor, faça login novamente.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          setIsProcessing(false);
          return;
        }

        let errMsg = 'Falha ao criar o pedido no servidor.';
        try {
          const parsed = JSON.parse(errorText);
          errMsg = parsed.error || errMsg;
        } catch (e) {
          if (errorText.includes('token') || errorText.includes('expired') || errorText.includes('denied')) {
            toast.error('Sua sessão expirou ou é inválida. Por favor, faça login novamente.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
            setIsProcessing(false);
            return;
          }
        }
        throw new Error(errMsg);
      }

      const createdOrder = await res.json();

      // 2. Save order to LocalStorage for local backup
      const newOrder = {
        id: createdOrder.id || `o_${Date.now()}`,
        code: createdOrder.code || `TF-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        serviceId: service.id,
        serviceTitle: service.title,
        clientName: currentUser?.name || "Cliente",
        clientId: currentUser?.id || "u1",
        professionalId: professionalIdToUse,
        professionalName: selectedProf.name,
        date: selectedDate || "28/05",
        time: selectedTime || "14:00",
        status: "provisional" as const,
        price: finalPrice,
        paymentMethod: paymentMethod as "pix" | "debit" | "credit",
        address: `${street}, ${number} - ${neighborhood}, ${city} - ${state}`
      };

      const currentOrders = getLocalOrders();
      currentOrders.push(newOrder);
      saveLocalOrders(currentOrders);

      // 3. Process Transparent Checkout
      let cardToken = '';
      if (isCredit || paymentMethod === 'debit') {
        try {
          const expirationMonth = cardExpiry.split('/')[0]?.trim();
          let expirationYear = cardExpiry.split('/')[1]?.trim();
          if (expirationYear && expirationYear.length === 2) {
            expirationYear = '20' + expirationYear;
          }

          const win = window as unknown as { MercadoPago?: unknown };
          if (!win.MercadoPago) {
            throw new Error('O sistema de segurança do Mercado Pago ainda está conectando. Aguarde alguns segundos e tente novamente.');
          }

          const WindowMP = window as unknown as { MercadoPago: new (key: string) => { createCardToken: (p: Record<string, unknown>) => Promise<{ id?: string }> } };
          const mp = new WindowMP.MercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || 'TEST-42f268d3-3ae3-4cbd-81e6-33e507dd8645');
          const tokenRes = await mp.createCardToken({
            cardNumber: cardNumber.replace(/\D/g, ''),
            cardholderName: cardName,
            cardExpirationMonth: expirationMonth,
            cardExpirationYear: expirationYear,
            securityCode: cardCvv,
            identificationType: 'CPF',
            identificationNumber: cpf.replace(/\D/g, '')
          });
          
          if (!tokenRes || !tokenRes.id) {
            throw new Error('Falha ao tokenizar cartão. Verifique os dados inseridos.');
          }
          cardToken = tokenRes.id;
        } catch (cardErr: unknown) {
          const err = cardErr as Error;
          console.error("Tokenization error:", err);
          throw new Error('Erro ao validar o cartão: ' + (err.message || 'Dados inválidos'));
        }
      }

      const paymentRes = await fetch('/api/payments/process-transparent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          transaction_amount: finalPrice,
          description: service.title,
          order_id: createdOrder.id,
          payment_method_id: paymentMethod === 'credit' ? 'master' : paymentMethod, // Placeholder for credit method if needed
          token: cardToken,
          installments: Number(installments) || 1,
          payer: {
            email: currentUser?.email || 'cliente@email.com',
            first_name: currentUser?.name || 'Cliente'
          }
        })
      });

      if (!paymentRes.ok) {
        const errText = await paymentRes.text();
        console.error('Transparent payment generation returned error:', paymentRes.status, errText);

        if (paymentRes.status === 401 || paymentRes.status === 403) {
          toast.error('Sua sessão expirou ou é inválida. Por favor, faça login novamente.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          setIsProcessing(false);
          return;
        }

        let errMsg = 'Falha ao processar o pagamento.';
        try {
          const parsed = JSON.parse(errText);
          errMsg = parsed.error || errMsg;
          if (parsed.details && Array.isArray(parsed.details)) {
            const detailsText = parsed.details.map((d: Record<string, unknown>) => (d.description || d.message) as string).join(', ');
            if (detailsText) errMsg += ` (Detalhes: ${detailsText})`;
          } else if (parsed.details) {
            errMsg += ` (Detalhes: ${JSON.stringify(parsed.details)})`;
          }
        } catch (e) {
          console.error("Parse falhou", e);
        }
        throw new Error(errMsg);
      }

      const paymentData = await paymentRes.json();
      
      // 4. Trigger success notification
      addNotification(
        "Aguardando Pagamento",
        `Seu chamado de ${service.title} foi criado.`,
        "info"
      );

      toast.success('Pedido criado! Concluindo processamento...');
      
      // 5. Navigate to confirmation/QR Code page
      if (paymentMethod === 'pix' && paymentData.qr_code) {
        // Send QR code data to next page via state
        navigate(`/cliente/checkout/${service.id}/confirmado?orderId=${createdOrder.id}&pix=true`, {
          state: { qrCode: paymentData.qr_code_base64, qrString: paymentData.qr_code }
        });
      } else {
        navigate(`/cliente/checkout/${service.id}/confirmado?payment_intent=success&orderId=${createdOrder.id}`);
      }
      
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error(err instanceof Error ? err.message : 'Falha ao processar checkout. Tente novamente.');
      setIsProcessing(false);
    }
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
            cpf={cpf} setCpf={setCpf}
            cardFocus={cardFocus} setCardFocus={setCardFocus}
            installments={installments} setInstallments={setInstallments}
            handleFinish={handleFinish}
            isProcessing={isProcessing}
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

  const currentUser = React.useMemo(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  }, []);

  const hasSavedAddress = !!(currentUser?.street && currentUser?.number && currentUser?.city && currentUser?.cep);

  const [addressOption, setAddressOption] = React.useState<'saved' | 'new'>(() => {
    if (!hasSavedAddress) return 'new';
    
    // Check if the current state fields match the saved address or are completely empty
    const isSavedMatch = 
      street === currentUser.street &&
      number === currentUser.number &&
      cep === currentUser.cep;
      
    return isSavedMatch || (!street && !number && !cep) ? 'saved' : 'new';
  });

  React.useEffect(() => {
    if (hasSavedAddress && addressOption === 'saved') {
      setCep(currentUser.cep || '');
      setStreet(currentUser.street || '');
      setNumber(currentUser.number || '');
      setComplement(currentUser.complement || '');
      setNeighborhood(currentUser.neighborhood || '');
      setCity(currentUser.city || '');
      setState(currentUser.state || '');
      setPhone(currentUser.phone || '');
    } else if (addressOption === 'new') {
      // Clear fields to let user enter new address, only if they currently match the saved one
      const isSavedMatch = 
        street === currentUser.street &&
        number === currentUser.number &&
        cep === currentUser.cep;
      if (isSavedMatch) {
        setCep('');
        setStreet('');
        setNumber('');
        setComplement('');
        setNeighborhood('');
        setCity('');
        setState('');
        setPhone(currentUser?.phone || '');
      }
    }
  }, [addressOption, hasSavedAddress, currentUser, setCep, setStreet, setNumber, setComplement, setNeighborhood, setCity, setState, setPhone, cep, street, number]);

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
          <p className="text-xs text-muted-foreground">Escolha o endereço cadastrado para atendimento ou informe um novo local.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Card 1: Saved Address */}
          <div 
            onClick={() => hasSavedAddress && setAddressOption('saved')}
            className={`p-5 rounded-2xl border transition-all flex flex-col justify-between h-40 relative overflow-hidden group ${
              !hasSavedAddress 
                ? 'opacity-50 cursor-not-allowed bg-muted/30 border-dashed border-foreground/10'
                : addressOption === 'saved'
                  ? 'bg-primary/5 border-primary shadow-[0_0_15px_rgba(6,182,212,0.15)] animate-in fade-in zoom-in-95 duration-200 cursor-pointer'
                  : 'border-foreground/10 hover:border-foreground/20 hover:bg-card/25 cursor-pointer'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl transition-all ${addressOption === 'saved' ? 'bg-primary/20 text-primary scale-110 shadow-[0_0_8px_rgba(6,182,212,0.3)]' : 'bg-foreground/5 text-muted-foreground'}`}>
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm leading-none flex items-center gap-2">
                  Endereço Cadastrado
                  {addressOption === 'saved' && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                </h4>
                {hasSavedAddress ? (
                  <p className="text-[11px] text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                    {currentUser.street}, {currentUser.number} {currentUser.complement ? `(${currentUser.complement})` : ''} <br />
                    {currentUser.neighborhood} • {currentUser.city} - {currentUser.state} <br />
                    CEP: {currentUser.cep}
                  </p>
                ) : (
                  <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                    Você ainda não possui um endereço cadastrado. Preencha abaixo para salvar.
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-foreground/5 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
              <span>Usar este local</span>
              <span className={addressOption === 'saved' ? 'text-primary' : ''}>
                {hasSavedAddress ? (addressOption === 'saved' ? 'Selecionado' : 'Selecionar') : 'Indisponível'}
              </span>
            </div>
          </div>

          {/* Card 2: New Address */}
          <div 
            onClick={() => setAddressOption('new')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between h-40 relative overflow-hidden group ${
              addressOption === 'new'
                ? 'bg-primary/5 border-primary shadow-[0_0_15px_rgba(6,182,212,0.15)] animate-in fade-in zoom-in-95 duration-200'
                : 'border-foreground/10 hover:border-foreground/20 hover:bg-card/25'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-xl transition-all ${addressOption === 'new' ? 'bg-primary/20 text-primary scale-110 shadow-[0_0_8px_rgba(6,182,212,0.3)]' : 'bg-foreground/5 text-muted-foreground'}`}>
                <Plus className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm leading-none flex items-center gap-2">
                  Outro Endereço
                  {addressOption === 'new' && <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                </h4>
                <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                  Informar e cadastrar um novo endereço de atendimento específico para este serviço.
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-foreground/5 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
              <span>Cadastrar novo</span>
              <span className={addressOption === 'new' ? 'text-primary' : ''}>
                {addressOption === 'new' ? 'Selecionado' : 'Selecionar'}
              </span>
            </div>
          </div>
        </div>

        {addressOption === 'new' ? (
          <div className="space-y-4 animate-in fade-in duration-300">
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
        ) : (
          <div className="p-6 rounded-2xl bg-foreground/5 border border-foreground/10 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 pb-2 border-b border-foreground/5">
              <MapPin className="w-4 h-4 text-primary" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Resumo do Endereço de Atendimento</h4>
            </div>
            <div className="space-y-1.5 text-xs">
              <p className="font-bold text-sm text-foreground">{street}, {number} {complement ? `(${complement})` : ''}</p>
              <p className="text-muted-foreground font-semibold">{neighborhood} • {city} - {state}</p>
              <p className="text-muted-foreground font-semibold">CEP: {cep}</p>
              <p className="text-muted-foreground flex items-center gap-1.5 pt-2 font-black uppercase tracking-wider text-[9px]">
                Telefone de contato: <span className="text-primary font-bold normal-case text-xs">{phone}</span>
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={() => navigate(-1)} className="h-12 px-6 rounded-xl text-xs font-bold border-foreground/10">Voltar</Button>
          <Button 
            onClick={async () => {
              // Save address to user profile if they typed a new one and didn't have one before
              if (addressOption === 'new' && currentUser) {
                const token = localStorage.getItem('token');
                try {
                  const res = await fetch(`/api/users/${currentUser.id}`, {
                    method: 'PUT',
                    headers: { 
                      'Content-Type': 'application/json',
                      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                    },
                    body: JSON.stringify({ cep, street, number, complement, neighborhood, city, state, phone })
                  });
                  if (res.ok) {
                    const updatedUser = { ...currentUser, cep, street, number, complement, neighborhood, city, state, phone };
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    // Update local storage techfix_users for full persistence simulator
                    const localUsers = JSON.parse(localStorage.getItem('techfix_users') || '[]');
                    const updatedUsers = localUsers.map((u: { id: string }) => u.id === currentUser.id ? updatedUser : u);
                    localStorage.setItem('techfix_users', JSON.stringify(updatedUsers));
                  }
                } catch (e) {
                  console.error("Error saving address:", e);
                }
              }
              navigate(`/cliente/contratar/${service.id}/pagamento`);
            }} 
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
  cpf: string;
  setCpf: (val: string) => void;
  cardFocus: "number" | "name" | "expiry" | "cvc" | "";
  setCardFocus: (val: "number" | "name" | "expiry" | "cvc" | "") => void;
  installments: number;
  setInstallments: (val: number) => void;
  handleFinish: () => void;
  isProcessing: boolean;
}

// STEP 4: REALISTIC PAYMENT METHOD selector & installments
const Step4 = ({
  service,
  paymentMethod, setPaymentMethod,
  cardNumber, setCardNumber,
  cardName, setCardName,
  cardExpiry, setCardExpiry,
  cardCvv, setCardCvv,
  cpf, setCpf,
  cardFocus, setCardFocus,
  installments, setInstallments,
  handleFinish,
  isProcessing
}: Step4Props) => {
  const navigate = useNavigate();

  const totalPrice = service.price + 15;
  const isPix = paymentMethod === 'pix';
  const isDebit = paymentMethod === 'debit';
  const isCredit = paymentMethod === 'credit';

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    setCardNumber(value);
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    let formatted = value;
    if (value.length >= 2) {
      formatted = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    if (formatted.length > 5) formatted = formatted.slice(0, 5);
    setCardExpiry(formatted);
  };

  const handleCardCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    setCardCvv(value);
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    setCpf(value);
  };

  const isFormValid = isPix 
    ? true 
    : (cardNumber.length >= 15 && cardName.length > 3 && cardExpiry.length === 5 && cardCvv.length >= 3 && cpf.length === 14);

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

        {(isCredit || isDebit) && (
          <div className="mt-8 space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-center mb-6">
              <Cards
                number={cardNumber}
                expiry={cardExpiry}
                cvc={cardCvv}
                name={cardName}
                focused={cardFocus || undefined}
                locale={{ valid: 'Validade' }}
                placeholders={{ name: 'SEU NOME IMPRESSO' }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="cardNumber" className="font-bold text-[10px] uppercase text-muted-foreground">Número do Cartão</Label>
                <Input 
                  id="cardNumber" 
                  placeholder="0000 0000 0000 0000" 
                  value={cardNumber} 
                  onChange={handleCardNumberChange}
                  onFocus={() => setCardFocus('number')}
                  className="bg-card/50 border-foreground/10 h-12 rounded-xl" 
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cardName" className="font-bold text-[10px] uppercase text-muted-foreground">Nome Impresso</Label>
                <Input 
                  id="cardName" 
                  placeholder="Como no cartão" 
                  value={cardName} 
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  onFocus={() => setCardFocus('name')}
                  className="bg-card/50 border-foreground/10 h-12 rounded-xl uppercase" 
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cpf" className="font-bold text-[10px] uppercase text-muted-foreground">CPF do Titular</Label>
                <Input 
                  id="cpf" 
                  placeholder="000.000.000-00" 
                  value={cpf} 
                  onChange={handleCpfChange}
                  onFocus={() => setCardFocus('name')}
                  className="bg-card/50 border-foreground/10 h-12 rounded-xl" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4 md:col-span-2">
                <div className="space-y-1.5">
                  <Label htmlFor="cardExpiry" className="font-bold text-[10px] uppercase text-muted-foreground">Validade</Label>
                  <Input 
                    id="cardExpiry" 
                    placeholder="MM/AA" 
                    value={cardExpiry} 
                    onChange={handleCardExpiryChange}
                    onFocus={() => setCardFocus('expiry')}
                    className="bg-card/50 border-foreground/10 h-12 rounded-xl text-center" 
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
                    onFocus={() => setCardFocus('cvc')}
                    className="bg-card/50 border-foreground/10 h-12 rounded-xl text-center" 
                  />
                </div>
              </div>

              {isCredit && (
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="font-bold text-[10px] uppercase text-muted-foreground">Parcelas</Label>
                  <select 
                    value={installments}
                    onChange={(e) => setInstallments(Number(e.target.value))}
                    className="flex h-12 w-full rounded-xl border border-foreground/10 bg-card/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value={1}>1x de {formatCurrency(totalPrice)}</option>
                    <option value={2}>2x de {formatCurrency(totalPrice / 2)}</option>
                    <option value={3}>3x de {formatCurrency(totalPrice / 3)}</option>
                    <option value={6}>6x de {formatCurrency((totalPrice * 1.05) / 6)} (Com Juros)</option>
                    <option value={12}>12x de {formatCurrency((totalPrice * 1.10) / 12)} (Com Juros)</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {isPix && (
          <div className="p-6 rounded-2xl bg-foreground/5 border border-foreground/5 space-y-3 animate-in fade-in duration-300">
            <h3 className="font-bold text-sm text-primary flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0" /> Pagamento Rápido com Pix
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ao clicar em finalizar, geraremos seu QR Code exclusivo. Você terá 30 minutos para concluir o pagamento com o desconto aplicado.
            </p>
          </div>
        )}

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
          <div className="flex justify-between text-base font-black pt-3 border-t border-foreground/5">
            <span>Total da Transação</span>
            <span className="text-primary">
              {formatCurrency(isPix ? totalPrice * 0.95 : (isCredit && installments === 6 ? totalPrice * 1.05 : (isCredit && installments === 12 ? totalPrice * 1.10 : totalPrice)))}
            </span>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button variant="outline" onClick={() => navigate(-1)} className="h-12 px-6 rounded-xl text-xs font-bold border-foreground/10" disabled={isProcessing}>Voltar</Button>
          <Button 
            onClick={handleFinish} 
            disabled={!isFormValid || isProcessing}
            className="flex-1 btn-primary h-12 text-sm font-black gap-2"
          >
            {isProcessing ? 'Processando Pagamento...' : 'Finalizar e Pagar'}
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
  const [searchParams] = useSearchParams();
  const orderIdParam = searchParams.get('orderId');
  const paymentIntentParam = searchParams.get('payment_intent');
  const isPixPayment = searchParams.get('pix') === 'true';

  const { qrCode, qrString } = (location.state as { qrCode?: string, qrString?: string }) || {};

  const [isLoading, setIsLoading] = React.useState(!!orderIdParam && !isPixPayment);
  const [confirmedCode, setConfirmedCode] = React.useState('');
  const [confirmedPrice, setConfirmedPrice] = React.useState(0);
  const [confirmedDateVal, setConfirmedDateVal] = React.useState(selectedDate);
  const [confirmedTimeVal, setConfirmedTimeVal] = React.useState(selectedTime);
  const [confirmedProfName, setConfirmedProfName] = React.useState(selectedProf?.name || '');

  React.useEffect(() => {
    const confirmOrderPayment = async () => {
      if (!orderIdParam) return;
      try {
        const token = localStorage.getItem('token');
        
        // 1. Confirm the payment on the backend
        const confirmRes = await fetch(`/api/orders/${orderIdParam}/confirm-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });

        if (!confirmRes.ok) {
          throw new Error('Falha ao confirmar pagamento do pedido.');
        }

        const orderData = await confirmRes.json();
        setConfirmedCode(orderData.code);
        setConfirmedPrice(orderData.price);
        setConfirmedDateVal(orderData.date);
        setConfirmedTimeVal(orderData.time);
        
        // Fetch technician name
        if (orderData.professionalId) {
          const profRes = await fetch(`/api/professionals/${orderData.professionalId}`);
          if (profRes.ok) {
            const profData = await profRes.json();
            setConfirmedProfName(profData.name || 'Técnico');
          }
        }
      } catch (err) {
        console.error('Error confirming order payment:', err);
        toast.error('Ocorreu um erro ao verificar o pagamento. Por favor, verifique "Meus Pedidos".');
      } finally {
        setIsLoading(false);
      }
    };

    if (orderIdParam && paymentIntentParam === 'success') {
      confirmOrderPayment();
    } else {
      const stateObj = (location.state as { orderCode?: string, price?: number }) || {};
      setConfirmedCode(stateObj.orderCode || '');
      setConfirmedPrice(stateObj.price || (service.price + 15));
      setConfirmedDateVal(selectedDate);
      setConfirmedTimeVal(selectedTime);
      setConfirmedProfName(selectedProf?.name || '');
    }
  }, [orderIdParam, paymentIntentParam, location.state, service.price, selectedProf, selectedDate, selectedTime]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] space-y-4">
        <span className="h-10 w-10 rounded-full border-4 border-t-primary border-white/5 animate-spin"></span>
        <p className="text-sm font-bold text-muted-foreground animate-pulse">Verificando pagamento seguro no Mercado Pago...</p>
      </div>
    );
  }

  return (
    <div className="text-center space-y-8 animate-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-float">
        <CheckCircle2 className="text-primary w-10 h-10" />
      </div>
      <div>
        <h1 className="text-3xl font-black mb-1.5">Chamado Registrado!</h1>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          Seu chamado foi criado com sucesso. {isPixPayment ? 'Realize o pagamento do Pix abaixo para confirmar.' : 'O saldo está guardado com total segurança.'}
        </p>
      </div>

      {isPixPayment && qrCode && (
        <div className="glass-card p-6 rounded-2xl max-w-sm mx-auto text-left space-y-4 border border-primary/20 bg-primary/5 mb-8">
          <h3 className="font-bold text-center text-primary">Pague com Pix</h3>
          <img src={`data:image/png;base64,${qrCode}`} alt="QR Code Pix" className="w-48 h-48 mx-auto rounded-xl border p-2 bg-white" />
          <div className="space-y-2">
            <p className="text-[10px] text-center uppercase font-bold text-muted-foreground">Copia e Cola</p>
            <div className="flex gap-2">
              <Input value={qrString} readOnly className="text-xs h-10 bg-card/50" />
              <Button onClick={() => { navigator.clipboard.writeText(qrString); toast.success('Código copiado!'); }} size="icon" className="h-10 w-10 shrink-0"><Copy className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>
      )}

      <div className="glass-card p-6 rounded-2xl max-w-sm mx-auto text-left space-y-3.5 border border-foreground/5">
        {confirmedCode && (
          <div className="flex justify-between text-xs pb-3 border-b border-foreground/5">
            <span className="text-muted-foreground">Código do Chamado</span>
            <span className="font-mono font-bold text-primary">{confirmedCode}</span>
          </div>
        )}
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Serviço</span>
          <span className="font-bold">{service.title}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Técnico Escolhido</span>
          <span className="font-bold text-primary">{confirmedProfName}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Horário Marcado</span>
          <span className="font-bold">{confirmedDateVal || '28/05'} às {confirmedTimeVal || '14:00'}</span>
        </div>
        <div className="pt-3 border-t border-foreground/5 flex justify-between text-base font-black">
          <span>Total a Pagar</span>
          <span className="text-primary">{formatCurrency(confirmedPrice)}</span>
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
