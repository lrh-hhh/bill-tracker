// 设置测试环境变量（必须在import之前）
process.env.JWT_SECRET = 'test-secret-key';

import request from 'supertest';
import app from '../index.js';

describe('Bills API', () => {
  let token: string;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'test1',
        password: 'password123'
      });
    token = res.body.token;
  });

  describe('POST /api/bills', () => {
    it('should create a new bill', async () => {
      const res = await request(app)
        .post('/api/bills')
        .set('Authorization', `Bearer ${token}`)
        .send({
          amount: 100.50,
          category: '餐饮',
          date: '2026-06-18',
          note: '午餐'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.amount).toBe(100.50);
      expect(res.body.category).toBe('餐饮');
    });
  });

  describe('GET /api/bills', () => {
    it('should return bills for current user', async () => {
      const res = await request(app)
        .get('/api/bills')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
