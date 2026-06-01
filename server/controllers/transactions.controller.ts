import { Request, Response } from 'express';
import { db } from '../../src/db/index.js';
import { transactions } from '../../src/db/schema.js';
import { eq, desc } from 'drizzle-orm';
import crypto from 'crypto';

// GET /api/transactions
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const list = await db.select().from(transactions).orderBy(desc(transactions.createdAt));
    res.json(list);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/transactions/:professionalId
export const getTransactionsForProfessional = async (req: Request, res: Response) => {
  try {
    const professionalId = req.params.professionalId as string;

    if (!professionalId) {
      return res.status(400).json({ error: 'professionalId is required' });
    }

    const list = await db
      .select()
      .from(transactions)
      .where(eq(transactions.professionalId, professionalId))
      .orderBy(desc(transactions.createdAt));

    res.json(list);
  } catch (error) {
    console.error('Error fetching transactions for professional:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/transactions
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { professionalId, type, title, value, date, status } = req.body;

    if (!professionalId || !type || !title || value === undefined || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Invalid transaction type. Must be income or expense' });
    }

    if (!['completed', 'pending', 'failed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Must be completed, pending, or failed' });
    }

    const transactionId = `t_${crypto.randomBytes(4).toString('hex')}`;
    const txDate = date || new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    const newTransaction = await db.insert(transactions).values({
      id: transactionId,
      professionalId,
      type,
      title,
      value: Number(value),
      date: txDate,
      status,
      createdAt: new Date()
    }).returning();

    res.status(201).json(newTransaction[0]);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
