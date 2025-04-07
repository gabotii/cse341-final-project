// tests/validation.test.js
const { 
    validateRegister, 
    validateLogin, 
    validateSwimmingTool, 
    validateClient, 
    validateOrder, 
    validateDelivery 
  } = require('../middleware/validation');
  
  describe('Validation Middleware', () => {
    describe('validateRegister', () => {
      it('should validate correct register data', () => {
        const req = { body: { email: 'test@example.com', password: 'password123' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();
  
        validateRegister(req, res, next);
        expect(next).toHaveBeenCalled();
      });
  
      it('should reject invalid email', () => {
        const req = { body: { email: 'invalid', password: 'password123' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        const next = jest.fn();
  
        validateRegister(req, res, next);
        expect(res.status).toHaveBeenCalledWith(400);
      });
    });
  
    // Similar tests for other validation functions would follow
  });