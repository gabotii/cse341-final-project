const request = require('supertest');
const app = require('../app');
const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

describe('Swimming Tools API', () => {
  beforeAll(async () => {
    await mongodb.initDb(); // No callback needed
  });

  afterEach(async () => {
    await mongodb.getDatabase().db().collection('swimmingTools').deleteMany({});
  });

  afterAll(async () => {
    await mongodb.closeDb();
  });

  describe('GET /swimmingTools', () => {
    it('should return all swimming tools', async () => {
      const testTool = {
        productName: 'Test Goggles',
        price: 19.99
      };
      await mongodb.getDatabase().db().collection('swimmingTools').insertOne(testTool);

      const response = await request(app).get('/swimmingTools');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            productName: 'Test Goggles',
            price: 19.99
          })
        ])
      );
    });
  });

  describe('GET /swimmingTools/:id', () => {
    it('should return a single swimming tool', async () => {
      const testTool = {
        productName: 'Test Goggles',
        price: 19.99
      };
      const insertResult = await mongodb.getDatabase().db().collection('swimmingTools').insertOne(testTool);
      const toolId = insertResult.insertedId;

      const response = await request(app).get(`/swimmingTools/${toolId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          productName: 'Test Goggles',
          price: 19.99
        })
      );
    });
  });

  describe('POST /swimmingTools', () => {
    it('should create a new swimming tool', async () => {
      const newTool = {
        productName: 'New Swim Cap',
        price: 12.99
      };

      const response = await request(app)
        .post('/swimmingTools')
        .send(newTool);
      
      expect(response.statusCode).toBe(201);
      
      const tools = await mongodb.getDatabase().db().collection('swimmingTools').find().toArray();
      expect(tools.length).toBe(1);
    });

    it('should reject invalid tool data', async () => {
      const invalidTool = {
        productName: '',
        price: -10
      };

      const response = await request(app)
        .post('/swimmingTools')
        .send(invalidTool);
      
      expect(response.statusCode).toBe(400);
    });
  });
});