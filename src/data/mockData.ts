// Nova estrutura de Mock Data para bater com o novo esquema

export const users = [
  { id: "u1", email: "sofia@example.com", role: "client", status: "active" },
  { id: "p1", email: "carlos@example.com", role: "professional", status: "active" },
  { id: "p2", email: "diego@example.com", role: "professional", status: "active" },
  { id: "u3", email: "admin@techfix.com", role: "admin", status: "active" },
  { id: "u_temp1", email: "mariana@example.com", role: "client", status: "active" },
  { id: "u_temp2", email: "pedro@example.com", role: "client", status: "active" },
  { id: "u_temp3", email: "lucas@example.com", role: "client", status: "active" },
];

export const userProfiles = [
  { userId: "u1", firstName: "Sofia", lastName: "Spencer", avatarUrl: "https://i.pravatar.cc/150?u=sofia", phone: "11999999999" },
  { userId: "p1", firstName: "Carlos", lastName: "Mendes", avatarUrl: "https://i.pravatar.cc/150?u=carlos", phone: "11888888888" },
  { userId: "p2", firstName: "Diego", lastName: "Faria", avatarUrl: "https://i.pravatar.cc/150?u=diego", phone: "11777777777" },
  { userId: "u3", firstName: "Henrique", lastName: "Eduardo", avatarUrl: null, phone: null },
  { userId: "u_temp1", firstName: "Mariana", lastName: "Silva", avatarUrl: "https://i.pravatar.cc/150?u=mariana", phone: "11666666666" },
  { userId: "u_temp2", firstName: "Pedro", lastName: "Rocha", avatarUrl: "https://i.pravatar.cc/150?u=pedro", phone: "11555555555" },
  { userId: "u_temp3", firstName: "Lucas", lastName: "Santos", avatarUrl: "https://i.pravatar.cc/150?u=lucas", phone: "11444444444" },
];

export const addresses = [
  { id: "a1", userId: "u1", street: "Av. Paulista", number: "1000", neighborhood: "Bela Vista", city: "São Paulo", state: "SP", zipCode: "01310-100", isDefault: true },
  { id: "a2", userId: "u_temp1", street: "Rua Augusta", number: "450", neighborhood: "Consolação", city: "São Paulo", state: "SP", zipCode: "01305-000", isDefault: true },
  { id: "a3", userId: "u_temp2", street: "Av. Rebouças", number: "1800", neighborhood: "Pinheiros", city: "São Paulo", state: "SP", zipCode: "05402-000", isDefault: true },
  { id: "a4", userId: "u_temp3", street: "Rua Pamplona", number: "900", neighborhood: "Jardim Paulista", city: "São Paulo", state: "SP", zipCode: "01405-001", isDefault: true },
];

export const categories = [
  { id: "c1", name: "Manutenção", slug: "manutencao", iconUrl: "tool" },
  { id: "c2", name: "Montagem", slug: "montagem", iconUrl: "cpu" },
  { id: "c3", name: "Redes", slug: "redes", iconUrl: "wifi" },
  { id: "c4", name: "Software", slug: "software", iconUrl: "monitor" },
];

export const professionals = [
  {
    id: "p1", // backward compat
    userId: "p1",
    name: "Carlos Mendes",
    categoryId: "c1",
    bio: "Especialista em montagem de PCs Gamer de alto desempenho e manutenção preventiva.",
    yearsExperience: 8,
    rating: 4.9,
    jobsCompleted: 234
  },
  {
    id: "p2", // backward compat
    userId: "p2",
    name: "Diego Faria",
    categoryId: "c3",
    bio: "Configuração de redes domésticas e empresariais, Wi-Fi e segurança digital.",
    yearsExperience: 5,
    rating: 4.8,
    jobsCompleted: 150
  }
];

