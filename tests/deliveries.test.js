const request = require('supertest');
const app = require('../app');
const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

describe('Deliveries API', () => {
  beforeAll(async () => {
    await mongodb.initDb();
  });

  afterEach(async () => {
    await mongodb.getDatabase().db().collection('clients').deleteMany({});
    await mongodb.getDatabase().db().collection('deliveries').deleteMany({});
  });

  afterAll(async () => {
    await mongodb.closeDb();
  });

  describe('GET /deliveries', () => {
    it('should return all deliveries', async () => {
      const client = {
        _id: new ObjectId(),
        name: 'Test Client',
        email: 'test@example.com',
        company: 'Test Company'
      };
      await mongodb.getDatabase().db().collection('clients').insertOne(client);

      const delivery = {
        orderId: new ObjectId(),
        clientId: client._id,
        deliveryDate: new Date(),
        status: 'pending',
        items: [{ toolId: new ObjectId(), quantity: 1 }]
      };
      await mongodb.getDatabase().db().collection('deliveries').insertOne(delivery);

      const response = await request(app).get('/deliveries');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            orderId: expect.any(String),
            clientId: expect.any(String),
            status: 'pending'
          })
        ])
      );
    });
  });

  describe('GET /deliveries/:id', () => {
    it('should return a single delivery', async () => {
      const client = {
        _id: new ObjectId(),
        name: 'Test Client',
        email: 'test@example.com',
        company: 'Test Company'
      };
      await mongodb.getDatabase().db().collection('clients').insertOne(client);

      const delivery = {
        orderId: new ObjectId(),
        clientId: client._id,
        deliveryDate: new Date(),
        status: 'pending',
        items: [{ toolId: new ObjectId(), quantity: 1 }]
      };
      const insertResult = await mongodb.getDatabase().db().collection('deliveries').insertOne(delivery);
      const deliveryId = insertResult.insertedId;

      const response = await request(app).get(`/deliveries/${deliveryId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          orderId: expect.any(String),
          clientId: expect.any(String),
          status: 'pending'
        })
      );
    });
  });

  describe('GET /deliveries/aggregate', () => {
    it('should return delivery statistics', async () => {
      const client = {
        _id: new ObjectId(),
        name: 'Test Client',
        email: 'test@example.com',
        company: 'Test Company'
      };
      await mongodb.getDatabase().db().collection('clients').insertOne(client);

      const delivery = {
        orderId: new ObjectId(),
        clientId: client._id,
        deliveryDate: new Date(),
        status: 'pending',
        items: [{ toolId: new ObjectId(), quantity: 1 }]
      };
      await mongodb.getDatabase().db().collection('deliveries').insertOne(delivery);

      const response = await request(app).get('/deliveries/aggregate');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            clientName: 'Test Client',
            totalDeliveries: 1,
            totalItems: 1,
            pendingCount: 1,
            completedCount: 0
          })
        ])
      );
    });
  });
});