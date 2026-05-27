import { Request, Response } from 'express';
import { db } from '../../src/db/index.js';
import { services, serviceTags, categories } from '../../src/db/schema.js';
import { eq, and, like } from 'drizzle-orm';
import crypto from 'crypto';

// GET /api/services
export const getServices = async (req: Request, res: Response) => {
  try {
    const { categoryId, search, professionalId } = req.query;

    let query = db.select({
      id: services.id,
      professionalId: services.professionalId,
      categoryId: services.categoryId,
      categoryName: categories.name,
      title: services.title,
      description: services.description,
      basePrice: services.basePrice,
      estimatedDuration: services.estimatedDuration,
      createdAt: services.createdAt,
    })
    .from(services)
    .leftJoin(categories, eq(services.categoryId, categories.id));

    const conditions = [];
    if (categoryId) {
      conditions.push(eq(services.categoryId, categoryId as string));
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
          price: service.basePrice,
          duration: service.estimatedDuration,
          tags: tags.map((t) => t.tag),
        };
      })
    );

    res.json(servicesWithTags);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/services/:id
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const serviceList = await db.select({
      id: services.id,
      professionalId: services.professionalId,
      categoryId: services.categoryId,
      categoryName: categories.name,
      title: services.title,
      description: services.description,
      basePrice: services.basePrice,
      estimatedDuration: services.estimatedDuration,
      createdAt: services.createdAt,
    })
    .from(services)
    .leftJoin(categories, eq(services.categoryId, categories.id))
    .where(eq(services.id, id)).limit(1);

    if (serviceList.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const service = serviceList[0];
    const tags = await db
      .select({ tag: serviceTags.tag })
      .from(serviceTags)
      .where(eq(serviceTags.serviceId, service.id));

    res.json({
      ...service,
      price: service.basePrice,
      duration: service.estimatedDuration,
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
    const { title, categoryId, description, basePrice, estimatedDuration, professionalId, tags } = req.body;

    if (!title || !categoryId || !description || basePrice === undefined || !estimatedDuration || !professionalId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const serviceId = `s_${crypto.randomBytes(4).toString('hex')}`;

    const newService = await db.insert(services).values({
      id: serviceId,
      title,
      categoryId,
      description,
      basePrice: Number(basePrice),
      estimatedDuration,
      professionalId,
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
    const { id } = req.params;
    const { title, categoryId, description, basePrice, estimatedDuration, tags } = req.body;

    const existingService = await db.select().from(services).where(eq(services.id, id)).limit(1);
    if (existingService.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const updatedService = await db.update(services)
      .set({
        ...(title !== undefined && { title }),
        ...(categoryId !== undefined && { categoryId }),
        ...(description !== undefined && { description }),
        ...(basePrice !== undefined && { basePrice: Number(basePrice) }),
        ...(estimatedDuration !== undefined && { estimatedDuration }),
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
    const { id } = req.params;

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
