const request = require('supertest');
const app = require('../app');
const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

describe('Clients API', () => {
  beforeAll(async () => {
    await mongodb.initDb(); // No callback needed, returns a Promise
  });

  afterEach(async () => {
    await mongodb.getDatabase().db().collection('clients').deleteMany({});
  });

  afterAll(async () => {
    await mongodb.closeDb();
  });

  describe('GET /clients', () => {
    it('should return all clients', async () => {
      const testClient = {
        name: 'Test Client',
        email: 'test@example.com',
        company: 'Test Company'
      };
      await mongodb.getDatabase().db().collection('clients').insertOne(testClient);

      const response = await request(app).get('/clients');
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'Test Client',
            email: 'test@example.com',
            company: 'Test Company'
          })
        ])
      );
    });
  });

  describe('GET /clients/:id', () => {
    it('should return a single client', async () => {
      const testClient = {
        name: 'Test Client',
        email: 'test@example.com',
        company: 'Test Company'
      };
      const insertResult = await mongodb.getDatabase().db().collection('clients').insertOne(testClient);
      const clientId = insertResult.insertedId;

      const response = await request(app).get(`/clients/${clientId}`);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          name: 'Test Client',
          email: 'test@example.com',
          company: 'Test Company'
        })
      );
    });
  });
});