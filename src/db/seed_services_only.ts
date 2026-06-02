import { db } from './index.js';
import { services, serviceTags } from './schema.js';

async function main() {
  console.log("Seeding generic services to PostgreSQL...");

  // Insert services
  await db.insert(services).values([
    {
      id: 's1',
      title: 'Manutenção Preventiva PC',
      category: 'Manutenção',
      description: 'Limpeza completa, troca de pasta térmica e otimização de software.',
      price: 180.00,
      duration: '2h',
      rating: 4.90,
      professionalId: null, // Generic
      badge: 'Mais Vendido',
      image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&auto=format&fit=crop',
      createdAt: new Date()
    },
    {
      id: 's2',
      title: 'Montagem Completa PC Gamer',
      category: 'Montagem',
      description: 'Montagem profissional com cable management e teste de stress.',
      price: 350.00,
      duration: '4h',
      rating: 5.00,
      professionalId: null, // Generic
      badge: null,
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop',
      createdAt: new Date()
    },
    {
      id: 's3',
      title: 'Upgrade de SSD & RAM em Notebook',
      category: 'Manutenção',
      description: 'Instalação de SSD de alta velocidade e expansão de memória RAM para ganho instantâneo de desempenho.',
      price: 250.00,
      duration: '1h30',
      rating: 4.80,
      professionalId: null, // Generic
      badge: 'Recomendado',
      image: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&auto=format&fit=crop',
      createdAt: new Date()
    },
    {
      id: 's4',
      title: 'Configuração de Rede Wi-Fi Mesh',
      category: 'Redes',
      description: 'Instalação e otimização de roteadores Wi-Fi Mesh para cobertura total de sinal sem pontos cegos.',
      price: 290.00,
      duration: '3h',
      rating: 4.90,
      professionalId: null, // Generic
      badge: null,
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop',
      createdAt: new Date()
    },
    {
      id: 's5',
      title: 'Otimização de S.O. & Softwares',
      category: 'Software',
      description: 'Formatação completa ou limpeza de registro, remoção de lixo digital e reinstalação de sistema operacional.',
      price: 150.00,
      duration: '2h',
      rating: 4.70,
      professionalId: null, // Generic
      badge: null,
      image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&auto=format&fit=crop',
      createdAt: new Date()
    },
    {
      id: 's6',
      title: 'Manutenção Gamer & Refrigeração',
      category: 'Manutenção',
      description: 'Troca de elastômeros, pasta térmica de alta performance e alinhamento de fans para menor ruído e temperatura.',
      price: 200.00,
      duration: '2h',
      rating: 5.00,
      professionalId: null, // Generic
      badge: 'Destaque',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop',
      createdAt: new Date()
    },
    {
      id: 's7',
      title: 'Configuração de Impressora & Servidor',
      category: 'Redes',
      description: 'Instalação física e lógica de impressoras multifuncionais compartilhadas na rede local.',
      price: 120.00,
      duration: '1h',
      rating: 4.60,
      professionalId: null, // Generic
      badge: null,
      image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&auto=format&fit=crop',
      createdAt: new Date()
    },
    {
      id: 's8',
      title: 'Remoção de Malware & Varredura',
      category: 'Software',
      description: 'Escaneamento profundo, remoção de vírus, trojans, adwares e instalação de proteção antivírus permanente.',
      price: 160.00,
      duration: '1h30',
      rating: 4.90,
      professionalId: null, // Generic
      badge: 'Segurança',
      image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop',
      createdAt: new Date()
    }
  ]).onConflictDoNothing();

  // Insert tags
  await db.insert(serviceTags).values([
    { serviceId: 's1', tag: 'Limpeza' },
    { serviceId: 's1', tag: 'Hardware' },
    { serviceId: 's1', tag: 'Otimização' },
    { serviceId: 's2', tag: 'Gamer' },
    { serviceId: 's2', tag: 'Hardware' },
    { serviceId: 's2', tag: 'Performance' },
    { serviceId: 's3', tag: 'Upgrade' },
    { serviceId: 's3', tag: 'Notebook' },
    { serviceId: 's3', tag: 'Velocidade' },
    { serviceId: 's4', tag: 'Wi-Fi' },
    { serviceId: 's4', tag: 'Mesh' },
    { serviceId: 's4', tag: 'Internet' },
    { serviceId: 's5', tag: 'Windows' },
    { serviceId: 's5', tag: 'Otimização' },
    { serviceId: 's5', tag: 'Software' },
    { serviceId: 's6', tag: 'Watercooler' },
    { serviceId: 's6', tag: 'Repasta' },
    { serviceId: 's6', tag: 'Gamer' },
    { serviceId: 's7', tag: 'Impressora' },
    { serviceId: 's7', tag: 'Rede' },
    { serviceId: 's7', tag: 'Escritório' },
    { serviceId: 's8', tag: 'Antivírus' },
    { serviceId: 's8', tag: 'Segurança' },
    { serviceId: 's8', tag: 'Malware' },
  ]).onConflictDoNothing();

  console.log("Generic services seeded successfully!");
  process.exit(0);
}

main().catch(err => {
  console.error("Failed to seed services:", err);
  process.exit(1);
});
