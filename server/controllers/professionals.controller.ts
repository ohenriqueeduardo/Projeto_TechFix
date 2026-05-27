import { Request, Response } from 'express';
import { db } from '../../src/db/index.js';
import { professionals, users, userProfiles, categories, portfolioItems } from '../../src/db/schema.js';
import { eq, and, like } from 'drizzle-orm';

// GET /api/professionals
export const getProfessionals = async (req: Request, res: Response) => {
  try {
    const { category, city } = req.query;

    let query = db
      .select({
        userId: professionals.userId,
        name: userProfiles.firstName, // We will concat this below
        lastName: userProfiles.lastName,
        email: users.email,
        avatar: userProfiles.avatarUrl,
        role: users.role,
        category: categories.name,
        bio: professionals.bio,
        rating: professionals.rating,
        jobsCompleted: professionals.jobsCompleted,
        yearsExperience: professionals.yearsExperience,
      })
      .from(professionals)
      .innerJoin(users, eq(professionals.userId, users.id))
      .leftJoin(userProfiles, eq(professionals.userId, userProfiles.userId))
      .leftJoin(categories, eq(professionals.categoryId, categories.id));

    // Handle optional search filters
    const conditions = [];
    if (category) {
      conditions.push(like(categories.name, `%${category}%`));
    }

    if (conditions.length > 0) {
      // @ts-ignore
      query = query.where(and(...conditions));
    }

    const list = await query;
    const formattedList = list.map(item => ({
      ...item,
      name: `${item.name || ''} ${item.lastName || ''}`.trim(),
    }));

    res.json(formattedList);
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
        name: userProfiles.firstName,
        lastName: userProfiles.lastName,
        email: users.email,
        avatar: userProfiles.avatarUrl,
        role: users.role,
        category: categories.name,
        categoryId: professionals.categoryId,
        bio: professionals.bio,
        rating: professionals.rating,
        jobsCompleted: professionals.jobsCompleted,
        yearsExperience: professionals.yearsExperience,
      })
      .from(professionals)
      .innerJoin(users, eq(professionals.userId, users.id))
      .leftJoin(userProfiles, eq(professionals.userId, userProfiles.userId))
      .leftJoin(categories, eq(professionals.categoryId, categories.id))
      .where(eq(professionals.userId, id))
      .limit(1);

    if (professionalList.length === 0) {
      return res.status(404).json({ error: 'Professional not found' });
    }

    const portfolio = await db
      .select()
      .from(portfolioItems)
      .where(eq(portfolioItems.professionalId, id));

    const p = professionalList[0];
    const professional = {
      ...p,
      name: `${p.name || ''} ${p.lastName || ''}`.trim(),
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
    const { userId, categoryId, yearsExperience, bio } = req.body;

    if (!userId || !categoryId) {
      return res.status(400).json({ error: 'userId and categoryId are required' });
    }

    // Check if the user exists
    const userList = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (userList.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

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
      categoryId,
      yearsExperience: yearsExperience || 0,
      bio: bio || null,
      rating: 0,
      jobsCompleted: 0,
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
    const { categoryId, yearsExperience, bio, rating, jobsCompleted } = req.body;

    const existingProf = await db.select().from(professionals).where(eq(professionals.userId, id)).limit(1);
    if (existingProf.length === 0) {
      return res.status(404).json({ error: 'Professional profile not found' });
    }

    const updatedProf = await db.update(professionals)
      .set({
        ...(categoryId !== undefined && { categoryId }),
        ...(yearsExperience !== undefined && { yearsExperience }),
        ...(bio !== undefined && { bio }),
        ...(rating !== undefined && { rating }),
        ...(jobsCompleted !== undefined && { jobsCompleted }),
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
    const { imageUrl, title, description } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'imageUrl is required' });
    }

    const existingProf = await db.select().from(professionals).where(eq(professionals.userId, id)).limit(1);
    if (existingProf.length === 0) {
      return res.status(404).json({ error: 'Professional profile not found' });
    }

    const itemId = `pi_${crypto.randomBytes(4).toString('hex')}`;

    const newItem = await db.insert(portfolioItems).values({
      id: itemId,
      professionalId: id,
      imageUrl,
      title: title || null,
      description: description || null,
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
      .from(portfolioItems)
      .where(
        and(
          eq(portfolioItems.id, portfolioId),
          eq(portfolioItems.professionalId, id)
        )
      )
      .limit(1);

    if (existingItem.length === 0) {
      return res.status(404).json({ error: 'Portfolio item not found for this professional' });
    }

    await db.delete(portfolioItems).where(eq(portfolioItems.id, portfolioId));
    res.json({ message: 'Portfolio item deleted successfully' });
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
