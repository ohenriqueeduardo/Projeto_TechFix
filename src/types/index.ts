export type UserRole = "client" | "professional" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  level?: string;
  status?: "active" | "inactive";
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

export type OrderStatus = "pending" | "scheduled" | "in_progress" | "completed" | "cancelled";

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
  address: string;
}

export interface Transaction {
  id: string;
  type: "income" | "expense";
  title: string;
  value: number;
  date: string;
  status: "completed" | "pending" | "failed";
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