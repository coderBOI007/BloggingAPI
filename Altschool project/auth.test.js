const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User.model');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blogging_api_test');
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('Auth Endpoints', () => {
  const testUser = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    password: 'password123'
  };

  it('should signup a new user', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
  });

  it('should not signup with existing email', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send(testUser);

    expect(res.statusCode).toBe(400);
  });

  it('should signin existing user', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('token');
  });

  it('should not signin with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      });

    expect(res.statusCode).toBe(401);
  });
});
