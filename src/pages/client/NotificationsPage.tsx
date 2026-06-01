import React from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Trash2, 
  CheckCircle, 
  Info, 
  AlertTriangle, 
  CheckSquare,
  FileText
} from 'lucide-react';
import { useNotifications } from '@/context/NotificationsContext';

const NotificationsPage = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [filter, setFilter] = React.useState<'all' | 'unread'>('all');

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return n.unread;
    return true;
  });

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <div className="space-y-8 animate-page-entrance max-w-4xl mx-auto">
      <PageHeader 
        title="Minhas Notificações" 
        description="Fique por dentro de atualizações sobre seus chamados abertos, orçamentos, novas mensagens e novidades."
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-foreground/5 pb-4">
        {/* Filters */}
        <div className="flex gap-3">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
            size="sm"
            className="rounded-full text-xs font-bold"
          >
            Todas ({notifications.length})
          </Button>
          <Button 
            variant={filter === 'unread' ? 'default' : 'outline'}
            onClick={() => setFilter('unread')}
            size="sm"
            className="rounded-full text-xs font-bold gap-1.5"
          >
            Não Lidas
            {unreadCount > 0 && (
              <Badge className="bg-primary text-background border-transparent font-black px-1.5 text-[9px]">
                {unreadCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Global actions */}
        {unreadCount > 0 && (
          <Button 
            onClick={() => markAllAsRead()}
            variant="ghost"
            size="sm"
            className="text-xs font-black text-primary hover:underline hover:bg-transparent p-0 gap-1.5"
          >
            <CheckSquare className="w-4 h-4" /> Marcar todas como lidas
          </Button>
        )}
      </div>

      {/* Notifications list */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-3xl border border-dashed border-foreground/10 p-8 space-y-4 max-w-sm mx-auto">
            <div className="w-14 h-14 bg-foreground/5 rounded-full flex items-center justify-center mx-auto mb-2 animate-float">
              <Bell className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold">Sem notificações</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Você não possui novas mensagens ou alertas na aba selecionada.
            </p>
          </div>
        ) : (
          filtered.map((n) => (
            <Card 
              key={n.id} 
              onClick={() => markAsRead(n.id)}
              className={`p-5 bg-card/30 border-foreground/5 rounded-2xl hover:border-primary/25 transition-all group flex gap-4 items-start relative ${
                n.unread ? 'bg-primary/[0.03] border-primary/20' : ''
              }`}
            >
              {/* Type Indicator Icon */}
              <div className="shrink-0 pt-0.5">
                {getNotificationIcon(n.type)}
              </div>

              {/* Text content */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className={`text-sm leading-tight ${n.unread ? 'font-black text-foreground' : 'font-bold text-muted-foreground'}`}>
                    {n.title}
                  </h4>
                  {n.unread && (
                    <Badge className="bg-primary text-background border-transparent font-black px-1.5 text-[8px] uppercase shrink-0">
                      Nova
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pr-8">{n.desc}</p>
                <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-semibold pt-1">
                  <span>{n.time}</span>
                  {n.date && (
                    <>
                      <span>•</span>
                      <span>{n.date}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Individual delete button */}
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(n.id);
                }}
                variant="ghost" 
                size="icon" 
                className="opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all w-8 h-8 absolute right-4 top-4"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
