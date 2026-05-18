import { User, Professional, Service, Order, Transaction, Review } from "@/types/index";

export const users: User[] = [
  { id: "u1", name: "Sofia Spencer", email: "sofia@example.com", role: "client", avatar: "https://i.pravatar.cc/150?u=sofia" },
  { id: "u2", name: "Carlos Mendes", email: "carlos@example.com", role: "professional", avatar: "https://i.pravatar.cc/150?u=carlos" },
  { id: "u3", name: "Henrique Eduardo", email: "admin@techfix.com", role: "admin", level: "Adamantium" },
];

export const professionals: Professional[] = [
  {
    id: "p1",
    name: "Carlos Mendes",
    email: "carlos@example.com",
    role: "professional",
    specialty: "Técnico em Hardware",
    city: "São Paulo, SP",
    rating: 4.9,
    reviewCount: 128,
    jobs: 234,
    yearsExperience: 8,
    satisfaction: 98,
    bio: "Especialista em montagem de PCs Gamer de alto desempenho e manutenção preventiva.",
    avatar: "https://i.pravatar.cc/150?u=carlos"
  },
  {
    id: "p2",
    name: "Diego Faria",
    email: "diego@example.com",
    role: "professional",
    specialty: "Redes e Segurança",
    city: "Rio de Janeiro, RJ",
    rating: 4.8,
    reviewCount: 85,
    jobs: 150,
    yearsExperience: 5,
    satisfaction: 95,
    bio: "Configuração de redes domésticas e empresariais, Wi-Fi e segurança digital.",
    avatar: "https://i.pravatar.cc/150?u=diego"
  }
];

export const services: Service[] = [
  {
    id: "s1",
    title: "Manutenção Preventiva PC",
    category: "Manutenção",
    description: "Limpeza completa, troca de pasta térmica e otimização de software.",
    price: 180,
    duration: "2h",
    rating: 4.9,
    professionalId: "p1",
    badge: "Mais Vendido",
    tags: ["Limpeza", "Hardware", "Otimização"],
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop"
  },
  {
    id: "s2",
    title: "Montagem Completa PC Gamer",
    category: "Montagem",
    description: "Montagem profissional com cable management e teste de stress.",
    price: 350,
    duration: "4h",
    rating: 5.0,
    professionalId: "p1",
    tags: ["Gamer", "Hardware", "Performance"],
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop"
  }
];

export const orders: Order[] = [
  {
    id: "o1",
    code: "TF-2024-00842",
    serviceId: "s1",
    serviceTitle: "Manutenção Preventiva PC",
    clientName: "Sofia Spencer",
    clientId: "u1",
    professionalId: "p1",
    professionalName: "Carlos Mendes",
    date: "2024-05-20",
    time: "14:00",
    status: "scheduled",
    price: 180,
    paymentMethod: "pix",
    address: "Av. Paulista, 1000 - São Paulo, SP"
  }
];

export const transactions: Transaction[] = [
  { id: "t1", type: "income", title: "Serviço: Manutenção PC", value: 180, date: "2024-05-18", status: "completed" },
  { id: "t2", type: "expense", title: "Saque via PIX", value: 360, date: "2024-05-15", status: "completed" }
];