const request = require('supertest');
const jwt = require('jsonwebtoken'); // ✅ Needed
const app = require('../app');
require('dotenv').config({ path: '.env.test' });

describe('Jira Controller (Supabase Fetch)', () => {
  const testUser = {
    id: 'test-user-123',
    email: 'testuser@example.com',
    role: 'user'
  };

  const token = jwt.sign(testUser, process.env.JWT_SECRET, { expiresIn: '1d' });

  const AUTH_HEADER = {
    Authorization: `Bearer ${token}`
  };

  it('should fetch Jira issues from Supabase', async () => {
    const res = await request(app)
      .get('/api/jira-issues')
      .set(AUTH_HEADER);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('summary');
      expect(res.body[0]).toHaveProperty('status');
    }
  });
});
