import { Request, Response } from 'express';
import { db } from '../../src/db/index.js';
import { reviews, reviewTags, professionals, services, users } from '../../src/db/schema.js';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

// GET /api/reviews
export const getReviews = async (req: Request, res: Response) => {
  try {
    const { professionalId, serviceId } = req.query;

    let query = db
      .select({
        id: reviews.id,
        serviceId: reviews.serviceId,
        professionalId: reviews.professionalId,
        clientId: reviews.clientId,
        clientName: users.name,
        clientAvatar: users.avatar,
        rating: reviews.rating,
        comment: reviews.comment,
        date: reviews.date,
        createdAt: reviews.createdAt
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.clientId, users.id));

    const conditions = [];
    if (professionalId) {
      conditions.push(eq(reviews.professionalId, professionalId as string));
    }
    if (serviceId) {
      conditions.push(eq(reviews.serviceId, serviceId as string));
    }

    let list;
    if (conditions.length > 0) {
      list = await query.where(and(...conditions));
    } else {
      list = await query;
    }

    const reviewsWithTags = await Promise.all(
      list.map(async (review) => {
        const tags = await db
          .select({ tag: reviewTags.tag })
          .from(reviewTags)
          .where(eq(reviewTags.reviewId, review.id));
        return {
          ...review,
          tags: tags.map((t) => t.tag)
        };
      })
    );

    res.json(reviewsWithTags);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/reviews/:id
export const getReviewById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const list = await db
      .select({
        id: reviews.id,
        serviceId: reviews.serviceId,
        professionalId: reviews.professionalId,
        clientId: reviews.clientId,
        clientName: users.name,
        clientAvatar: users.avatar,
        rating: reviews.rating,
        comment: reviews.comment,
        date: reviews.date,
        createdAt: reviews.createdAt
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.clientId, users.id))
      .where(eq(reviews.id, id))
      .limit(1);

    if (list.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const tags = await db
      .select({ tag: reviewTags.tag })
      .from(reviewTags)
      .where(eq(reviewTags.reviewId, id));

    res.json({
      ...list[0],
      tags: tags.map((t) => t.tag)
    });
  } catch (error) {
    console.error('Error fetching review by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/reviews/service/:serviceId
export const getReviewsForService = async (req: Request, res: Response) => {
  try {
    const { serviceId } = req.params;

    const list = await db
      .select({
        id: reviews.id,
        serviceId: reviews.serviceId,
        professionalId: reviews.professionalId,
        clientId: reviews.clientId,
        clientName: users.name,
        clientAvatar: users.avatar,
        rating: reviews.rating,
        comment: reviews.comment,
        date: reviews.date,
        createdAt: reviews.createdAt
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.clientId, users.id))
      .where(eq(reviews.serviceId, serviceId));

    const reviewsWithTags = await Promise.all(
      list.map(async (review) => {
        const tags = await db
          .select({ tag: reviewTags.tag })
          .from(reviewTags)
          .where(eq(reviewTags.reviewId, review.id));
        return {
          ...review,
          tags: tags.map((t) => t.tag)
        };
      })
    );

    res.json(reviewsWithTags);
  } catch (error) {
    console.error('Error fetching reviews for service:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/reviews/professional/:professionalId
export const getReviewsForProfessional = async (req: Request, res: Response) => {
  try {
    const { professionalId } = req.params;

    const list = await db
      .select({
        id: reviews.id,
        serviceId: reviews.serviceId,
        professionalId: reviews.professionalId,
        clientId: reviews.clientId,
        clientName: users.name,
        clientAvatar: users.avatar,
        rating: reviews.rating,
        comment: reviews.comment,
        date: reviews.date,
        createdAt: reviews.createdAt
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.clientId, users.id))
      .where(eq(reviews.professionalId, professionalId));

    const reviewsWithTags = await Promise.all(
      list.map(async (review) => {
        const tags = await db
          .select({ tag: reviewTags.tag })
          .from(reviewTags)
          .where(eq(reviewTags.reviewId, review.id));
        return {
          ...review,
          tags: tags.map((t) => t.tag)
        };
      })
    );

    res.json(reviewsWithTags);
  } catch (error) {
    console.error('Error fetching reviews for professional:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/reviews
export const createReview = async (req: Request, res: Response) => {
  try {
    const { serviceId, professionalId, clientId, rating, comment, date, tags } = req.body;

    if (!serviceId || !professionalId || !clientId || rating === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const reviewId = `r_${crypto.randomBytes(4).toString('hex')}`;
    const reviewDate = date || new Date().toISOString().split('T')[0];

    const newReview = await db.insert(reviews).values({
      id: reviewId,
      serviceId,
      professionalId,
      clientId,
      rating: Number(rating),
      comment: comment || null,
      date: reviewDate,
      createdAt: new Date()
    }).returning();

    if (tags && Array.isArray(tags) && tags.length > 0) {
      const tagsToInsert = tags.map((tag: string) => ({
        reviewId,
        tag
      }));
      await db.insert(reviewTags).values(tagsToInsert).onConflictDoNothing();
    }

    // Recalculate average rating for professional
    const profReviews = await db
      .select({ rating: reviews.rating })
      .from(reviews)
      .where(eq(reviews.professionalId, professionalId));
    
    if (profReviews.length > 0) {
      const averageRating = profReviews.reduce((sum, r) => sum + r.rating, 0) / profReviews.length;
      await db.update(professionals)
        .set({
          rating: averageRating,
          reviewCount: profReviews.length,
          satisfaction: Math.round((profReviews.filter(r => r.rating >= 4).length / profReviews.length) * 100)
        })
        .where(eq(professionals.userId, professionalId));
    }

    // Recalculate average rating for service
    const serviceReviews = await db
      .select({ rating: reviews.rating })
      .from(reviews)
      .where(eq(reviews.serviceId, serviceId));
    
    if (serviceReviews.length > 0) {
      const averageServiceRating = serviceReviews.reduce((sum, r) => sum + r.rating, 0) / serviceReviews.length;
      await db.update(services)
        .set({ rating: averageServiceRating })
        .where(eq(services.id, serviceId));
    }

    res.status(201).json({
      ...newReview[0],
      tags: tags || []
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE /api/reviews/:id
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingReview = await db.select().from(reviews).where(eq(reviews.id, id)).limit(1);
    if (existingReview.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await db.delete(reviews).where(eq(reviews.id, id));
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
