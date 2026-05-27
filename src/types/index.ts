export type UserRole = "client" | "professional" | "admin";

export interface User {
  id: string;
  name: string; // aggregated from firstName + lastName
  email: string;
  role: UserRole;
  avatar?: string; // from avatarUrl
  level?: string;
  status?: "active" | "inactive";
  firstName?: string;
  lastName?: string;
  phone?: string;
  documentCpf?: string;
}

export interface Professional extends User {
  categoryId: string;
  categoryName?: string;
  yearsExperience: number;
  bio: string;
  rating: number;
  jobsCompleted: number;
  portfolio?: any[];
  // Legacy fields for UI compatibility if needed temporarily
  specialty?: string;
  city?: string;
  reviewCount?: number;
  jobs?: number;
  satisfaction?: number;
}

export interface Service {
  id: string;
  professionalId: string;
  categoryId: string;
  title: string;
  description: string;
  basePrice: number;
  estimatedDuration: string;
  tags?: string[];
  // Legacy fields for UI
  price?: number;
  duration?: string;
  image?: string;
}

export type OrderStatus = "pending" | "scheduled" | "in_progress" | "completed" | "cancelled" | "accepted" | "rejected";

export interface Order {
  id: string;
  serviceId: string;
  clientId: string;
  professionalId: string;
  scheduledDate: string;
  scheduledTime: string;
  status: OrderStatus;
  totalPrice: number;
  addressId: string;
  // Legacy fields
  date?: string;
  time?: string;
  price?: number;
  serviceTitle?: string;
}

export interface Transaction {
  id: string;
  type: "income" | "expense";
  title: string;
  value: number;
  date: string;
  status: "completed" | "pending" | "failed" | "paid";
}

export interface Review {
  id: string;
  orderId: string;
  rating: number;
  comment: string;
  createdAt: string;
}