import { Request, Response } from 'express';
import { db } from '../../src/db/index.js';
import { messages, orders, userProfiles } from '../../src/db/schema.js';
import { eq, desc } from 'drizzle-orm';

// GET /api/messages
export const getMessages = async (req: Request, res: Response) => {
  try {
    const list = await db.select().from(messages).orderBy(desc(messages.createdAt));
    res.json(list);
  } catch (error) {
    console.error('Error fetching all messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/messages/order/:orderId
export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ error: 'Missing orderId' });
    }

    const history = await db
      .select({
        id: messages.id,
        orderId: messages.orderId,
        senderId: messages.senderId,
        text: messages.text,
        readAt: messages.readAt,
        createdAt: messages.createdAt,
        senderFirstName: userProfiles.firstName,
        senderLastName: userProfiles.lastName,
        senderAvatar: userProfiles.avatarUrl,
      })
      .from(messages)
      .leftJoin(userProfiles, eq(messages.senderId, userProfiles.userId))
      .where(eq(messages.orderId, orderId))
      .orderBy(messages.createdAt);

    res.json(history);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/messages
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { orderId, senderId, text } = req.body;

    if (!orderId || !senderId || !text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const now = new Date();

    const newMessage = await db.insert(messages).values({
      orderId,
      senderId,
      text,
      createdAt: now
    }).returning();

    res.status(201).json(newMessage[0]);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
