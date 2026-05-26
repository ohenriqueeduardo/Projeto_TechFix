import { Request, Response } from 'express';
import { db } from '../../src/db/index.js';
import { messages, users } from '../../src/db/schema.js';
import { and, or, eq, asc, desc, not } from 'drizzle-orm';

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

// GET /api/messages/:userId/:contactId
export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const { userId, contactId } = req.params;

    if (!userId || !contactId) {
      return res.status(400).json({ error: 'Missing userId or contactId' });
    }

    const history = await db
      .select()
      .from(messages)
      .where(
        or(
          and(eq(messages.senderId, userId), eq(messages.receiverId, contactId)),
          and(eq(messages.senderId, contactId), eq(messages.receiverId, userId))
        )
      )
      .orderBy(asc(messages.createdAt));

    res.json(history);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/messages/contacts/:userId
export const getContacts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Find all messages involving the user
    const userMessages = await db
      .select()
      .from(messages)
      .where(or(eq(messages.senderId, userId), eq(messages.receiverId, userId)))
      .orderBy(desc(messages.createdAt));

    // Extract unique contact IDs and their latest message
    const contactsMap = new Map<string, any>();
    for (const msg of userMessages) {
      const contactId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!contactsMap.has(contactId)) {
        contactsMap.set(contactId, msg);
      }
    }

    // Fetch details for each contact user
    const contactsList = await Promise.all(
      Array.from(contactsMap.entries()).map(async ([contactId, latestMessage]) => {
        const contactUserList = await db
          .select({
            id: users.id,
            name: users.name,
            avatar: users.avatar,
            role: users.role,
          })
          .from(users)
          .where(eq(users.id, contactId))
          .limit(1);

        const contactUser = contactUserList[0] || { id: contactId, name: 'Unknown User', avatar: null, role: 'client' };

        return {
          contact: contactUser,
          latestMessage,
        };
      })
    );

    res.json(contactsList);
  } catch (error) {
    console.error('Error fetching contacts list:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/messages
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId, text, time, date } = req.body;

    if (!senderId || !receiverId || !text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const now = new Date();
    const msgTime = time || now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
    const msgDate = date || now.toISOString().split('T')[0]; // YYYY-MM-DD

    const newMessage = await db.insert(messages).values({
      senderId,
      receiverId,
      text,
      time: msgTime,
      date: msgDate,
      createdAt: now
    }).returning();

    res.status(201).json(newMessage[0]);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
