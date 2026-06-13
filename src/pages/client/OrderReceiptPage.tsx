import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/utils/formatters';
import { Order } from '@/types';
import logo from '@/assets/logo.png';

const OrderReceiptPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = React.useState<Order | null>(null);

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`/api/orders/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error('Não encontrado');
        return res.json();
      })
      .then((data) => setOrder(data))
      .catch(() => {
        setOrder(null);
      });
  }, [id]);

  if (!order) {
    return (
      <div className="flex h-screen items-center justify-center print:hidden bg-background text-foreground">
        <div className="text-center space-y-4">
          <p className="font-bold text-lg">Ordem de Serviço não encontrada.</p>
          <button 
            onClick={() => navigate(-1)} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans print:p-0 print:bg-white print:text-black">
      
      {/* Top Action Bar (Hidden on Print) */}
      <div className="flex justify-between items-center mb-8 print:hidden max-w-3xl mx-auto border-b pb-4 border-gray-200">
        <button 
          onClick={() => navigate(-1)} 
          className="text-gray-600 hover:text-black font-bold text-sm flex items-center gap-2"
        >
          ← Voltar
        </button>
        <button 
          onClick={handlePrint}
          className="bg-black text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors"
        >
          Imprimir / Salvar PDF
        </button>
      </div>

      {/* Printable Area */}
      <div className="max-w-3xl mx-auto border border-gray-300 rounded-none p-10 print:border-none print:p-0">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-6">
          <div className="space-y-1">
            <img src={logo} alt="TechFix" className="h-10 w-auto mb-4 grayscale" />
            <h1 className="text-2xl font-black uppercase tracking-widest text-black">Ordem de Serviço</h1>
            <p className="text-sm font-bold text-gray-500">Documento Auxiliar de Prestação de Serviço</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-xs uppercase font-bold text-gray-500">Número da O.S.</p>
            <p className="text-xl font-black text-black">{order.code}</p>
            <p className="text-xs font-bold text-gray-500 mt-2">Data de Emissão</p>
            <p className="text-sm font-black text-black">{new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="space-y-2 border border-gray-200 p-4 bg-gray-50">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-2 mb-2">Dados do Cliente</h3>
            <p className="text-sm font-bold text-black">{order.clientName}</p>
            <p className="text-xs text-gray-600">ID: {order.clientId}</p>
            <p className="text-xs text-gray-600 mt-2"><span className="font-bold">Endereço:</span> {order.address}</p>
          </div>
          
          <div className="space-y-2 border border-gray-200 p-4 bg-gray-50">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 border-b border-gray-200 pb-2 mb-2">Responsável Técnico</h3>
            <p className="text-sm font-bold text-black">{order.professionalName}</p>
            <p className="text-xs text-gray-600">ID: {order.professionalId}</p>
            <p className="text-xs text-gray-600 mt-2"><span className="font-bold">Plataforma:</span> TechFix Serviços LTDA</p>
          </div>
        </div>

        {/* Service Details */}
        <div className="mb-8 border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="p-3 text-xs font-black uppercase tracking-wider text-gray-600">Descrição do Serviço</th>
                <th className="p-3 text-xs font-black uppercase tracking-wider text-gray-600">Agendamento</th>
                <th className="p-3 text-xs font-black uppercase tracking-wider text-gray-600 text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 text-sm font-bold border-b border-gray-200">{order.serviceTitle}</td>
                <td className="p-4 text-sm text-gray-600 border-b border-gray-200">{order.date} às {order.time}</td>
                <td className="p-4 text-sm font-black text-right border-b border-gray-200">{formatCurrency(order.price)}</td>
              </tr>
              {/* Custódia */}
              <tr>
                <td className="p-4 text-xs font-bold text-gray-500">Taxa Administrativa (Custódia TechFix)</td>
                <td className="p-4 text-xs text-gray-500">-</td>
                <td className="p-4 text-sm font-black text-right">{formatCurrency(15)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Totals & Payment */}
        <div className="flex justify-end mb-12">
          <div className="w-1/2 space-y-3">
            <div className="flex justify-between text-sm border-b border-gray-200 pb-2">
              <span className="font-bold text-gray-600">Subtotal Serviço:</span>
              <span className="font-bold">{formatCurrency(order.price)}</span>
            </div>
            <div className="flex justify-between text-sm border-b border-gray-200 pb-2">
              <span className="font-bold text-gray-600">Taxa Custódia:</span>
              <span className="font-bold">{formatCurrency(15)}</span>
            </div>
            <div className="flex justify-between text-lg items-center">
              <span className="font-black uppercase tracking-wider">Total Final:</span>
              <span className="font-black text-xl">{formatCurrency(order.price + 15)}</span>
            </div>
            <div className="mt-4 p-4 bg-gray-100 rounded text-right space-y-1">
              <p className="text-xs font-black uppercase tracking-wider text-gray-500">Método de Pagamento</p>
              <p className="text-sm font-bold uppercase">{order.paymentMethod}</p>
              {order.paymentId && (
                <p className="text-[10px] text-gray-500 font-mono mt-1">Transação ID: {order.paymentId}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer & Signatures */}
        <div className="mt-16 pt-8 border-t-2 border-black space-y-8">
          <p className="text-xs text-justify text-gray-500 leading-relaxed font-medium">
            Ao assinar esta ordem de serviço, o cliente atesta ter verificado os serviços prestados e que o equipamento encontra-se em perfeito funcionamento de acordo com os termos contratados. A TechFix fornece garantia padrão de 30 dias sobre a mão de obra prestada, contados a partir da data de conclusão do serviço. Peças e componentes de hardware possuem garantia direta com o fabricante.
          </p>

          <div className="flex justify-between pt-10">
            <div className="w-5/12 text-center border-t border-black pt-2">
              <p className="text-xs font-bold text-black uppercase">{order.professionalName}</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">Assinatura do Técnico Responsável</p>
            </div>
            <div className="w-5/12 text-center border-t border-black pt-2">
              <p className="text-xs font-bold text-black uppercase">{order.clientName}</p>
              <p className="text-[10px] font-bold text-gray-500 uppercase mt-0.5">Assinatura do Cliente</p>
            </div>
          </div>

          <div className="text-center mt-8 pt-4">
            <p className="text-[10px] font-bold text-gray-400">Gerado pelo sistema TechFix • www.techfix.com.br</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderReceiptPage;
