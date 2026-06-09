import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Paperclip, MoreVertical, Phone, Video, Search } from 'lucide-react';
import { Professional } from '@/types';

interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  status: string;
}

const ChatPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [message, setMessage] = React.useState('');

  const isProfessional = location.pathname.startsWith('/profissional');

  // Hardcoded Clients for Professional View
  const clients: ChatContact[] = [
    { id: 'c1', name: 'Sofia Spencer', avatar: 'https://i.pravatar.cc/150?u=sofia', status: 'Online agora' },
    { id: 'c2', name: 'Mariana Silva', avatar: 'https://i.pravatar.cc/150?u=mariana', status: 'Visto por último há 10m' },
    { id: 'c3', name: 'Pedro Rocha', avatar: 'https://i.pravatar.cc/150?u=pedro', status: 'Online agora' },
  ];

  const [dbContacts, setDbContacts] = React.useState<ChatContact[]>([]);

  React.useEffect(() => {
    if (!isProfessional) {
      const fetchProfs = async () => {
        try {
          const res = await fetch('http://localhost:3000/api/professionals');
          if (res.ok) {
            const data = await res.json();
            setDbContacts(data.map((p: Professional & { userId?: string, user?: { avatar?: string } }) => ({
              id: p.id || p.userId || '',
              name: p.name,
              avatar: p.user?.avatar || p.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${p.name}`,
              status: 'Online agora'
            })));
          }
        } catch(e) {
          console.error('Failed to fetch professionals:', e);
        }
      };
      fetchProfs();
    }
  }, [isProfessional]);

  const contactsList: ChatContact[] = isProfessional
    ? clients
    : dbContacts.length > 0 ? dbContacts : [{id: '1', name: 'Suporte Técnico', avatar: 'https://i.pravatar.cc/150', status: 'Online agora'}];

  // Pick correct active contact details based on role
  const activeContact: ChatContact = contactsList.find(c => c.id === id) || contactsList[0];

  // Reversible mock conversation history
  const messages = [
    { id: 1, isProfessionalSender: true, text: 'Olá Sofia! Recebi seu pedido de manutenção preventiva.', time: '10:30' },
    { id: 2, isProfessionalSender: false, text: 'Oi Carlos! Que bom. Você consegue vir amanhã à tarde?', time: '10:32' },
    { id: 3, isProfessionalSender: true, text: 'Consigo sim. Por volta das 14h está bom para você?', time: '10:35' },
    { id: 4, isProfessionalSender: false, text: 'Perfeito! Já deixarei tudo pronto aqui.', time: '10:36' },
    { id: 5, isProfessionalSender: true, text: 'Combinado. Até amanhã!', time: '10:40' },
  ];

  return (
    <div className="h-[calc(100vh-200px)] flex gap-6 animate-in fade-in duration-500">
      {/* Contacts Sidebar */}
      <div className="hidden md:flex flex-col w-80 glass-card rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-xl font-bold mb-4">Mensagens</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Buscar conversa..." className="pl-10 bg-white/5 border-white/5 rounded-xl" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {contactsList.map((contact) => (
            <div key={contact.id} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all ${contact.id === activeContact.id ? 'bg-primary text-background' : 'hover:bg-white/5'}`}>
              <img src={contact.avatar} className="w-12 h-12 rounded-xl object-cover" alt="" />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold truncate">{contact.name}</h4>
                <p className={`text-xs truncate ${contact.id === activeContact.id ? 'text-background/70' : 'text-muted-foreground'}`}>
                  {contact.status}
                </p>
              </div>
              {contact.id === 'p1' && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col glass-card rounded-3xl overflow-hidden">
        {/* Chat Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-4">
            <img src={activeContact.avatar} className="w-12 h-12 rounded-xl object-cover" alt="" />
            <div>
              <h4 className="font-bold">{activeContact.name}</h4>
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
          {messages.map((msg) => {
            const isMe = isProfessional ? msg.isProfessionalSender : !msg.isProfessionalSender;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[70%] p-4 rounded-2xl ${
                  isMe 
                  ? 'bg-primary text-background rounded-tr-none font-medium' 
                  : 'bg-white/5 border border-white/5 rounded-tl-none'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <span className={`text-[10px] mt-2 block text-right ${isMe ? 'text-background/60' : 'text-muted-foreground'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          <div className="flex justify-start animate-in fade-in duration-500">
            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-semibold">
                {isProfessional ? 'Sofia Spencer está digitando' : 'Carlos Mendes está digitando'}
              </span>
              <div className="flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 bg-primary rounded-full typing-dot"></span>
                <span className="w-1.5 h-1.5 bg-primary rounded-full typing-dot"></span>
                <span className="w-1.5 h-1.5 bg-primary rounded-full typing-dot"></span>
              </div>
            </div>
          </div>
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