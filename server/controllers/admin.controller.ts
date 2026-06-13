import { Request, Response } from 'express';
import { db } from '../../src/db/index.js';
import { users, professionals, orders, transactions, services } from '../../src/db/schema.js';
import { eq, desc, sql, sum, count, and } from 'drizzle-orm';

// GET /api/admin/dashboard
export const getDashboardMetrics = async (req: Request, res: Response) => {
  try {
    // Basic stats
    const totalUsersResult = await db.select({ count: count() }).from(users);
    const totalServicesResult = await db.select({ count: count() }).from(services);
    
    // Revenue (completed income transactions)
    const revenueResult = await db.select({ total: sum(transactions.value) })
      .from(transactions)
      .where(and(eq(transactions.status, 'completed'), eq(transactions.type, 'income')));

    const openOrdersResult = await db.select({ count: count() })
      .from(orders)
      .where(sql`${orders.status} IN ('pending', 'scheduled', 'provisional', 'in_progress')`);

    // Fetch recent users
    const recentUsers = await db.select().from(users).orderBy(desc(users.createdAt)).limit(5);

    // Fetch recent orders
    const recentOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5);

    res.json({
      metrics: {
        totalUsers: totalUsersResult[0].count,
        totalServices: totalServicesResult[0].count,
        totalRevenue: revenueResult[0].total || 0,
        openOrders: openOrdersResult[0].count,
      },
      recentUsers,
      recentOrders
    });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/admin/users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    const allProfessionals = await db.select().from(professionals);

    const merged = allUsers.map(user => {
      const profData = allProfessionals.find(p => p.userId === user.id);
      if (profData) {
        return { ...user, professionalProfile: profData };
      }
      return user;
    });

    res.json(merged);
  } catch (error) {
    console.error('Error fetching admin users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/admin/users/:id/verify
export const verifyProfessional = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await db.update(professionals)
      .set({ verificationStatus: 'verified' })
      .where(eq(professionals.userId, id));

    res.json({ success: true, message: 'Profissional verificado com sucesso.' });
  } catch (error) {
    console.error('Error verifying professional:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/admin/users/:id/reject
export const rejectProfessional = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await db.update(professionals)
      .set({ verificationStatus: 'rejected', idDocumentUrl: null, selfieUrl: null })
      .where(eq(professionals.userId, id));

    res.json({ success: true, message: 'Documentos rejeitados.' });
  } catch (error) {
    console.error('Error rejecting professional:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await db.delete(users).where(eq(users.id, id));
    res.json({ success: true, message: 'Usuário excluído.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/admin/withdrawals
export const getWithdrawals = async (req: Request, res: Response) => {
  try {
    const pendingWithdrawals = await db.select()
      .from(transactions)
      .where(eq(transactions.type, 'expense'))
      .orderBy(desc(transactions.createdAt));

    // Get the professional names for the withdrawals
    const result = [];
    for (const tx of pendingWithdrawals) {
      let profName = 'Desconhecido';
      let profAvatar = null;
      if (tx.professionalId) {
        const userRec = await db.select().from(users).where(eq(users.id, tx.professionalId)).limit(1);
        if (userRec.length > 0) {
          profName = userRec[0].name;
          profAvatar = userRec[0].avatar;
        }
      }
      result.push({
        ...tx,
        professionalName: profName,
        professionalAvatar: profAvatar
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Error fetching withdrawals:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/admin/withdrawals/:id/approve
export const approveWithdrawal = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await db.update(transactions)
      .set({ status: 'completed' })
      .where(eq(transactions.id, id));
      
    res.json({ success: true, message: 'Saque aprovado com sucesso.' });
  } catch (error) {
    console.error('Error approving withdrawal:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/admin/withdrawals/:id/reject
export const rejectWithdrawal = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    await db.update(transactions)
      .set({ status: 'failed' })
      .where(eq(transactions.id, id));
      
    res.json({ success: true, message: 'Saque rejeitado com sucesso.' });
  } catch (error) {
    console.error('Error rejecting withdrawal:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
