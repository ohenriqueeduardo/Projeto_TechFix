import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Star, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ArrowLeft, 
  CreditCard, 
  Check, 
  Copy, 
  Cpu, 
  Sparkles,
  DollarSign,
  Briefcase
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';
import { useNotifications } from '@/context/NotificationsContext';
import { Order } from '@/types';

const CheckoutCounterOfferPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  const [order, setOrder] = React.useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = React.useState<Order['paymentMethod']>('pix'); // pix, credit, debit
  const [pixCopied, setPixCopied] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(600); // 10 mins

  // Card form states
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardName, setCardName] = React.useState('');
  const [cardExpiry, setCardExpiry] = React.useState('');
  const [cardCvv, setCardCvv] = React.useState('');

  React.useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/orders/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  React.useEffect(() => {
    if (paymentMethod === 'pix' && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [paymentMethod, timeLeft]);

  if (!order) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-muted-foreground text-sm font-bold">Chamado não encontrado</p>
        <Button onClick={() => navigate(-1)} variant="outline" className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>
      </div>
    );
  }

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
    toast.success('Código PIX copiado com sucesso!');
    setTimeout(() => setPixCopied(false), 2000);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'credit' && (!cardNumber || !cardName || !cardExpiry || !cardCvv)) {
      toast.error('Preencha os dados do cartão de crédito obrigatórios.');
      return;
    }

    const processPayment = async () => {
      try {
        const token = localStorage.getItem('token');
        await fetch(`/api/orders/${order.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ status: 'scheduled' })
        });
        
        await fetch(`/api/orders/${order.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ paymentMethod })
        });

        // Create dynamic notifications
        addNotification(
          "Pagamento Confirmado!",
          `O pagamento da contraproposta de R$ ${order.price.toFixed(2)} para o chamado ${order.code} foi confirmado em custódia segura.`,
          "success"
        );

        toast.success(`Pagamento simulado com sucesso! Chamado agendado com ${order.professionalName}.`);
        navigate(`/cliente/pedido/${order.id}/status`);
      } catch (e) {
        console.error(e);
        toast.error('Erro ao processar pagamento.');
      }
    };

    processPayment();
  };

  const isPix = paymentMethod === 'pix';
  const isCredit = paymentMethod === 'credit';
  const isDebit = paymentMethod === 'debit';

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative text-left">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(6,182,212,0.01),transparent_50%)] pointer-events-none" />

      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="w-4 h-4" /> Cancelar Pagamento
      </Button>

      {/* Header Block */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Pagamento Garantido TechFix
        </div>
        <h1 className="text-3xl font-black tracking-tight leading-none">Confirmar Pagamento da Contraproposta</h1>
        <p className="text-sm text-muted-foreground font-medium">Conclua o pagamento em custódia segura para agendar seu reparo técnico.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Form (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handlePaymentSubmit} className="glass-card p-8 rounded-3xl space-y-6 border border-foreground/5 bg-card/20 shadow-xl">
            
            {/* Payment Method Selector */}
            <div className="space-y-4">
              <Label className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Forma de Pagamento</Label>
              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as Order['paymentMethod'])} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Label 
                  htmlFor="pix" 
                  className={`flex flex-col justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    isPix ? 'bg-primary/5 border-primary shadow-md shadow-primary/5' : 'border-foreground/10 hover:bg-card/25'
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
                    isCredit ? 'bg-primary/5 border-primary shadow-md shadow-primary/5' : 'border-foreground/10 hover:bg-card/25'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="credit" id="credit" />
                    <div>
                      <p className="font-bold text-sm">Crédito</p>
                      <p className="text-[10px] text-muted-foreground">À Vista</p>
                    </div>
                  </div>
                  <CreditCard className="text-muted-foreground w-4.5 h-4.5 mt-3 self-end" />
                </Label>

                <Label 
                  htmlFor="debit" 
                  className={`flex flex-col justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    isDebit ? 'bg-primary/5 border-primary shadow-md shadow-primary/5' : 'border-foreground/10 hover:bg-card/25'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="debit" id="debit" />
                    <div>
                      <p className="font-bold text-sm">Débito</p>
                      <p className="text-[10px] text-muted-foreground">À Vista</p>
                    </div>
                  </div>
                  <CreditCard className="text-muted-foreground w-4.5 h-4.5 mt-3 self-end" />
                </Label>
              </RadioGroup>
            </div>

            {/* PIX QR CODE BLOCK */}
            {isPix && (
              <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4 animate-in fade-in duration-300">
                <h3 className="font-bold text-sm text-center">Escaneie o QR Code PIX</h3>
                
                <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
                  <div className="p-3 bg-white rounded-xl border shrink-0">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=techfix_counter_offer_payload" 
                      alt="Pix QR" 
                      className="w-28 h-28"
                    />
                  </div>
                  <div className="space-y-3 flex-1">
                    <div className="space-y-0.5">
                      <p className="text-[11px] text-muted-foreground font-medium">Use o aplicativo do seu banco para ler o QR Code ou copie o código Pix abaixo.</p>
                      <p className="text-[11px] text-primary font-bold">O código expira em: <strong className="text-xs font-black">{formatTime(timeLeft)}</strong></p>
                    </div>

                    <div className="relative flex items-center">
                      <Input 
                        readOnly
                        value="00020101021226870014br.gov.bcb.pix2565pix.techfix.com.br/custody/qrcodepix892389" 
                        className="h-10 pr-24 bg-card/45 border-foreground/10 text-[10px] font-mono select-all rounded-xl"
                      />
                      <Button 
                        type="button"
                        onClick={copyPixCode}
                        className="absolute right-1 h-8 rounded-lg px-2.5 btn-primary text-[10px] font-black gap-1 uppercase"
                      >
                        {pixCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {pixCopied ? 'Copiado' : 'Copiar'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CREDIT CARD FORM BLOCK */}
            {isCredit && (
              <div className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/5 animate-in fade-in duration-300">
                <h3 className="font-bold text-sm">Insira os Dados do Cartão</h3>
                
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="cardNumber" className="font-bold text-[10px] uppercase text-muted-foreground">Número do Cartão</Label>
                    <Input 
                      id="cardNumber" 
                      placeholder="0000 0000 0000 0000" 
                      value={cardNumber} 
                      onChange={handleCardNumberChange} 
                      className="bg-card/50 border-foreground/10 h-10 rounded-xl text-xs" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="cardName" className="font-bold text-[10px] uppercase text-muted-foreground">Nome Impresso no Cartão</Label>
                    <Input 
                      id="cardName" 
                      placeholder="NOME IGUAL NO CARTÃO" 
                      value={cardName} 
                      onChange={(e) => setCardName(e.target.value.toUpperCase())} 
                      className="bg-card/50 border-foreground/10 h-10 rounded-xl text-xs" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="cardExpiry" className="font-bold text-[10px] uppercase text-muted-foreground">Validade</Label>
                      <Input 
                        id="cardExpiry" 
                        placeholder="MM/AA" 
                        value={cardExpiry} 
                        onChange={handleCardExpiryChange} 
                        className="bg-card/50 border-foreground/10 h-10 rounded-xl text-xs text-center" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="cardCvv" className="font-bold text-[10px] uppercase text-muted-foreground">CVV / Código</Label>
                      <Input 
                        id="cardCvv" 
                        placeholder="123" 
                        value={cardCvv} 
                        onChange={handleCardCvvChange} 
                        className="bg-card/50 border-foreground/10 h-10 rounded-xl text-xs text-center" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DEBIT CARD INFO */}
            {isDebit && (
              <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-muted-foreground leading-relaxed animate-in fade-in duration-300 font-medium">
                Você escolheu pagar com Cartão de Débito. O pagamento será processado à vista de forma instantânea através do seu saldo bancário autorizado.
              </div>
            )}

            {/* Action Submit Button */}
            <Button 
              type="submit" 
              className="w-full btn-primary h-12 text-xs font-black uppercase tracking-wider gap-2 shadow-lg shadow-primary/25"
            >
              Confirmar Pagamento Seguro <ShieldCheck className="w-4.5 h-4.5" />
            </Button>
          </form>
        </div>

        {/* Right Details Sidebar (1/3 width) */}
        <div className="space-y-6">
          <Card className="p-6 bg-card/30 border border-white/5 rounded-3xl space-y-6 sticky top-28">
            <h3 className="font-bold text-base border-b border-white/5 pb-3">Resumo do Serviço</h3>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Cpu className="text-primary w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest block leading-none mb-0.5">Chamado Técnico</span>
                  <span className="text-xs font-bold text-foreground line-clamp-1">{order.serviceTitle}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Briefcase className="text-primary w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest block leading-none mb-0.5">Técnico</span>
                  <span className="text-xs font-bold text-foreground">{order.professionalName}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="text-primary w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest block leading-none mb-0.5">Atendimento</span>
                  <span className="text-xs font-bold text-foreground line-clamp-1">{order.address}</span>
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div className="pt-4 border-t border-white/5 space-y-2 text-xs">
              <div className="flex justify-between font-semibold text-muted-foreground">
                <span>Valor Proposto</span>
                <span>{formatCurrency(order.price)}</span>
              </div>
              <div className="flex justify-between font-semibold text-muted-foreground">
                <span>Taxa Garantia TechFix</span>
                <span>R$ 15,00</span>
              </div>
              {isPix && (
                <div className="flex justify-between font-semibold text-primary">
                  <span>Desconto PIX (-5%)</span>
                  <span>- {formatCurrency((order.price + 15) * 0.05)}</span>
                </div>
              )}
              <div className="pt-3 border-t border-white/5 flex justify-between font-black text-sm text-foreground">
                <span>Total Geral</span>
                <span className="text-primary">
                  {formatCurrency(isPix ? (order.price + 15) * 0.95 : (order.price + 15))}
                </span>
              </div>
            </div>

            {/* Custody explanation */}
            <div className="p-3.5 rounded-xl bg-foreground/5 text-[10px] text-muted-foreground leading-relaxed font-semibold">
              🔐 **Custódia Segura**: O seu pagamento fica retido de forma segura na TechFix e só é transferido ao técnico após você confirmar a conclusão do reparo técnico com sucesso.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCounterOfferPage;
