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

export interface MonthlyStats {
  bills: Bill[];
  categoryStats: Record<string, number>;
  dailyStats: Record<string, number>;
  totalExpense: number;
  billCount: number;
}

export class BillModel {
  static findByUserId(userId: number): Bill[] {
    return db.prepare(
      'SELECT * FROM bills WHERE user_id = ? ORDER BY date DESC'
    ).all(userId) as Bill[];
  }

  static findByUserIdFiltered(
    userId: number,
    filters: { category?: string; dateFrom?: string; dateTo?: string; search?: string },
    sort?: { sortBy?: string; sortOrder?: 'asc' | 'desc' }
  ): Bill[] {
    let query = 'SELECT * FROM bills WHERE user_id = ?';
    const params: any[] = [userId];

    if (filters.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }
    if (filters.dateFrom) {
      query += ' AND date >= ?';
      params.push(filters.dateFrom);
    }
    if (filters.dateTo) {
      query += ' AND date <= ?';
      params.push(filters.dateTo);
    }
    if (filters.search) {
      query += ' AND note LIKE ?';
      params.push(`%${filters.search}%`);
    }

    const allowedSortFields: Record<string, string> = {
      date: 'date',
      amount: 'amount',
      category: 'category'
    };
    const sortField = sort?.sortBy && allowedSortFields[sort.sortBy] ? allowedSortFields[sort.sortBy] : 'date';
    const order = sort?.sortOrder === 'asc' ? 'ASC' : 'DESC';
    query += ` ORDER BY ${sortField} ${order}`;

    return db.prepare(query).all(...params) as Bill[];
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

  static getTrendStats(userId: number, months: number = 6): { labels: string[]; totals: number[] } {
    const results: { month: string; total: number }[] = [];
    for (let i = months - 1; i >= 0; i--) {
      const m = new Date();
      m.setMonth(m.getMonth() - i);
      const monthStr = `${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, '0')}`;
      const startDate = `${monthStr}-01`;
      const endDate = db.prepare(
        "SELECT date(?, 'start of month', '+1 month', '-1 day') as date"
      ).get(startDate) as { date: string };

      const row = db.prepare(
        'SELECT COALESCE(SUM(amount), 0) as total FROM bills WHERE user_id = ? AND date >= ? AND date <= ?'
      ).get(userId, startDate, endDate.date) as { total: number };

      results.push({ month: monthStr, total: row.total });
    }

    return {
      labels: results.map(r => {
        const [year, mon] = r.month.split('-');
        return `${parseInt(mon)}月`;
      }),
      totals: results.map(r => r.total)
    };
  }

  static getMonthlyStats(userId: number, month: string): MonthlyStats {
    // 使用 SQLite 的日期函数来计算月份范围
    const startDate = `${month}-01`;
    const endDate = db.prepare(
      "SELECT date(?, 'start of month', '+1 month', '-1 day') as date"
    ).get(startDate) as { date: string };
    
    const bills = db.prepare(
      'SELECT * FROM bills WHERE user_id = ? AND date >= ? AND date <= ?'
    ).all(userId, startDate, endDate.date) as Bill[];
    
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
