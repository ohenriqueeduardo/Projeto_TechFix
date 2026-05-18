import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Shield, MessageSquare, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { services, professionals } from '@/data/mockData';
import { formatCurrency } from '@/utils/formatters';

const ServiceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const service = services.find(s => s.id === id);
  const professional = professionals.find(p => p.id === service?.professionalId);

  if (!service || !professional) return <div>Serviço não encontrado</div>;

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

            <Link to={`/cliente/contratar/${service.id}`}>
              <Button className="w-full btn-primary h-14 text-lg mb-4">Contratar Agora</Button>
            </Link>
            
            <Link to={`/cliente/chat/${professional.id}`}>
              <Button variant="outline" className="w-full h-12 rounded-xl gap-2">
                <MessageSquare className="w-4 h-4" /> Conversar com Técnico
              </Button>
            </Link>

            <div className="mt-8 pt-8 border-t border-white/5">
              <div className="flex items-center gap-4 mb-4">
                <img src={professional.avatar} className="w-12 h-12 rounded-full border border-white/10" alt={professional.name} />
                <div>
                  <h4 className="font-bold">{professional.name}</h4>
                  <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                    <Star className="w-3 h-3 fill-current" /> {professional.rating} ({professional.reviewCount} avaliações)
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{professional.bio}</p>
              <Link to={`/cliente/profissional/${professional.id}`} className="text-xs text-primary font-bold hover:underline">
                Ver perfil completo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;