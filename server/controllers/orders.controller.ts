import { Request, Response } from 'express';
import { db } from '../../src/db/index.js';
import { orders } from '../../src/db/schema.js';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

// GET /api/orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    const { clientId, professionalId } = req.query;

    let query = db.select().from(orders);

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
    const { id } = req.params;
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
      return res.status(400).json({ error: 'Missing required fields' });
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

    res.status(201).json(newOrder[0]);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// PUT /api/orders/:id
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
    const { id } = req.params;
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

    res.json(updatedOrder[0]);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
