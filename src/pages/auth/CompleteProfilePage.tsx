import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { ShieldCheck, MapPin, Phone } from 'lucide-react';

const CompleteProfilePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<{ phone?: string, dateOfBirth?: string, cep?: string } | null>(null);

  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [isSearchingCep, setIsSearchingCep] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!storedUser || !token) {
      toast.error('Sessão inválida. Faça login novamente.');
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    
    // Auto-fill if some data already exists
    if (parsedUser.phone) setPhone(parsedUser.phone);
    if (parsedUser.dateOfBirth) setDateOfBirth(parsedUser.dateOfBirth);
    if (parsedUser.cep) setCep(parsedUser.cep);
  }, [navigate]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    let formatted = value;
    if (value.length > 2) formatted = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    if (value.length > 7) formatted = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    setPhone(formatted);
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    let formatted = value;
    if (value.length > 5) formatted = `${value.slice(0, 5)}-${value.slice(5)}`;
    setCep(formatted);

    if (value.length === 8) {
      setIsSearchingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
        const data = await response.json();
        if (data.erro) {
          toast.error('CEP não encontrado.');
        } else {
          setStreet(data.logradouro || '');
          setNeighborhood(data.bairro || '');
          setCity(data.localidade || '');
          setState(data.uf || '');
          toast.success('Endereço auto-preenchido!');
        }
      } catch (err) {
        toast.error('Erro na busca do CEP.');
      } finally {
        setIsSearchingCep(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/auth/complete-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          phone, dateOfBirth, cep, street, number, complement, neighborhood, city, state
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar os dados.');
      }

      // Update user in local storage
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Perfil completado com sucesso!');

      if (data.user.role === 'admin') navigate('/admin/dashboard');
      else if (data.user.role === 'professional') navigate('/profissional/dashboard');
      else navigate('/cliente/dashboard');
      
    } catch (error: unknown) {
      console.error('Erro:', error);
      toast.error((error as Error).message || 'Erro de conexão com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-500">
      <div className="w-full max-w-2xl glass-card rounded-3xl p-8 border-primary/20 shadow-2xl relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="relative space-y-6">
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-primary/10 mb-2">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-black tracking-tight">Complete seu Cadastro</h1>
            <p className="text-sm text-muted-foreground">Precisamos de mais algumas informações de segurança e contato para liberar seu acesso.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-4">
              <h3 className="font-bold flex items-center gap-2 border-b border-foreground/10 pb-2">
                <Phone className="w-4 h-4 text-primary" /> Contato Pessoal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="font-bold text-xs">Telefone (WhatsApp)</Label>
                  <Input 
                    id="phone" 
                    placeholder="(11) 99999-9999" 
                    value={phone} 
                    onChange={handlePhoneChange} 
                    required 
                    className="h-12 bg-card/50 border-foreground/10 rounded-xl" 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dateOfBirth" className="font-bold text-xs">Data de Nascimento</Label>
                  <Input 
                    id="dateOfBirth" 
                    type="date"
                    value={dateOfBirth} 
                    onChange={(e) => setDateOfBirth(e.target.value)} 
                    required 
                    className="h-12 bg-card/50 border-foreground/10 rounded-xl" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold flex items-center gap-2 border-b border-foreground/10 pb-2 mt-6">
                <MapPin className="w-4 h-4 text-primary" /> Endereço Completo
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1 space-y-1.5 relative">
                  <Label htmlFor="cep" className="font-bold text-xs">CEP</Label>
                  <Input 
                    id="cep" 
                    placeholder="00000-000" 
                    value={cep} 
                    onChange={handleCepChange} 
                    required
                    className="h-12 bg-card/50 border-foreground/10 rounded-xl" 
                  />
                  {isSearchingCep && <span className="absolute bottom-3 right-3 h-5 w-5 rounded-full border-2 border-t-primary border-white/5 animate-spin"></span>}
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <Label htmlFor="street" className="font-bold text-xs">Rua / Logradouro</Label>
                  <Input 
                    id="street" 
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                    className="h-12 bg-card/50 border-foreground/10 rounded-xl" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="number" className="font-bold text-xs">Número</Label>
                  <Input 
                    id="number" 
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    required
                    className="h-12 bg-card/50 border-foreground/10 rounded-xl" 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="complement" className="font-bold text-xs">Complemento</Label>
                  <Input 
                    id="complement" 
                    placeholder="Apto, Bloco, etc (Opcional)"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                    className="h-12 bg-card/50 border-foreground/10 rounded-xl" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="neighborhood" className="font-bold text-xs">Bairro</Label>
                  <Input 
                    id="neighborhood" 
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    required
                    className="h-12 bg-card/50 border-foreground/10 rounded-xl" 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="font-bold text-xs">Cidade</Label>
                  <Input 
                    id="city" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="h-12 bg-card/50 border-foreground/10 rounded-xl" 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="state" className="font-bold text-xs">Estado (UF)</Label>
                  <Input 
                    id="state" 
                    value={state}
                    maxLength={2}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    required
                    className="h-12 bg-card/50 border-foreground/10 rounded-xl" 
                  />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full btn-primary h-14 text-base font-black mt-8" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Informações e Acessar'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfilePage;