export const services = [
  { id: "s1", professionalId: "p1", categoryId: "c1", title: "Manutenção Preventiva PC", description: "Limpeza completa, troca de pasta térmica e otimização.", basePrice: 180, price: 180, estimatedDuration: "2h", duration: "2h", image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&q=80&w=800" },
  { id: "s2", professionalId: "p1", categoryId: "c2", title: "Montagem Completa PC Gamer", description: "Montagem profissional com cable management e teste de stress.", basePrice: 350, price: 350, estimatedDuration: "4h", duration: "4h", image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=800" },
  { id: "s3", professionalId: "p1", categoryId: "c1", title: "Upgrade de SSD & RAM em Notebook", description: "Instalação de SSD de alta velocidade e expansão de memória RAM.", basePrice: 250, price: 250, estimatedDuration: "1.5h", duration: "1.5h", image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&q=80&w=800" },
  { id: "s4", professionalId: "p2", categoryId: "c3", title: "Configuração de Rede Wi-Fi Mesh", description: "Instalação e otimização de roteadores Wi-Fi Mesh.", basePrice: 290, price: 290, estimatedDuration: "3h", duration: "3h", image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&q=80&w=800" },
  { id: "s5", professionalId: "p2", categoryId: "c4", title: "Otimização de S.O. & Softwares", description: "Formatação completa ou limpeza de registro.", basePrice: 150, price: 150, estimatedDuration: "2h", duration: "2h", image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&q=80&w=800" },
];

export const orders = [
  { id: "o1", clientId: "u1", professionalId: "p1", serviceId: "s1", serviceTitle: "Manutenção Preventiva PC", addressId: "a1", scheduledDate: "2024-05-20", date: "2024-05-20", scheduledTime: "14:00", time: "14:00", status: "scheduled", totalPrice: 180, price: 180 },
  { id: "o2", clientId: "u1", professionalId: "p1", serviceId: "s3", serviceTitle: "Upgrade de SSD & RAM em Notebook", addressId: "a1", scheduledDate: "2024-05-10", date: "2024-05-10", scheduledTime: "10:30", time: "10:30", status: "completed", totalPrice: 250, price: 250 },
  { id: "o3", clientId: "u1", professionalId: "p2", serviceId: "s4", serviceTitle: "Configuração de Rede Wi-Fi Mesh", addressId: "a1", scheduledDate: "2024-05-05", date: "2024-05-05", scheduledTime: "16:00", time: "16:00", status: "cancelled", totalPrice: 290, price: 290 },
  { id: "o4", clientId: "u1", professionalId: "p2", serviceId: "s5", serviceTitle: "Otimização de S.O. & Softwares", addressId: "a1", scheduledDate: "2024-05-19", date: "2024-05-19", scheduledTime: "11:00", time: "11:00", status: "in_progress", totalPrice: 150, price: 150 },
  { id: "o5", clientId: "u_temp1", professionalId: "p1", serviceId: "s3", serviceTitle: "Upgrade de SSD & RAM em Notebook", addressId: "a2", scheduledDate: "2024-05-21", date: "2024-05-21", scheduledTime: "09:00", time: "09:00", status: "pending", totalPrice: 250, price: 250 },
  { id: "o6", clientId: "u_temp2", professionalId: "p1", serviceId: "s2", serviceTitle: "Montagem Completa PC Gamer", addressId: "a3", scheduledDate: "2024-05-22", date: "2024-05-22", scheduledTime: "14:30", time: "14:30", status: "scheduled", totalPrice: 350, price: 350 },
  { id: "o7", clientId: "u_temp3", professionalId: "p1", serviceId: "s5", serviceTitle: "Otimização de S.O. & Softwares", addressId: "a4", scheduledDate: "2024-05-15", date: "2024-05-15", scheduledTime: "13:00", time: "13:00", status: "completed", totalPrice: 150, price: 150 },
];

export const payments = [
  { id: "pay1", orderId: "o1", amount: 180, paymentMethod: "pix", status: "pending" },
  { id: "pay2", orderId: "o2", amount: 250, paymentMethod: "credit_card", status: "paid" },
  { id: "pay3", orderId: "o4", amount: 150, paymentMethod: "pix", status: "paid" },
  { id: "pay4", orderId: "o7", amount: 150, paymentMethod: "pix", status: "paid" },
];

export const reviews = [
  { id: "r1", orderId: "o2", rating: 5, comment: "Excelente serviço! O PC ficou muito mais rápido." },
  { id: "r2", orderId: "o7", rating: 4, comment: "Muito bom, resolveu o problema do meu computador." },
];

export const messages = [
  { orderId: "o1", senderId: "p1", text: "Olá Sofia! Recebi seu pedido de manutenção preventiva." },
  { orderId: "o1", senderId: "u1", text: "Oi Carlos! Que bom. Você consegue vir amanhã à tarde?" },
  { orderId: "o1", senderId: "p1", text: "Consigo sim. Por volta das 14h está bom para você?" },
  { orderId: "o1", senderId: "u1", text: "Perfeito! Já deixarei tudo pronto aqui." },
  { orderId: "o1", senderId: "p1", text: "Combinado. Até amanhã!" },
];