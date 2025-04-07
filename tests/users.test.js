const request = require('supertest');
const app = require('../app');
const mongodb = require('../data/database');
const bcrypt = require('bcrypt');

describe('Users API', () => {
  beforeAll(async () => {
    await mongodb.initDb();
  });

  afterEach(async () => {
    await mongodb.getDatabase().db().collection('users').deleteMany({});
  });

  afterAll(async () => {
    await mongodb.closeDb();
  });

  describe('POST /register', () => {
    it('should register a new user', async () => {
      const newUser = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/register')
        .send(newUser);
      
      expect(response.statusCode).toBe(201);
      
      const user = await mongodb.getDatabase().db().collection('users').findOne({ email: 'test@example.com' });
      expect(user).toBeTruthy();
      expect(user.email).toBe('test@example.com');
    });

    it('should reject duplicate email', async () => {
      const existingUser = {
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10)
      };
      await mongodb.getDatabase().db().collection('users').insertOne(existingUser);

      const response = await request(app)
        .post('/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(response.statusCode).toBe(400);
    });
  });

  describe('POST /login', () => {
    it('should login with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await mongodb.getDatabase().db().collection('users').insertOne({
        email: 'test@example.com',
        password: hashedPassword
      });

      const response = await request(app)
        .post('/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(response.statusCode).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword'
        });
      
      expect(response.statusCode).toBe(401);
    });
  });
});