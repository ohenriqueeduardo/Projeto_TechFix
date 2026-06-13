/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification } from '@/types';

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (title: string, desc: string, type?: "info" | "success" | "warning" | "error") => void;
  deleteNotification: (id: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (!userStr || !token) return;
      
      try {
        const user = JSON.parse(userStr);
        const res = await fetch(`/api/notifications/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          // Transform db fields (read: 0/1) to context fields (unread: boolean)
          setNotifications(data.map((n: { id: string; title: string; message: string; createdAt: string; type: any; read: number }) => ({
            id: n.id,
            title: n.title,
            desc: n.message,
            time: new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            date: new Date(n.createdAt).toISOString().split('T')[0],
            type: n.type,
            unread: n.read === 0
          })));
        }
      } catch (e) {
        console.error('Failed to fetch notifications', e);
      }
    };
    fetchNotifications();
    
    // Polling every 30s as a simple realtime alternative
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = () => {
    notifications.forEach(n => {
      if (n.unread) markAsRead(n.id);
    });
  };

  const addNotification = async (title: string, desc: string, type: "info" | "success" | "warning" | "error" = "info") => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!userStr || !token) return;
    
    try {
      const user = JSON.parse(userStr);
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          title,
          message: desc,
          type
        })
      });
      if (res.ok) {
        const n = await res.json();
        const newNote: Notification = {
          id: n.id,
          title: n.title,
          desc: n.message,
          time: new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          date: new Date(n.createdAt).toISOString().split('T')[0],
          type: n.type,
          unread: n.read === 0
        };
        setNotifications(prev => [newNote, ...prev]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteNotification = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, addNotification, deleteNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
