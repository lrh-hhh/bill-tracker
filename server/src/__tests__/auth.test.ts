import request from 'supertest';
import app from '../index.js';

describe('Auth API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const uniqueId = Date.now();
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: `newuser_${uniqueId}`,
          email: `newuser_${uniqueId}@example.com`,
          password: 'password123'
        });
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.username).toBe(`newuser_${uniqueId}`);
    });

    it('should return error for duplicate username', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'test1',
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.status).toBe(409);
      expect(res.body.error).toBe('Username already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'test1',
          password: 'password123'
        });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.username).toBe('test1');
    });

    it('should return error for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'test1',
          password: 'wrongpassword'
        });
      
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Invalid credentials');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user with valid token', async () => {
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'test1',
          password: 'password123'
        });
      
      const token = loginRes.body.token;
      
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.username).toBe('test1');
    });

    it('should return error without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');
      
      expect(res.status).toBe(401);
    });
  });
});
