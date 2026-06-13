import { Request, Response } from 'express';
import { db } from '../../src/db/index.js';
import { notifications } from '../../src/db/schema.js';
import { eq, desc } from 'drizzle-orm';
import crypto from 'crypto';

// GET /api/notifications/:userId
export const getUserNotifications = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const userNotifications = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
      
    res.json(userNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/notifications
export const createNotification = async (req: Request, res: Response) => {
  try {
    const { userId, title, message, type } = req.body;
    
    if (!userId || !title || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newNotification = await db.insert(notifications).values({
      id: `notif_${crypto.randomBytes(4).toString('hex')}`,
      userId,
      title,
      message,
      type: type || 'info',
      read: 0,
      createdAt: new Date()
    }).returning();

    res.status(201).json(newNotification[0]);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// PUT /api/notifications/:id/read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    
    const updated = await db.update(notifications)
      .set({ read: 1 })
      .where(eq(notifications.id, id))
      .returning();
      
    if (updated.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(updated[0]);
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE /api/notifications/:id
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    
    const deleted = await db.delete(notifications)
      .where(eq(notifications.id, id))
      .returning();
      
    if (deleted.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
