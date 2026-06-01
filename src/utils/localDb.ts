import { users as initialUsers, professionals as initialProfessionals, services as initialServices, orders as initialOrders, transactions as initialTransactions } from '@/data/mockData';
import { User, Professional, Service, Order, Transaction, Notification } from '@/types';

const KEYS = {
  USERS: 'techfix_users',
  PROFESSIONALS: 'techfix_professionals',
  SERVICES: 'techfix_services',
  ORDERS: 'techfix_orders',
  TRANSACTIONS: 'techfix_transactions',
  NOTIFICATIONS: 'techfix_notifications',
  CURRENT_USER: 'user',
};

export const initializeDb = () => {
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(initialUsers));
  }
  if (!localStorage.getItem(KEYS.PROFESSIONALS)) {
    localStorage.setItem(KEYS.PROFESSIONALS, JSON.stringify(initialProfessionals));
  }
  if (!localStorage.getItem(KEYS.SERVICES)) {
    localStorage.setItem(KEYS.SERVICES, JSON.stringify(initialServices));
  }
  if (!localStorage.getItem(KEYS.ORDERS)) {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(initialOrders));
  }
  if (!localStorage.getItem(KEYS.TRANSACTIONS)) {
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(initialTransactions));
  }
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    const defaultNotifications: Notification[] = [
      { id: "n1", title: "Pedido Confirmado", desc: "Seu pedido #TF-2024 foi aceito.", time: "2 min atrás", unread: true, date: "2026-05-27" },
      { id: "n2", title: "Nova Mensagem", desc: "Carlos Mendes enviou uma mensagem.", time: "1h atrás", unread: true, date: "2026-05-27" },
      { id: "n3", title: "Serviço Concluído", desc: "Avalie o serviço de manutenção.", time: "5h atrás", unread: false, date: "2026-05-27" },
    ];
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(defaultNotifications));
  }
  
  // Seed current user if not exists to facilitate presentation
  if (!localStorage.getItem(KEYS.CURRENT_USER)) {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(initialUsers[0])); // Default is client Sofia Spencer
    localStorage.setItem('token', 'mock_jwt_token_sofia');
  }
};

export const getLocalUsers = (): User[] => {
  initializeDb();
  return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
};
export const saveLocalUsers = (users: User[]) => localStorage.setItem(KEYS.USERS, JSON.stringify(users));

export const getLocalProfessionals = (): Professional[] => {
  initializeDb();
  return JSON.parse(localStorage.getItem(KEYS.PROFESSIONALS) || '[]');
};
export const saveLocalProfessionals = (professionals: Professional[]) => localStorage.setItem(KEYS.PROFESSIONALS, JSON.stringify(professionals));

export const getLocalServices = (): Service[] => {
  initializeDb();
  return JSON.parse(localStorage.getItem(KEYS.SERVICES) || '[]');
};
export const saveLocalServices = (services: Service[]) => localStorage.setItem(KEYS.SERVICES, JSON.stringify(services));

export const getLocalOrders = (): Order[] => {
  initializeDb();
  return JSON.parse(localStorage.getItem(KEYS.ORDERS) || '[]');
};
export const saveLocalOrders = (orders: Order[]) => localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));

export const getLocalTransactions = (): Transaction[] => {
  initializeDb();
  return JSON.parse(localStorage.getItem(KEYS.TRANSACTIONS) || '[]');
};
export const saveLocalTransactions = (txs: Transaction[]) => localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(txs));

export const getLocalNotifications = (): Notification[] => {
  initializeDb();
  return JSON.parse(localStorage.getItem(KEYS.NOTIFICATIONS) || '[]');
};
export const saveLocalNotifications = (notes: Notification[]) => localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notes));
