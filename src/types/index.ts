export type UserRole = "client" | "professional" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  level?: string;
  status?: "active" | "inactive";
  specialty?: string;
  city?: string;
  isVerified?: boolean;
  verificationStatus?: "unverified" | "pending" | "verified" | "rejected";
}

export interface Professional extends User {
  specialty: string;
  city: string;
  rating: number;
  reviewCount: number;
  jobs: number;
  yearsExperience: number;
  satisfaction: number;
  bio: string;
  portfolio?: string[];
  availableDays?: string[];
  availableTimes?: string[];
}

export interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  duration: string;
  rating: number;
  professionalId: string;
  badge?: string;
  tags: string[];
  image?: string;
}

export type OrderStatus = "provisional" | "pending" | "scheduled" | "in_progress" | "completed" | "cancelled" | "counter_offer";

export interface Order {
  id: string;
  code: string;
  serviceId: string;
  serviceTitle: string;
  clientName: string;
  clientId: string;
  professionalId: string;
  professionalName: string;
  date: string;
  time: string;
  status: OrderStatus;
  price: number;
  paymentMethod: "pix" | "debit" | "credit";
  paymentId?: string | number;
  address: string;
}

export interface Transaction {
  id: string;
  type: "income" | "expense";
  title: string;
  value: number;
  date: string;
  status: "completed" | "pending" | "failed";
  professionalId?: string;
}

export interface Review {
  id: string;
  serviceId: string;
  professionalId: string;
  clientName: string;
  rating: number;
  comment: string;
  tags: string[];
  date: string;
}

export interface Notification {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  type?: "info" | "success" | "warning" | "error";
  date?: string;
}

export interface PaymentInstallment {
  number: number;
  value: number;
  total: number;
  formatted: string;
}

export interface Address {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export type ThemeMode = "light" | "dark" | "system";