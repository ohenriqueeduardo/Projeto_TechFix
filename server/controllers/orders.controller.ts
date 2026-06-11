import { Request, Response } from 'express';
import { db } from '../../src/db/index.js';
import { orders, transactions } from '../../src/db/schema.js';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

// GET /api/orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    const { clientId, professionalId } = req.query;

    const query = db.select().from(orders);

    const conditions = [];
    if (clientId) {
      conditions.push(eq(orders.clientId, clientId as string));
    }
    if (professionalId) {
      conditions.push(eq(orders.professionalId, professionalId as string));
    }

    let list;
    if (conditions.length > 0) {
      list = await query.where(and(...conditions));
    } else {
      list = await query;
    }

    res.json(list);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const orderList = await db.select().from(orders).where(eq(orders.id, id)).limit(1);

    if (orderList.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(orderList[0]);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// POST /api/orders
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { serviceId, serviceTitle, clientId, professionalId, date, time, price, paymentMethod, address } = req.body;

    if (!serviceTitle || !clientId || !professionalId || !date || !time || price === undefined || !paymentMethod || !address) {
      const missing = [];
      if (!serviceTitle) missing.push('serviceTitle');
      if (!clientId) missing.push('clientId');
      if (!professionalId) missing.push('professionalId');
      if (!date) missing.push('date');
      if (!time) missing.push('time');
      if (price === undefined) missing.push('price');
      if (!paymentMethod) missing.push('paymentMethod');
      if (!address) missing.push('address');
      return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    }

    const orderId = `o_${crypto.randomBytes(4).toString('hex')}`;
    const code = `TF-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = await db.insert(orders).values({
      id: orderId,
      code,
      serviceId: serviceId || null,
      serviceTitle,
      clientId,
      professionalId,
      date,
      time,
      status: 'pending',
      price: Number(price),
      paymentMethod,
      address,
      createdAt: new Date()
    }).returning();

    // Create pending transaction (Escrow)
    const transactionId = `tx_${crypto.randomBytes(6).toString('hex')}`;
    await db.insert(transactions).values({
      id: transactionId,
      professionalId,
      orderId,
      type: 'income',
      title: `Pagamento Retido: ${serviceTitle}`,
      value: Number(price),
      date: date,
      status: 'pending',
      createdAt: new Date()
    });

    res.status(201).json(newOrder[0]);
  } catch (error) {
    console.error('Error creating order:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    res.status(500).json({ error: 'Internal Server Error', message });
  }
};

// PUT /api/orders/:id
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { serviceTitle, date, time, price, paymentMethod, address, status } = req.body;

    const existingOrder = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (existingOrder.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updatedOrder = await db.update(orders)
      .set({
        ...(serviceTitle !== undefined && { serviceTitle }),
        ...(date !== undefined && { date }),
        ...(time !== undefined && { time }),
        ...(price !== undefined && { price: Number(price) }),
        ...(paymentMethod !== undefined && { paymentMethod }),
        ...(address !== undefined && { address }),
        ...(status !== undefined && { status }),
      })
      .where(eq(orders.id, id))
      .returning();

    res.json(updatedOrder[0]);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// PATCH /api/orders/:id/status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    const validStatuses = ['pending', 'scheduled', 'in_progress', 'completed', 'cancelled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid or missing status' });
    }

    const existingOrder = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (existingOrder.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updatedOrder = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();

    // If order is completed, release the funds to the professional
    if (status === 'completed') {
      await db.update(transactions)
        .set({ status: 'completed' })
        .where(and(eq(transactions.orderId, id), eq(transactions.status, 'pending')));
    }

    res.json(updatedOrder[0]);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/orders/:id/confirm-payment
export const confirmPayment = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const existingOrder = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (existingOrder.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update order status to 'scheduled' since payment is confirmed
    const updatedOrder = await db.update(orders)
      .set({ status: 'scheduled' })
      .where(eq(orders.id, id))
      .returning();

    // Make sure the transaction status is 'pending' (meaning escrowed/retained)
    await db.update(transactions)
      .set({ status: 'pending' })
      .where(eq(transactions.orderId, id));

    res.json(updatedOrder[0]);
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
