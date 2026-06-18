export interface User {
  id: number;
  username: string;
  email: string;
}

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

export interface Goal {
  id: number;
  user_id: number;
  target_amount: number;
  period: 'monthly' | 'yearly';
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface MonthlyStats {
  bills: Bill[];
  categoryStats: Record<string, number>;
  dailyStats: Record<string, number>;
  totalExpense: number;
  billCount: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface GoalsResponse {
  goals: Goal[];
  activeGoal: Goal | undefined;
}
