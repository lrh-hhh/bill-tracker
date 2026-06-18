import axios from 'axios';
import type { 
  User, Bill, CreateBillInput, Goal, MonthlyStats, 
  AuthResponse, GoalsResponse 
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器添加 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      const isLoginPage = window.location.pathname === '/login' || window.location.pathname === '/register';
      if (!isLoginPage) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// 认证 API
export const authAPI = {
  register: (data: { username: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/register', data),
  
  login: (data: { username: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data),
  
  getMe: () => api.get<User>('/auth/me')
};

// 账单 API
export interface BillFilters {
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export const billsAPI = {
  getAll: (filters?: BillFilters) => api.get<Bill[]>('/bills', { params: filters }),

  create: (data: CreateBillInput) => api.post<Bill>('/bills', data),

  update: (id: number, data: Partial<CreateBillInput>) =>
    api.put<Bill>(`/bills/${id}`, data),

  delete: (id: number) => api.delete(`/bills/${id}`)
};

// 统计 API
export interface TrendData {
  labels: string[];
  totals: number[];
}

export const statisticsAPI = {
  getMonthly: (month: string) =>
    api.get<MonthlyStats>('/statistics/monthly', { params: { month } }),

  getTrend: (months?: number) =>
    api.get<TrendData>('/statistics/trend', { params: { months } })
};

// 目标 API
export const goalsAPI = {
  getAll: () => api.get<GoalsResponse>('/goals'),
  
  create: (data: Omit<Goal, 'id' | 'user_id' | 'created_at'>) =>
    api.post<Goal>('/goals', data),
  
  update: (id: number, data: Partial<Omit<Goal, 'id' | 'user_id' | 'created_at'>>) =>
    api.put<Goal>(`/goals/${id}`, data),
  
  delete: (id: number) => api.delete(`/goals/${id}`)
};

export default api;