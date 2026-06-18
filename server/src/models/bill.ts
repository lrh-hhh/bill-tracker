import db from '../database.js';

export interface Bill {
  id: number;
  user_id: number;
  amount: number;
  category: string;
  date: string;
  note?: string;
  created_at: string;
}

export interface CreateBillInput {
  amount: number;
  category: string;
  date: string;
  note?: string;
}

export class BillModel {
  static findByUserId(userId: number): Bill[] {
    return db.prepare(
      'SELECT * FROM bills WHERE user_id = ? ORDER BY date DESC'
    ).all(userId) as Bill[];
  }

  static findById(id: number): Bill | undefined {
    return db.prepare('SELECT * FROM bills WHERE id = ?').get(id) as Bill | undefined;
  }

  static create(userId: number, input: CreateBillInput): Bill {
    const result = db.prepare(
      'INSERT INTO bills (user_id, amount, category, date, note) VALUES (?, ?, ?, ?, ?)'
    ).run(userId, input.amount, input.category, input.date, input.note || null);
    
    return this.findById(result.lastInsertRowid as number)!;
  }

  static update(id: number, input: Partial<CreateBillInput>): Bill | undefined {
    const bill = this.findById(id);
    if (!bill) return undefined;

    const updates: string[] = [];
    const values: any[] = [];

    if (input.amount !== undefined) {
      updates.push('amount = ?');
      values.push(input.amount);
    }
    if (input.category !== undefined) {
      updates.push('category = ?');
      values.push(input.category);
    }
    if (input.date !== undefined) {
      updates.push('date = ?');
      values.push(input.date);
    }
    if (input.note !== undefined) {
      updates.push('note = ?');
      values.push(input.note);
    }

    if (updates.length === 0) return bill;

    values.push(id);
    db.prepare(`UPDATE bills SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    
    return this.findById(id);
  }

  static delete(id: number): boolean {
    const result = db.prepare('DELETE FROM bills WHERE id = ?').run(id);
    return result.changes > 0;
  }

  static getMonthlyStats(userId: number, month: string) {
    const startDate = `${month}-01`;
    const endDate = `${month}-31`;
    
    const bills = db.prepare(
      'SELECT * FROM bills WHERE user_id = ? AND date >= ? AND date <= ?'
    ).all(userId, startDate, endDate) as Bill[];
    
    const categoryStats = bills.reduce((acc, bill) => {
      acc[bill.category] = (acc[bill.category] || 0) + bill.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const dailyStats = bills.reduce((acc, bill) => {
      acc[bill.date] = (acc[bill.date] || 0) + bill.amount;
      return acc;
    }, {} as Record<string, number>);
    
    const totalExpense = bills.reduce((sum, bill) => sum + bill.amount, 0);
    
    return {
      bills,
      categoryStats,
      dailyStats,
      totalExpense,
      billCount: bills.length
    };
  }
}
