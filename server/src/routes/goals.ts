import { Router, Request, Response } from 'express';
import { GoalModel } from '../models/goal.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const goals = GoalModel.findByUserId(req.userId!);
    const activeGoal = GoalModel.findActiveByUserId(req.userId!);

    res.json({ goals, activeGoal });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const { target_amount, period, start_date, end_date } = req.body;

    if (!target_amount || !period || !start_date || !end_date) {
      return res.status(400).json({
        error: 'target_amount, period, start_date, and end_date are required'
      });
    }

    if (!['monthly', 'yearly'].includes(period)) {
      return res.status(400).json({ error: 'Period must be monthly or yearly' });
    }

    const goal = GoalModel.create(req.userId!, {
      target_amount: parseFloat(target_amount),
      period,
      start_date,
      end_date
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const goals = GoalModel.findByUserId(req.userId!);
    const goalToUpdate = goals.find(g => g.id === parseInt(req.params.id));

    if (!goalToUpdate) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const { target_amount, period, start_date, end_date } = req.body;
    const input: any = {};

    if (target_amount !== undefined) input.target_amount = parseFloat(target_amount);
    if (period !== undefined) input.period = period;
    if (start_date !== undefined) input.start_date = start_date;
    if (end_date !== undefined) input.end_date = end_date;

    const updatedGoal = GoalModel.update(goalToUpdate.id, input);
    res.json(updatedGoal);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', authenticateToken, (req: AuthRequest, res: Response) => {
  try {
    const goals = GoalModel.findByUserId(req.userId!);
    const goalToDelete = goals.find(g => g.id === parseInt(req.params.id));

    if (!goalToDelete) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    GoalModel.delete(goalToDelete.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
