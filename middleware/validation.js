const Joi = require('joi');
const { ObjectId } = require('mongodb');

const validateRegister = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

const validateSwimmingTool = (req, res, next) => {
  const schema = Joi.object({
    productName: Joi.string().required(),
    price: Joi.number().min(0).required()
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

const validateClient = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    company: Joi.string().required(),
    ipaddress: Joi.string().optional()
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

const validateOrder = (req, res, next) => {
  const schema = Joi.object({
    clientId: Joi.string().required().custom((value, helpers) => {
      if (!ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'ObjectId validation'),
    toolId: Joi.string().required().custom((value, helpers) => {
      if (!ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'ObjectId validation'),
    quantity: Joi.number().min(1).required(),
    orderDate: Joi.date().optional(),
    status: Joi.string().optional()
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

const validateDelivery = (req, res, next) => {
  const schema = Joi.object({
    orderId: Joi.string().required().custom((value, helpers) => {
      if (!ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'ObjectId validation'),
    clientId: Joi.string().required().custom((value, helpers) => {
      if (!ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'ObjectId validation'),
    deliveryDate: Joi.date().required(),
    status: Joi.string().valid('pending', 'shipped', 'delivered', 'cancelled').required(),
    trackingNumber: Joi.string().optional(),
    items: Joi.array().items(
      Joi.object({
        toolId: Joi.string().required().custom((value, helpers) => {
          if (!ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
          }
          return value;
        }, 'ObjectId validation'),
        quantity: Joi.number().min(1).required()
      })
    ).optional()
  });
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  next();
};

module.exports = { 
  validateRegister, 
  validateLogin, 
  validateSwimmingTool, 
  validateClient, 
  validateOrder, 
  validateDelivery 
};