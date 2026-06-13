import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Order } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { Wrench, Printer, CheckCircle } from 'lucide-react';

const OrderPrintPage = () => {
  const { id } = useParams();
  const [order, setOrder] = React.useState<Order | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Unauthorized');
        
        const res = await fetch(`/api/orders/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) {
          throw new Error('Falha ao carregar ordem de serviço');
        }

        const data = await res.json();
        setOrder(data);

        // Auto trigger print after a small delay to allow image rendering
        setTimeout(() => {
          window.print();
        }, 800);

      } catch (e: any) {
        setError(e.message || 'Erro ao carregar');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white print:hidden">
        <p className="text-gray-500 font-medium">Carregando Ordem de Serviço para Impressão...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-white print:hidden space-y-4">
        <p className="text-red-500 font-bold">Não foi possível carregar a Ordem de Serviço.</p>
        <button onClick={() => window.close()} className="px-4 py-2 bg-gray-200 rounded-md font-medium text-gray-800">Fechar Guia</button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white text-gray-900 font-sans pb-12">
      {/* Non-printable controls */}
      <div className="print:hidden flex justify-between items-center bg-white shadow-sm px-8 py-4 mb-8">
        <div className="flex items-center gap-2 text-primary font-black">
          <Wrench className="w-5 h-5" /> TechFix O.S. Viewer
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => window.close()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50"
          >
            Fechar
          </button>
          <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-primary/90 flex items-center gap-2 shadow-md shadow-primary/20"
          >
            <Printer className="w-4 h-4" /> Imprimir ou Salvar PDF
          </button>
        </div>
      </div>

      {/* Printable Area - A4 Size Simulation */}
      <div className="max-w-[800px] mx-auto bg-white shadow-xl print:shadow-none print:max-w-none p-10 md:p-14 border border-gray-200 print:border-none print:p-0">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-gray-900 pb-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gray-900 p-2.5 rounded-xl">
              <Wrench className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">TECHFIX</h1>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Marketplace de Reparos</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-black text-gray-900 mb-1 uppercase">Ordem de Serviço</h2>
            <p className="text-sm font-bold text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded inline-block">{order.code}</p>
            <p className="text-xs text-gray-500 mt-2 font-medium">Data de Emissão: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Dados do Cliente</p>
            <h3 className="font-bold text-lg text-gray-900">{order.clientName}</h3>
            <p className="text-sm text-gray-600 max-w-[250px] leading-relaxed">{order.address}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Profissional Responsável</p>
            <h3 className="font-bold text-lg text-gray-900">{order.professionalName}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Especialista Credenciado TechFix</p>
          </div>
        </div>

        {/* Service Details Table */}
        <div className="mb-10">
          <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-3">Detalhamento do Serviço</p>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase font-black tracking-wider text-gray-500">
                  <th className="py-3 px-4">Descrição</th>
                  <th className="py-3 px-4">Agendamento</th>
                  <th className="py-3 px-4 text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 last:border-0">
                  <td className="py-4 px-4">
                    <p className="font-bold text-gray-900">{order.serviceTitle}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Execução no local conforme escopo padrão.</p>
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-700">
                    {order.date} às {order.time}
                  </td>
                  <td className="py-4 px-4 text-right font-black text-gray-900">
                    {formatCurrency(order.price)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="flex justify-end mb-12">
          <div className="w-64 space-y-3">
            <div className="flex justify-between items-center text-sm font-medium text-gray-600">
              <span>Subtotal:</span>
              <span>{formatCurrency(order.price)}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium text-gray-600">
              <span>Descontos:</span>
              <span>R$ 0,00</span>
            </div>
            <div className="border-t-2 border-gray-900 pt-3 flex justify-between items-center">
              <span className="font-black text-gray-900 uppercase tracking-wide">Total:</span>
              <span className="text-xl font-black text-gray-900">{formatCurrency(order.price)}</span>
            </div>
          </div>
        </div>

        {/* Status & Payment info */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 flex items-start gap-4 mb-16">
          <div className="bg-white p-2 rounded-full shadow-sm">
            <CheckCircle className="w-6 h-6 text-gray-900" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1 uppercase tracking-wide text-sm">Resumo do Pagamento</h4>
            <p className="text-sm text-gray-600">
              Método selecionado na plataforma: <span className="font-bold uppercase">{order.paymentMethod === 'pix' ? 'PIX' : order.paymentMethod === 'credit' ? 'Cartão de Crédito' : 'Cartão de Débito'}</span>.
            </p>
            <p className="text-xs text-gray-500 mt-2 font-medium">Status do Serviço: {order.status === 'completed' ? 'Concluído' : order.status.toUpperCase()}</p>
          </div>
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-12 pt-8">
          <div className="text-center">
            <div className="border-t border-gray-400 pt-2">
              <p className="font-bold text-sm text-gray-900">{order.clientName}</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Assinatura do Cliente</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-gray-400 pt-2">
              <p className="font-bold text-sm text-gray-900">{order.professionalName}</p>
              <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Especialista Responsável</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-20 text-center border-t border-gray-100 pt-6">
          <p className="text-[10px] text-gray-400 font-medium">
            TechFix Intermediação de Serviços Ltda - CNPJ: 00.000.000/0001-00<br/>
            Este documento é um registro de prestação de serviços intermediado pela plataforma TechFix.
          </p>
        </div>

      </div>
    </div>
  );
};

export default OrderPrintPage;
