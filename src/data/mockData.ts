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
  },
  {
    id: "s3",
    title: "Upgrade de SSD & RAM em Notebook",
    category: "Manutenção",
    description: "Instalação de SSD de alta velocidade e expansão de memória RAM para ganho instantâneo de desempenho.",
    price: 250,
    duration: "1h30",
    rating: 4.8,
    professionalId: "p1",
    badge: "Recomendado",
    tags: ["Upgrade", "Notebook", "Velocidade"],
    image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&auto=format&fit=crop"
  },
  {
    id: "s4",
    title: "Configuração de Rede Wi-Fi Mesh",
    category: "Redes",
    description: "Instalação e otimização de roteadores Wi-Fi Mesh para cobertura total de sinal sem pontos cegos.",
    price: 290,
    duration: "3h",
    rating: 4.9,
    professionalId: "p2",
    tags: ["Wi-Fi", "Mesh", "Internet"],
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop"
  },
  {
    id: "s5",
    title: "Otimização de S.O. & Softwares",
    category: "Software",
    description: "Formatação completa ou limpeza de registro, remoção de lixo digital e reinstalação de sistema operacional.",
    price: 150,
    duration: "2h",
    rating: 4.7,
    professionalId: "p2",
    tags: ["Windows", "Otimização", "Software"],
    image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&auto=format&fit=crop"
  },
  {
    id: "s6",
    title: "Manutenção Gamer & Refrigeração",
    category: "Manutenção",
    description: "Troca de elastômeros, pasta térmica de alta performance e alinhamento de fans para menor ruído e temperatura.",
    price: 200,
    duration: "2h",
    rating: 5.0,
    professionalId: "p1",
    badge: "Destaque",
    tags: ["Watercooler", "Repasta", "Gamer"],
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop"
  },
  {
    id: "s7",
    title: "Configuração de Impressora & Servidor",
    category: "Redes",
    description: "Instalação física e lógica de impressoras multifuncionais compartilhadas na rede local.",
    price: 120,
    duration: "1h",
    rating: 4.6,
    professionalId: "p2",
    tags: ["Impressora", "Rede", "Escritório"],
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&auto=format&fit=crop"
  },
  {
    id: "s8",
    title: "Remoção de Malware & Varredura",
    category: "Software",
    description: "Escaneamento profundo, remoção de vírus, trojans, adwares e instalação de proteção antivírus permanente.",
    price: 160,
    duration: "1h30",
    rating: 4.9,
    professionalId: "p2",
    badge: "Segurança",
    tags: ["Antivírus", "Segurança", "Malware"],
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop"
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
  },
  {
    id: "o2",
    code: "TF-2024-00711",
    serviceId: "s3",
    serviceTitle: "Upgrade de SSD & RAM em Notebook",
    clientName: "Sofia Spencer",
    clientId: "u1",
    professionalId: "p1",
    professionalName: "Carlos Mendes",
    date: "2024-05-10",
    time: "10:30",
    status: "completed",
    price: 250,
    paymentMethod: "credit",
    address: "Av. Paulista, 1000 - São Paulo, SP"
  },
  {
    id: "o3",
    code: "TF-2024-00609",
    serviceId: "s4",
    serviceTitle: "Configuração de Rede Wi-Fi Mesh",
    clientName: "Sofia Spencer",
    clientId: "u1",
    professionalId: "p2",
    professionalName: "Diego Faria",
    date: "2024-05-05",
    time: "16:00",
    status: "cancelled",
    price: 290,
    paymentMethod: "debit",
    address: "Av. Paulista, 1000 - São Paulo, SP"
  },
  {
    id: "o4",
    code: "TF-2024-00890",
    serviceId: "s5",
    serviceTitle: "Otimização de S.O. & Softwares",
    clientName: "Sofia Spencer",
    clientId: "u1",
    professionalId: "p2",
    professionalName: "Diego Faria",
    date: "2024-05-19",
    time: "11:00",
    status: "in_progress",
    price: 150,
    paymentMethod: "pix",
    address: "Av. Paulista, 1000 - São Paulo, SP"
  },
  {
    id: "o5",
    code: "TF-2024-00912",
    serviceId: "s3",
    serviceTitle: "Upgrade de SSD & RAM em Notebook",
    clientName: "Mariana Silva",
    clientId: "u_temp1",
    professionalId: "p1",
    professionalName: "Carlos Mendes",
    date: "2024-05-21",
    time: "09:00",
    status: "pending",
    price: 250,
    paymentMethod: "pix",
    address: "Rua Augusta, 450 - Consolação, São Paulo - SP"
  },
  {
    id: "o6",
    code: "TF-2024-00923",
    serviceId: "s2",
    serviceTitle: "Montagem Completa PC Gamer",
    clientName: "Pedro Rocha",
    clientId: "u_temp2",
    professionalId: "p1",
    professionalName: "Carlos Mendes",
    date: "2024-05-22",
    time: "14:30",
    status: "scheduled",
    price: 350,
    paymentMethod: "credit",
    address: "Av. Rebouças, 1800 - Pinheiros, São Paulo - SP"
  },
  {
    id: "o7",
    code: "TF-2024-00810",
    serviceId: "s5",
    serviceTitle: "Otimização de S.O. & Softwares",
    clientName: "Lucas Santos",
    clientId: "u_temp3",
    professionalId: "p1",
    professionalName: "Carlos Mendes",
    date: "2024-05-15",
    time: "13:00",
    status: "completed",
    price: 150,
    paymentMethod: "pix",
    address: "Rua Pamplona, 900 - Jardim Paulista, São Paulo - SP"
  }
];

export const transactions: Transaction[] = [
  { id: "t1", type: "income", title: "Serviço: Upgrade Notebook (Mariana S.)", value: 250, date: "2024-05-21", status: "completed" },
  { id: "t2", type: "income", title: "Serviço: Manutenção PC (Sofia S.)", value: 180, date: "2024-05-20", status: "completed" },
  { id: "t3", type: "income", title: "Serviço: Otimização S.O. (Lucas S.)", value: 150, date: "2024-05-15", status: "completed" },
  { id: "t4", type: "expense", title: "Saque via PIX para Conta Corrente", value: 300, date: "2024-05-17", status: "completed" },
  { id: "t5", type: "expense", title: "Saque via PIX para Conta Corrente", value: 200, date: "2024-05-12", status: "completed" }
];