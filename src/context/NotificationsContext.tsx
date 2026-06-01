/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Notification } from '@/types';
import { getLocalNotifications, saveLocalNotifications } from '@/utils/localDb';

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
    setNotifications(getLocalNotifications());
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, unread: false } : n);
    setNotifications(updated);
    saveLocalNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, unread: false }));
    setNotifications(updated);
    saveLocalNotifications(updated);
  };

  const addNotification = (title: string, desc: string, type: "info" | "success" | "warning" | "error" = "info") => {
    const newNote: Notification = {
      id: `n_${Date.now()}`,
      title,
      desc,
      time: "Agora mesmo",
      unread: true,
      type,
      date: new Date().toISOString().split('T')[0]
    };
    const updated = [newNote, ...notifications];
    setNotifications(updated);
    saveLocalNotifications(updated);
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id);
    setNotifications(updated);
    saveLocalNotifications(updated);
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
