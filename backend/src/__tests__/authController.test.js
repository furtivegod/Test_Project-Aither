// __tests__/authController.test.js
const request = require('supertest');
const app = require('../app');

describe('Auth Controller', () => {
  it('should sign up a user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        name: 'Test User',
        role: 'user',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data[0]).toHaveProperty('email');
  });

  it('should fail login with wrong credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'wrong@email.com',
        password: 'wrongpass',
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
