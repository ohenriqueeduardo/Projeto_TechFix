import { Request, Response } from 'express';
import { db } from '../../src/db/index.js';
import { services, serviceTags, professionals } from '../../src/db/schema.js';
import { eq, and, like, sql } from 'drizzle-orm';
import crypto from 'crypto';

// GET /api/services
export const getServices = async (req: Request, res: Response) => {
  try {
    const { category, search, professionalId } = req.query;

    const query = db.select().from(services);

    const conditions = [];
    if (category) {
      conditions.push(eq(services.category, category as string));
    }
    if (professionalId) {
      conditions.push(eq(services.professionalId, professionalId as string));
    }
    if (search) {
      conditions.push(like(services.title, `%${search}%`));
    }

    let serviceList;
    if (conditions.length > 0) {
      serviceList = await query.where(and(...conditions));
    } else {
      serviceList = await query;
    }

    // Fetch tags for each service
    const servicesWithTags = await Promise.all(
      serviceList.map(async (service) => {
        const tags = await db
          .select({ tag: serviceTags.tag })
          .from(serviceTags)
          .where(eq(serviceTags.serviceId, service.id));
        return {
          ...service,
          tags: tags.map((t) => t.tag),
        };
      })
    );

    // Add dynamic fallback for s_teste_1real
    const hasTestService = servicesWithTags.some((s) => s.id === 's_teste_1real');
    if (!hasTestService) {
      let profId = 'p1';
      try {
        const profs = await db.select().from(professionals).limit(1);
        if (profs.length > 0) {
          profId = profs[0].userId;
        }
      } catch (e) {
        console.error('Error fetching professional for test service:', e);
      }
      
      const testService = {
        id: 's_teste_1real',
        title: 'Serviço de Teste (R$ 1,00)',
        category: 'Manutenção',
        description: 'Serviço de teste com valor simbólico de R$ 1,00 criado para testar a integração do Mercado Pago e fluxo de pagamento.',
        price: 1.00,
        duration: '10 minutos',
        rating: 5.0,
        professionalId: profId,
        badge: 'Teste',
        image: 'https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?w=800&q=80',
        createdAt: new Date(),
        tags: ['Teste', 'Pagamento'],
      };

      let matches = true;
      if (category && category !== 'Todos' && testService.category !== category) {
        matches = false;
      }
      if (professionalId && testService.professionalId !== professionalId) {
        matches = false;
      }
      if (search && !testService.title.toLowerCase().includes((search as string).toLowerCase()) && 
          !testService.description.toLowerCase().includes((search as string).toLowerCase())) {
        matches = false;
      }

      if (matches) {
        servicesWithTags.push(testService);
      }
    }

    res.json(servicesWithTags);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/services/:id
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const serviceList = await db.select().from(services).where(eq(services.id, id)).limit(1);

    if (serviceList.length === 0) {
      if (id === 's_teste_1real') {
        let profId = 'p1';
        try {
          const profs = await db.select().from(professionals).limit(1);
          if (profs.length > 0) {
            profId = profs[0].userId;
          }
        } catch (e) {
          console.error('Error fetching professional for test service:', e);
        }
        return res.json({
          id: 's_teste_1real',
          title: 'Serviço de Teste (R$ 1,00)',
          category: 'Manutenção',
          description: 'Serviço de teste com valor simbólico de R$ 1,00 criado para testar a integração do Mercado Pago e fluxo de pagamento.',
          price: 1.00,
          duration: '10 minutos',
          rating: 5.0,
          professionalId: profId,
          badge: 'Teste',
          image: 'https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?w=800&q=80',
          createdAt: new Date(),
          tags: ['Teste', 'Pagamento']
        });
      }
      return res.status(404).json({ error: 'Service not found' });
    }

    const service = serviceList[0];
    const tags = await db
      .select({ tag: serviceTags.tag })
      .from(serviceTags)
      .where(eq(serviceTags.serviceId, service.id));

    res.json({
      ...service,
      tags: tags.map((t) => t.tag),
    });
  } catch (error) {
    console.error('Error fetching service by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/services
export const createService = async (req: Request, res: Response) => {
  try {
    const { title, category, description, price, duration, professionalId, badge, image, tags } = req.body;

    if (!title || !category || !description || price === undefined || !duration || !professionalId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ error: 'Invalid price value' });
    }

    const serviceId = `s_${crypto.randomBytes(4).toString('hex')}`;

    const newService = await db.insert(services).values({
      id: serviceId,
      title,
      category,
      description,
      price: numericPrice,
      duration,
      professionalId,
      badge: badge || null,
      image: image || null,
      rating: 0,
      createdAt: new Date()
    }).returning();

    if (tags && Array.isArray(tags) && tags.length > 0) {
      const tagsToInsert = tags.map((tag: string) => ({
        serviceId,
        tag,
      }));
      await db.insert(serviceTags).values(tagsToInsert).onConflictDoNothing();
    }

    res.status(201).json({
      ...newService[0],
      tags: tags || [],
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// PUT /api/services/:id
export const updateService = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, category, description, price, duration, badge, image, tags } = req.body;

    const existingService = await db.select().from(services).where(eq(services.id, id)).limit(1);
    if (existingService.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    if (price !== undefined) {
      const numericPrice = Number(price);
      if (isNaN(numericPrice) || numericPrice < 0) {
        return res.status(400).json({ error: 'Invalid price value' });
      }
    }

    const updatedService = await db.update(services)
      .set({
        ...(title !== undefined && { title }),
        ...(category !== undefined && { category }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: Number(price) }),
        ...(duration !== undefined && { duration }),
        ...(badge !== undefined && { badge }),
        ...(image !== undefined && { image }),
      })
      .where(eq(services.id, id))
      .returning();

    if (tags && Array.isArray(tags)) {
      // Clear old tags and insert new ones
      await db.delete(serviceTags).where(eq(serviceTags.serviceId, id));
      if (tags.length > 0) {
        const tagsToInsert = tags.map((tag: string) => ({
          serviceId: id,
          tag,
        }));
        await db.insert(serviceTags).values(tagsToInsert).onConflictDoNothing();
      }
    }

    const currentTags = await db
      .select({ tag: serviceTags.tag })
      .from(serviceTags)
      .where(eq(serviceTags.serviceId, id));

    res.json({
      ...updatedService[0],
      tags: currentTags.map((t) => t.tag),
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE /api/services/:id
export const deleteService = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const existingService = await db.select().from(services).where(eq(services.id, id)).limit(1);
    if (existingService.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    await db.delete(services).where(eq(services.id, id));
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
