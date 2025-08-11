import request from 'supertest';
import app from '../index.js';
import db from '../models/index.js';
import { v4 as uuid } from 'uuid';

let token;
let adminUser;

describe('Post API', () => {
  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';
    process.env.JWT_EXPIRES_IN = '1h';
    await db.sync();
    // create admin user directly
    adminUser = await db.User.create({
      username: `admin_${uuid().slice(0,8)}`,
      email: `admin_${uuid().slice(0,8)}@example.com`,
      password: 'Passw0rd!',
      role: 'admin'
    });
    // sign in to get token (use service)
    const res = await request(app).post('/api/auth/signin').send({ email: adminUser.email, password: 'Passw0rd!' });
    token = res.body.token;
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  it('creates a post', async () => {
    const res = await request(app)
      .post('/api/post/create')
      .set('Cookie', [`access_token=${token}`])
      .send({ title: 'Test Post Title', content: '<p>This is a long content body with more than fifty characters for validation.</p>', topic: 'AI/ML' });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.post.slug).toBeDefined();
  });

  it('lists posts', async () => {
    const res = await request(app).get('/api/post/getposts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.posts)).toBe(true);
  });
});
