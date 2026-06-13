import { Request, Response } from 'express';
import { db } from '../../src/db/index.js';
import { orders, transactions } from '../../src/db/schema.js';
import { eq, and, lt } from 'drizzle-orm';
import crypto from 'crypto';
import { MercadoPagoConfig, PaymentRefund } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

const rawToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN || '';
const validToken = rawToken.trim();
const accessToken = validToken || 'APP_USR-4714972698787037-061309-ce60a56d73f55aff5375981823d0b434-1730247701';

const mpClient = new MercadoPagoConfig({
  accessToken: accessToken,
});

// Helper to clean up expired provisional orders
const cleanupExpiredProvisionalOrders = async () => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const expiredOrders = await db.select({ id: orders.id })
      .from(orders)
      .where(and(eq(orders.status, 'provisional'), lt(orders.createdAt, twentyFourHoursAgo)));

    if (expiredOrders.length > 0) {
      const orderIds = expiredOrders.map(o => o.id);
      for (const oId of orderIds) {
        await db.delete(transactions).where(eq(transactions.orderId, oId));
        await db.delete(orders).where(eq(orders.id, oId));
      }
      console.log(`Cleaned up ${orderIds.length} expired provisional orders.`);
    }
  } catch (err) {
    console.error('Error cleaning up expired orders:', err);
  }
};

// GET /api/orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    await cleanupExpiredProvisionalOrders();
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
    await cleanupExpiredProvisionalOrders();
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

    if (!serviceTitle || !clientId || !date || !time || price === undefined || !paymentMethod || !address) {
      const missing = [];
      if (!serviceTitle) missing.push('serviceTitle');
      if (!clientId) missing.push('clientId');
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
      status: 'provisional',
      price: Number(price),
      paymentMethod,
      paymentId: req.body.paymentId || null,
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
        ...(req.body.paymentId !== undefined && { paymentId: req.body.paymentId }),
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

    // Handle Refunds for cancelled orders
    if (status === 'cancelled') {
      const order = existingOrder[0];
      // Only attempt refund if there's a paymentId and payment method is online
      if (order.paymentId && ['pix', 'credit', 'debit'].includes(order.paymentMethod)) {
        try {
          console.log(`[Mercado Pago] Attempting refund for paymentId: ${order.paymentId} (Order: ${order.code})`);
          const refund = new PaymentRefund(mpClient);
          await refund.create({ payment_id: Number(order.paymentId) });
          console.log(`[Mercado Pago] Refund successful for order ${order.code}`);
        } catch (mpError: unknown) {
          const err = mpError as Error;
          console.error(`[Mercado Pago] Refund failed for order ${order.code}:`, err.message || err);
          // Note: We log the error but still allow the cancellation to go through.
        }
      }
      
      // Update pending transaction to failed if cancelled
      await db.update(transactions)
        .set({ status: 'failed' })
        .where(and(eq(transactions.orderId, id), eq(transactions.status, 'pending')));
    }

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
