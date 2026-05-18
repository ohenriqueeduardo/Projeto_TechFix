import React from 'react';
import { useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Paperclip, MoreVertical, Phone, Video, Search } from 'lucide-react';
import { professionals } from '@/data/mockData';

const ChatPage = () => {
  const { id } = useParams();
  const professional = professionals.find(p => p.id === id) || professionals[0];
  const [message, setMessage] = React.useState('');

  const messages = [
    { id: 1, sender: 'pro', text: 'Olá Sofia! Recebi seu pedido de manutenção preventiva.', time: '10:30' },
    { id: 2, sender: 'me', text: 'Oi Carlos! Que bom. Você consegue vir amanhã à tarde?', time: '10:32' },
    { id: 3, sender: 'pro', text: 'Consigo sim. Por volta das 14h está bom para você?', time: '10:35' },
    { id: 4, sender: 'me', text: 'Perfeito! Já deixarei tudo pronto aqui.', time: '10:36' },
    { id: 5, sender: 'pro', text: 'Combinado. Até amanhã!', time: '10:40' },
  ];

  return (
    <div className="h-[calc(100vh-200px)] flex gap-6 animate-in fade-in duration-500">
      {/* Contacts Sidebar */}
      <div className="hidden md:flex flex-col w-80 glass-card rounded-[2.5rem] overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-xl font-bold mb-4">Mensagens</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Buscar conversa..." className="pl-10 bg-white/5 border-white/5 rounded-xl" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {professionals.map((p) => (
            <div key={p.id} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${p.id === id ? 'bg-primary text-background' : 'hover:bg-white/5'}`}>
              <img src={p.avatar} className="w-12 h-12 rounded-xl object-cover" alt="" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold truncate">{p.name}</h4>
                <p className={`text-xs truncate ${p.id === id ? 'text-background/70' : 'text-muted-foreground'}`}>Online agora</p>
              </div>
              {p.id === 'p1' && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col glass-card rounded-[2.5rem] overflow-hidden">
        {/* Chat Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-4">
            <img src={professional.avatar} className="w-12 h-12 rounded-xl object-cover" alt="" />
            <div>
              <h4 className="font-bold">{professional.name}</h4>
              <p className="text-xs text-green-500 font-bold uppercase tracking-widest">Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/10"><Phone className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/10"><Video className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/10"><MoreVertical className="w-5 h-5" /></Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-4 rounded-2xl ${
                msg.sender === 'me' 
                ? 'bg-primary text-background rounded-tr-none font-medium' 
                : 'bg-white/5 border border-white/5 rounded-tl-none'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <span className={`text-[10px] mt-2 block text-right ${msg.sender === 'me' ? 'text-background/60' : 'text-muted-foreground'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white/5 border-t border-white/5">
          <form className="flex items-center gap-4" onSubmit={(e) => { e.preventDefault(); setMessage(''); }}>
            <Button type="button" variant="ghost" size="icon" className="rounded-xl hover:bg-white/10 shrink-0">
              <Paperclip className="w-5 h-5" />
            </Button>
            <Input 
              placeholder="Digite sua mensagem..." 
              className="h-14 bg-background/50 border-white/10 rounded-2xl"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit" className="btn-primary h-14 w-14 rounded-2xl shrink-0 p-0">
              <Send className="w-6 h-6" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;