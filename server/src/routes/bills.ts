import { Router, Response } from 'express';
import { BillModel, CreateBillInput } from '../models/bill.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const bills = BillModel.findByUserId(req.userId!);
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { amount, category, date, note } = req.body;

    if (!amount || !category || !date) {
      return res.status(400).json({ error: 'Amount, category, and date are required' });
    }

    const input: CreateBillInput = {
      amount: parseFloat(amount),
      category,
      date,
      note
    };

    const bill = BillModel.create(req.userId!, input);
    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const bill = BillModel.findById(parseInt(req.params.id));

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    if (bill.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { amount, category, date, note } = req.body;
    const input: Partial<CreateBillInput> = {};

    if (amount !== undefined) input.amount = parseFloat(amount);
    if (category !== undefined) input.category = category;
    if (date !== undefined) input.date = date;
    if (note !== undefined) input.note = note;

    const updatedBill = BillModel.update(bill.id, input);
    res.json(updatedBill);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const bill = BillModel.findById(parseInt(req.params.id));

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    if (bill.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    BillModel.delete(bill.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
