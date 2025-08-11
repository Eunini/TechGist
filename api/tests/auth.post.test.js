import request from 'supertest';
import app from '../index.js';
import db from '../models/index.js';
import { v4 as uuid } from 'uuid';

describe('Auth API', () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
    process.env.JWT_EXPIRES_IN = '1h';
    await db.sync();
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  const userData = {
    username: `testuser_${uuid().slice(0,8)}`,
    email: `test_${uuid().slice(0,8)}@example.com`,
    password: 'Passw0rd!'
  };

  it('should sign up a new user', async () => {
    const res = await request(app).post('/api/auth/signup').send(userData);
    expect(res.statusCode).toBe(201);
    expect(res.body.data.user.email).toBe(userData.email);
  });

  it('should sign in existing user', async () => {
    const res = await request(app).post('/api/auth/signin').send({ email: userData.email, password: userData.password });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
