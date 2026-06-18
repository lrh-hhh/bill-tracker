import db from '../database.js';

export interface Goal {
  id: number;
  user_id: number;
  target_amount: number;
  period: 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
  created_at: string;
}

export class GoalModel {
  static findByUserId(userId: number): Goal[] {
    return db.prepare(
      'SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC'
    ).all(userId) as Goal[];
  }

  static findActiveByUserId(userId: number): Goal | undefined {
    const today = new Date().toISOString().split('T')[0];
    return db.prepare(
      'SELECT * FROM goals WHERE user_id = ? AND start_date <= ? AND end_date >= ?'
    ).get(userId, today, today) as Goal | undefined;
  }

  static create(userId: number, input: Omit<Goal, 'id' | 'user_id' | 'created_at'>): Goal {
    const result = db.prepare(
      'INSERT INTO goals (user_id, target_amount, period, start_date, end_date) VALUES (?, ?, ?, ?, ?)'
    ).run(userId, input.target_amount, input.period, input.start_date, input.end_date);
    
    return db.prepare('SELECT * FROM goals WHERE id = ?').get(result.lastInsertRowid) as Goal;
  }

  static update(id: number, input: Partial<Omit<Goal, 'id' | 'user_id' | 'created_at'>>): Goal | undefined {
    const goal = db.prepare('SELECT * FROM goals WHERE id = ?').get(id) as Goal | undefined;
    if (!goal) return undefined;

    const updates: string[] = [];
    const values: any[] = [];

    if (input.target_amount !== undefined) {
      updates.push('target_amount = ?');
      values.push(input.target_amount);
    }
    if (input.period !== undefined) {
      updates.push('period = ?');
      values.push(input.period);
    }
    if (input.start_date !== undefined) {
      updates.push('start_date = ?');
      values.push(input.start_date);
    }
    if (input.end_date !== undefined) {
      updates.push('end_date = ?');
      values.push(input.end_date);
    }

    if (updates.length === 0) return goal;

    values.push(id);
    db.prepare(`UPDATE goals SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    
    return db.prepare('SELECT * FROM goals WHERE id = ?').get(id) as Goal;
  }

  static delete(id: number): boolean {
    const result = db.prepare('DELETE FROM goals WHERE id = ?').run(id);
    return result.changes > 0;
  }
}
