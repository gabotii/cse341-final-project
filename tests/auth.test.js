const { verifyToken } = require('../middleware/auth');
const jwt = require('jsonwebtoken');

describe('Authentication Middleware', () => {
  const originalSecret = process.env.JWT_SECRET;
  
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
  });

  afterAll(() => {
    process.env.JWT_SECRET = originalSecret;
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const token = jwt.sign({ id: '123', email: 'test@example.com' }, process.env.JWT_SECRET);
      const req = { headers: { authorization: `Bearer ${token}` } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      verifyToken(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
    });

    it('should reject invalid token', () => {
      const req = { headers: { authorization: 'Bearer invalid.token.here' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();

      verifyToken(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });
});