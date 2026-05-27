import { Request, Response } from 'express';
import { db } from '../../src/db/index.js';
import { orders, payments, addresses, services } from '../../src/db/schema.js';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

// GET /api/orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    const { clientId, professionalId } = req.query;

    let query = db.select({
      id: orders.id,
      clientId: orders.clientId,
      professionalId: orders.professionalId,
      serviceId: orders.serviceId,
      addressId: orders.addressId,
      scheduledDate: orders.scheduledDate,
      scheduledTime: orders.scheduledTime,
      status: orders.status,
      totalPrice: orders.totalPrice,
      createdAt: orders.createdAt,
      serviceTitle: services.title,
    })
    .from(orders)
    .leftJoin(services, eq(orders.serviceId, services.id));

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

    const formattedList = list.map(o => ({
      ...o,
      // map to frontend expected fields if needed
      date: o.scheduledDate,
      time: o.scheduledTime,
      price: o.totalPrice,
    }));

    res.json(formattedList);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const orderList = await db.select({
      id: orders.id,
      clientId: orders.clientId,
      professionalId: orders.professionalId,
      serviceId: orders.serviceId,
      addressId: orders.addressId,
      scheduledDate: orders.scheduledDate,
      scheduledTime: orders.scheduledTime,
      status: orders.status,
      totalPrice: orders.totalPrice,
      createdAt: orders.createdAt,
      serviceTitle: services.title,
    })
    .from(orders)
    .leftJoin(services, eq(orders.serviceId, services.id))
    .where(eq(orders.id, id))
    .limit(1);

    if (orderList.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const o = orderList[0];
    res.json({
      ...o,
      date: o.scheduledDate,
      time: o.scheduledTime,
      price: o.totalPrice,
    });
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/orders
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { serviceId, clientId, professionalId, date, time, price, paymentMethod, addressId } = req.body;

    if (!clientId || !professionalId || !date || !time || price === undefined || !paymentMethod || !addressId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const orderId = `o_${crypto.randomBytes(4).toString('hex')}`;

    const newOrder = await db.insert(orders).values({
      id: orderId,
      serviceId: serviceId || null,
      clientId,
      professionalId,
      scheduledDate: date,
      scheduledTime: time,
      status: 'pending',
      totalPrice: Number(price),
      addressId,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    const paymentId = `pay_${crypto.randomBytes(4).toString('hex')}`;
    await db.insert(payments).values({
      id: paymentId,
      orderId: orderId,
      amount: Number(price),
      paymentMethod,
      status: 'pending',
      createdAt: new Date(),
    });

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
    const { date, time, price, addressId, status } = req.body;

    const existingOrder = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (existingOrder.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updatedOrder = await db.update(orders)
      .set({
        ...(date !== undefined && { scheduledDate: date }),
        ...(time !== undefined && { scheduledTime: time }),
        ...(price !== undefined && { totalPrice: Number(price) }),
        ...(addressId !== undefined && { addressId }),
        ...(status !== undefined && { status }),
        updatedAt: new Date()
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

    const validStatuses = ['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled', 'scheduled'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid or missing status' });
    }

    const existingOrder = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
    if (existingOrder.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const updatedOrder = await db.update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();

    res.json(updatedOrder[0]);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
