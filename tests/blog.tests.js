const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('./Models/user.model');
const Blog = require('./Models/blog.model');

let authToken;
let userId;
let blogId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/blogging_api_test');
  
  await User.deleteMany({});
  await Blog.deleteMany({});

  const signupRes = await request(app)
    .post('/api/auth/signup')
    .send({
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      password: 'password123'
    });

  authToken = signupRes.body.data.token;
  userId = signupRes.body.data.user.id;
});

afterAll(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
  await mongoose.connection.close();
});

describe('Blog Endpoints', () => {
  it('should create a blog in draft state', async () => {
    const res = await request(app)
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Test Blog',
        description: 'Test Description',
        body: 'This is a test blog body with enough words to calculate reading time.',
        tags: ['test', 'blog']
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.state).toBe('draft');
    expect(res.body.data.reading_time).toBeGreaterThan(0);
    blogId = res.body.data._id;
  });

  it('should not create blog without authentication', async () => {
    const res = await request(app)
      .post('/api/blogs')
      .send({
        title: 'Another Blog',
        body: 'Content'
      });

    expect(res.statusCode).toBe(401);
  });

  it('should get user blogs with pagination', async () => {
    const res = await request(app)
      .get('/api/blogs/user/my-blogs?page=1&limit=10')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.blogs).toBeInstanceOf(Array);
    expect(res.body.data.pagination).toBeDefined();
  });

  it('should filter user blogs by state', async () => {
    const res = await request(app)
      .get('/api/blogs/user/my-blogs?state=draft')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
    res.body.data.blogs.forEach(blog => {
      expect(blog.state).toBe('draft');
    });
  });

  it('should update blog state to published', async () => {
    const res = await request(app)
      .patch(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ state: 'published' });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.state).toBe('published');
  });

  it('should get all published blogs without authentication', async () => {
    const res = await request(app)
      .get('/api/blogs');

    expect(res.statusCode).toBe(200);
    expect(res.body.data.blogs).toBeInstanceOf(Array);
  });

  it('should search blogs by title', async () => {
    const res = await request(app)
      .get('/api/blogs?search=Test');

    expect(res.statusCode).toBe(200);
    expect(res.body.data.blogs.length).toBeGreaterThan(0);
  });

  it('should order blogs by read_count', async () => {
    const res = await request(app)
      .get('/api/blogs?order_by=read_count');

    expect(res.statusCode).toBe(200);
  });

  it('should get blog by id and increment read count', async () => {
    const res = await request(app)
      .get(`/api/blogs/${blogId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.data.read_count).toBe(1);
    expect(res.body.data.author).toHaveProperty('first_name');
  });

  it('should update blog content', async () => {
    const res = await request(app)
      .patch(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ 
        title: 'Updated Test Blog',
        description: 'Updated description'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe('Updated Test Blog');
  });

  it('should not update another user blog', async () => {
    // Create another user
    const anotherUser = await request(app)
      .post('/api/auth/signup')
      .send({
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane@example.com',
        password: 'password123'
      });

    const res = await request(app)
      .patch(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${anotherUser.body.data.token}`)
      .send({ title: 'Hacked' });

    expect(res.statusCode).toBe(404);
  });

  it('should delete blog', async () => {
    const res = await request(app)
      .delete(`/api/blogs/${blogId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.statusCode).toBe(200);
  });

  it('should return 404 for deleted blog', async () => {
    const res = await request(app)
      .get(`/api/blogs/${blogId}`);

    expect(res.statusCode).toBe(404);
  });
});
