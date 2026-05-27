import { Request, Response } from 'express';
import { db } from '../../src/db/index.js';
import { payments, orders } from '../../src/db/schema.js';
import { eq, desc } from 'drizzle-orm';
import crypto from 'crypto';

// GET /api/transactions
export const getTransactions = async (req: Request, res: Response) => {
  try {
    const list = await db.select().from(payments).orderBy(desc(payments.createdAt));
    res.json(list);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/transactions/:professionalId
export const getTransactionsForProfessional = async (req: Request, res: Response) => {
  try {
    const { professionalId } = req.params;

    if (!professionalId) {
      return res.status(400).json({ error: 'professionalId is required' });
    }

    const list = await db
      .select({
        id: payments.id,
        orderId: payments.orderId,
        amount: payments.amount,
        paymentMethod: payments.paymentMethod,
        status: payments.status,
        createdAt: payments.createdAt,
        title: orders.id, // For backward compat
      })
      .from(payments)
      .innerJoin(orders, eq(payments.orderId, orders.id))
      .where(eq(orders.professionalId, professionalId))
      .orderBy(desc(payments.createdAt));

    const formattedList = list.map(item => ({
      ...item,
      type: 'income',
      value: item.amount,
      date: item.createdAt.toISOString().split('T')[0],
      title: `Pagamento do Pedido ${item.orderId}`
    }));

    res.json(formattedList);
  } catch (error) {
    console.error('Error fetching transactions for professional:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/transactions
export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { orderId, amount, paymentMethod, status } = req.body;

    if (!orderId || amount === undefined || !status) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const paymentId = `pay_${crypto.randomBytes(4).toString('hex')}`;

    const newPayment = await db.insert(payments).values({
      id: paymentId,
      orderId,
      amount: Number(amount),
      paymentMethod: paymentMethod || 'pix',
      status,
      createdAt: new Date()
    }).returning();

    res.status(201).json(newPayment[0]);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
