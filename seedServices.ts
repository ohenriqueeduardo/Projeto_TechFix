import { db } from './src/db/index';
import { services, serviceTags, professionals } from './src/db/schema';
import * as dotenv from 'dotenv';
dotenv.config();

async function seed() {
  console.log('Fetching professionals...');
  const profs = await db.select().from(professionals).limit(1);
  if (profs.length === 0) {
    console.log('No professionals found. Please register at least one professional before seeding.');
    process.exit(1);
  }
  const profId = profs[0].userId;

  const mockServices = [
    {
      id: 's_montagem_pc',
      title: 'Montagem de PC Gamer Premium',
      category: 'Hardware',
      description: 'Montagem profissional de setup gamer de alto desempenho. Inclui cable management invisível, aplicação de pasta térmica de prata (Arctic Silver 5) e testes de estresse em GPU/CPU para garantir a estabilidade do sistema.',
      price: 249.99,
      duration: '3-4 horas',
      rating: 5.0,
      professionalId: profId,
      badge: 'Mais Vendido',
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
      tags: ['Gamer', 'Hardware', 'Cable Management']
    },
    {
      id: 's_formatacao_pro',
      title: 'Formatação e Instalação de SO',
      category: 'Software',
      description: 'Instalação limpa do Windows 11/10 ou Linux (Ubuntu/Mint). Inclui backup de até 100GB, instalação de drivers atualizados e pacote básico de softwares (Office, Navegadores, Antivírus). Sistema entregue otimizado para máxima performance.',
      price: 120.00,
      duration: '2 horas',
      rating: 4.8,
      professionalId: profId,
      badge: 'Destaque',
      image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80',
      tags: ['Windows', 'Linux', 'Backup']
    },
    {
      id: 's_rede_mesh',
      title: 'Configuração de Rede Wi-Fi Mesh',
      category: 'Redes',
      description: 'Elimine os pontos cegos de internet na sua casa ou escritório. Configuração completa de roteadores Mesh, análise de canais para evitar interferências e configuração de rede para visitantes. Inclui consultoria de posicionamento.',
      price: 180.00,
      duration: '1.5 horas',
      rating: 4.9,
      professionalId: profId,
      badge: 'Recomendado',
      image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&q=80',
      tags: ['Wi-Fi', 'Mesh', 'Redes']
    },
    {
      id: 's_limpeza_macbook',
      title: 'Limpeza Preventiva MacBook',
      category: 'Manutenção',
      description: 'Desmontagem técnica de MacBooks para limpeza interna completa. Remoção de poeira das ventoinhas e dissipadores, troca de pasta térmica e limpeza de contatos. Essencial para evitar superaquecimento e perda de performance.',
      price: 299.90,
      duration: '2-3 horas',
      rating: 5.0,
      professionalId: profId,
      badge: 'Premium',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
      tags: ['Apple', 'Limpeza Interna', 'Prevenção']
    },
    {
      id: 's_recuperacao_dados',
      title: 'Recuperação de Dados Avançada',
      category: 'Software',
      description: 'Análise profunda e recuperação de arquivos deletados acidentalmente ou de HDs/SSDs corrompidos. Utilizamos softwares forenses de alta eficácia. Pagamento apenas em caso de sucesso na recuperação dos dados críticos.',
      price: 450.00,
      duration: '24-48 horas',
      rating: 4.7,
      professionalId: profId,
      badge: '',
      image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
      tags: ['Dados', 'Forense', 'HD/SSD']
    },
    {
      id: 's_upgrade_ssd',
      title: 'Upgrade para SSD NVMe',
      category: 'Hardware',
      description: 'Deixe seu notebook ou desktop até 10x mais rápido. Instalação física de SSD NVMe ou SATA, clonagem exata do sistema atual (sem perda de arquivos ou programas instalados) e otimização da BIOS para fast-boot.',
      price: 150.00,
      duration: '1 hora',
      rating: 4.9,
      professionalId: profId,
      badge: 'Mais Vendido',
      image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80',
      tags: ['Upgrade', 'SSD', 'Performance']
    }
  ];

  console.log('Limpiando serviços existentes...');
  await db.delete(serviceTags);
  await db.delete(services);

  console.log('Inserindo novos serviços...');
  for (const svc of mockServices) {
    const { tags, ...serviceData } = svc;
    
    await db.insert(services).values(serviceData);
    
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        await db.insert(serviceTags).values({
          serviceId: serviceData.id,
          tag: tag
        });
      }
    }
  }

  console.log('Seed de serviços concluído com sucesso! 6 serviços foram inseridos.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Erro ao fazer seed:', err);
  process.exit(1);
});
