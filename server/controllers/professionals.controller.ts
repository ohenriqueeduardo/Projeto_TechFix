import { Request, Response } from 'express';
import { db } from '../../src/db/index.js';
import { professionals, users, professionalPortfolioItems } from '../../src/db/schema.js';
import { eq, and, like } from 'drizzle-orm';

// GET /api/professionals
export const getProfessionals = async (req: Request, res: Response) => {
  try {
    const { specialty, city } = req.query;

    let query = db
      .select({
        userId: professionals.userId,
        name: users.name,
        email: users.email,
        avatar: users.avatar,
        role: users.role,
        specialty: professionals.specialty,
        city: professionals.city,
        rating: professionals.rating,
        reviewCount: professionals.reviewCount,
        jobs: professionals.jobs,
        yearsExperience: professionals.yearsExperience,
        satisfaction: professionals.satisfaction,
        bio: professionals.bio,
      })
      .from(professionals)
      .innerJoin(users, eq(professionals.userId, users.id));

    // Handle optional search filters
    const conditions = [];
    if (specialty) {
      conditions.push(like(professionals.specialty, `%${specialty}%`));
    }
    if (city) {
      conditions.push(like(professionals.city, `%${city}%`));
    }

    if (conditions.length > 0) {
      // @ts-ignore
      query = query.where(and(...conditions));
    }

    const list = await query;
    res.json(list);
  } catch (error) {
    console.error('Error fetching professionals:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/professionals/:id
export const getProfessionalById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const professionalList = await db
      .select({
        userId: professionals.userId,
        name: users.name,
        email: users.email,
        avatar: users.avatar,
        role: users.role,
        specialty: professionals.specialty,
        city: professionals.city,
        rating: professionals.rating,
        reviewCount: professionals.reviewCount,
        jobs: professionals.jobs,
        yearsExperience: professionals.yearsExperience,
        satisfaction: professionals.satisfaction,
        bio: professionals.bio,
      })
      .from(professionals)
      .innerJoin(users, eq(professionals.userId, users.id))
      .where(eq(professionals.userId, id))
      .limit(1);

    if (professionalList.length === 0) {
      return res.status(404).json({ error: 'Professional not found' });
    }

    const portfolio = await db
      .select()
      .from(professionalPortfolioItems)
      .where(eq(professionalPortfolioItems.professionalId, id));

    const professional = {
      ...professionalList[0],
      portfolio,
    };

    res.json(professional);
  } catch (error) {
    console.error('Error fetching professional by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/professionals
export const registerProfessional = async (req: Request, res: Response) => {
  try {
    const { userId, specialty, city, yearsExperience, bio } = req.body;

    if (!userId || !specialty || !city) {
      return res.status(400).json({ error: 'userId, specialty, and city are required' });
    }

    // Check if the user exists
    const userList = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (userList.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userList[0];

    // Check if already a professional
    const existingProf = await db.select().from(professionals).where(eq(professionals.userId, userId)).limit(1);
    if (existingProf.length > 0) {
      return res.status(400).json({ error: 'User is already registered as a professional' });
    }

    // Update user role to professional
    await db.update(users).set({ role: 'professional' }).where(eq(users.id, userId));

    // Create professional profile
    const newProf = await db.insert(professionals).values({
      userId,
      specialty,
      city,
      yearsExperience: yearsExperience || 0,
      bio: bio || null,
      rating: 0,
      reviewCount: 0,
      jobs: 0,
      satisfaction: 100,
    }).returning();

    res.status(201).json(newProf[0]);
  } catch (error) {
    console.error('Error registering professional:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// PUT /api/professionals/:id
export const updateProfessional = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { specialty, city, yearsExperience, bio, rating, reviewCount, jobs, satisfaction } = req.body;

    const existingProf = await db.select().from(professionals).where(eq(professionals.userId, id)).limit(1);
    if (existingProf.length === 0) {
      return res.status(404).json({ error: 'Professional profile not found' });
    }

    const updatedProf = await db.update(professionals)
      .set({
        ...(specialty !== undefined && { specialty }),
        ...(city !== undefined && { city }),
        ...(yearsExperience !== undefined && { yearsExperience }),
        ...(bio !== undefined && { bio }),
        ...(rating !== undefined && { rating }),
        ...(reviewCount !== undefined && { reviewCount }),
        ...(jobs !== undefined && { jobs }),
        ...(satisfaction !== undefined && { satisfaction }),
      })
      .where(eq(professionals.userId, id))
      .returning();

    res.json(updatedProf[0]);
  } catch (error) {
    console.error('Error updating professional:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE /api/professionals/:id
export const deleteProfessional = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingProf = await db.select().from(professionals).where(eq(professionals.userId, id)).limit(1);
    if (existingProf.length === 0) {
      return res.status(404).json({ error: 'Professional profile not found' });
    }

    // Remove from professional table (cascade will remove portfolio items if defined, but not user)
    await db.delete(professionals).where(eq(professionals.userId, id));
    
    // Downgrade user's role back to client
    await db.update(users).set({ role: 'client' }).where(eq(users.id, id));

    res.json({ message: 'Professional profile removed and user role reverted to client' });
  } catch (error) {
    console.error('Error deleting professional:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/professionals/:id/portfolio
export const addPortfolioItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'imageUrl is required' });
    }

    const existingProf = await db.select().from(professionals).where(eq(professionals.userId, id)).limit(1);
    if (existingProf.length === 0) {
      return res.status(404).json({ error: 'Professional profile not found' });
    }

    const newItem = await db.insert(professionalPortfolioItems).values({
      professionalId: id,
      imageUrl,
    }).returning();

    res.status(201).json(newItem[0]);
  } catch (error) {
    console.error('Error adding portfolio item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE /api/professionals/:id/portfolio/:portfolioId
export const deletePortfolioItem = async (req: Request, res: Response) => {
  try {
    const { id, portfolioId } = req.params;

    const existingItem = await db
      .select()
      .from(professionalPortfolioItems)
      .where(
        and(
          eq(professionalPortfolioItems.id, parseInt(portfolioId)),
          eq(professionalPortfolioItems.professionalId, id)
        )
      )
      .limit(1);

    if (existingItem.length === 0) {
      return res.status(404).json({ error: 'Portfolio item not found for this professional' });
    }

    await db.delete(professionalPortfolioItems).where(eq(professionalPortfolioItems.id, parseInt(portfolioId)));
    res.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
