import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Shield, ArrowLeft, CheckCircle2, UserCheck } from 'lucide-react';
import { services } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';
import { Professional } from '@/types';

const ServiceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const service = services.find(s => s.id === id);
  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  const isProfessional = currentUser?.role === 'professional';

  const [dbProfessionals, setDbProfessionals] = useState<Professional[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/professionals');
        if (res.ok) {
          const dbData = await res.json();
          setDbProfessionals(dbData);
        } else {
          setDbProfessionals([]);
        }
      } catch (error) {
        console.error("Failed to fetch professionals:", error);
        setDbProfessionals([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfessionals();
  }, []);

  if (!service) return <div>Serviço não encontrado</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 -ml-2 text-muted-foreground">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative rounded-3xl overflow-hidden aspect-video">
            <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <Badge className="mb-2 bg-primary text-background">{service.category}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold">{service.title}</h1>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold">Sobre este serviço</h2>
            <p className="text-muted-foreground leading-relaxed">{service.description}</p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-card/50 border border-white/5">
                <Clock className="text-primary w-5 h-5" />
                <div>
                  <p className="text-xs text-muted-foreground">Duração estimada</p>
                  <p className="font-bold">{service.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-card/50 border border-white/5">
                <Shield className="text-primary w-5 h-5" />
                <div>
                  <p className="text-xs text-muted-foreground">Garantia</p>
                  <p className="font-bold">30 dias</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold">O que está incluso</h2>
            <ul className="space-y-3">
              {['Diagnóstico completo', 'Mão de obra especializada', 'Testes de funcionamento', 'Suporte pós-serviço'].map(item => (
                <li key={item} className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle2 className="text-primary w-5 h-5" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Booking Card */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl border-primary/20 sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-muted-foreground">Orçamento inicial</span>
              <span className="text-3xl font-bold text-primary">{formatCurrency(service.price)}</span>
            </div>

            {/* Técnicos Disponíveis */}
            <div className="pt-2">
              <h3 className="font-bold text-lg mb-1">Técnicos Disponíveis</h3>
              <p className="text-xs text-muted-foreground mb-6">Escolha um profissional capacitado para realizar este serviço.</p>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <span className="h-8 w-8 rounded-full border-4 border-t-primary border-white/5 animate-spin"></span>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {dbProfessionals.map((prof: Professional & { userId?: string }) => (
                    <div key={prof.id || prof.userId} className="p-4 rounded-2xl bg-card/40 border border-white/5 hover:border-primary/30 transition-all flex flex-col gap-4">
                      <div className="flex items-center gap-4">
                        <img src={prof.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(prof.name)}`} className="w-12 h-12 rounded-xl object-cover border border-white/10" alt={prof.name} />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm truncate">{prof.name}</h4>
                          <div className="flex items-center gap-1 text-yellow-500 text-[10px] font-bold mt-0.5">
                            <Star className="w-3 h-3 fill-current" /> {prof.rating} ({prof.reviewCount} avaliações)
                          </div>
                        </div>
                      </div>
                      
                      {!isProfessional && (
                        <Link to={`/cliente/contratar/${service.id}?prof=${prof.id || prof.userId}`}>
                          <Button className="w-full btn-primary h-10 text-xs font-black gap-2">
                            <UserCheck className="w-4 h-4" /> Escolher e Contratar
                          </Button>
                        </Link>
                      )}
                    </div>
                  ))}
                  
                  {dbProfessionals.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">Nenhum técnico disponível no momento.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;