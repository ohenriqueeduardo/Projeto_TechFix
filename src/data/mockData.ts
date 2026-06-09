import { User, Professional, Service, Order, Transaction, Review } from "@/types/index";



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
