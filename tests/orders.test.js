const request = require('supertest');
const app = require('../app');
const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

describe('Orders API', () => {
  beforeAll(async () => {
    await mongodb.initDb();
  });

  afterEach(async () => {
    await mongodb.getDatabase().db().collection('orders').deleteMany({});
  });

  afterAll(async () => {
    await mongodb.closeDb();
  });

  describe('GET /orders', () => {
    it('should return all orders', async () => {
      const testOrder = {
        clientId: new ObjectId().toString(),
        toolId: new ObjectId().toString(),
        quantity: 1,
        status: 'pending'
      };
      await mongodb.getDatabase().db().collection('orders').insertOne(testOrder);

      const response = await request(app).get('/orders');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            quantity: 1,
            status: 'pending'
          })
        ])
      );
    });
  });

  describe('GET /orders/:id', () => {
    it('should return a single order', async () => {
      const testOrder = {
        clientId: new ObjectId().toString(),
        toolId: new ObjectId().toString(),
        quantity: 1,
        status: 'pending'
      };
      const insertResult = await mongodb.getDatabase().db().collection('orders').insertOne(testOrder);
      const orderId = insertResult.insertedId;

      const response = await request(app).get(`/orders/${orderId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          quantity: 1,
          status: 'pending'
        })
      );
    });
  });

  describe('POST /orders', () => {
    it('should create a new order', async () => {
      const newOrder = {
        clientId: new ObjectId().toString(),
        toolId: new ObjectId().toString(),
        quantity: 2
      };

      const response = await request(app)
        .post('/orders')
        .send(newOrder);

      expect(response.statusCode).toBe(201);

      const orders = await mongodb.getDatabase().db().collection('orders').find().toArray();
      expect(orders.length).toBe(1);
      expect(orders[0]).toMatchObject({
        clientId: newOrder.clientId,
        toolId: newOrder.toolId,
        quantity: newOrder.quantity,
        status: 'pending'
      });
    });

    it('should reject invalid order data', async () => {
      const invalidOrder = {
        clientId: 'invalid',
        toolId: new ObjectId().toString(),
        quantity: 0
      };

      const response = await request(app)
        .post('/orders')
        .send(invalidOrder);

      expect(response.statusCode).toBe(400);
    });
  });
});