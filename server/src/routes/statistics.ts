import { Router, Response } from 'express';
import { BillModel } from '../models/bill.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/monthly', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { month } = req.query;

    if (!month || typeof month !== 'string') {
      return res.status(400).json({ error: 'Month parameter is required (YYYY-MM format)' });
    }

    const stats = BillModel.getMonthlyStats(req.userId!, month);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/trend', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const months = req.query.months ? parseInt(req.query.months as string) : 6;
    const trend = BillModel.getTrendStats(req.userId!, months);
    res.json(trend);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
