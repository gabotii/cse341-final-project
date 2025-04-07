const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().db().collection('orders').find();
    const orders = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error occurred while retrieving orders.', error });
  }
};

const getSingle = async (req, res) => {
  const orderId = req.params.id;
  if (!ObjectId.isValid(orderId)) {
    return res.status(400).json({ message: 'Invalid order ID format.' });
  }
  try {
    const result = await mongodb.getDatabase().db().collection('orders').find({ _id: new ObjectId(orderId) });
    const orders = await result.toArray();
    if (orders.length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(orders[0]);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error occurred while retrieving the order.', error });
  }
};

const createOrder = async (req, res) => {
  const { clientId, toolId, quantity, orderDate } = req.body;

  if (!clientId || !toolId || !quantity) {
    return res.status(400).json({ message: 'Missing required fields: clientId, toolId, or quantity.' });
  }

  if (!ObjectId.isValid(clientId) || !ObjectId.isValid(toolId)) {
    return res.status(400).json({ message: 'Invalid clientId or toolId format. Must be a valid ObjectId.' });
  }

  if (typeof quantity !== 'number' || quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be a positive number.' });
  }

  const order = {
    clientId,
    toolId,
    quantity,
    orderDate: orderDate || new Date(),
    status: 'pending'
  };

  try {
    const response = await mongodb.getDatabase().db().collection('orders').insertOne(order);
    if (response.acknowledged) {
      res.status(201).send();
    } else {
      res.status(500).json({ message: 'Failed to create order.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating order.', error });
  }
};

const updateOrder = async (req, res) => {
  const orderId = req.params.id;
  if (!ObjectId.isValid(orderId)) {
    return res.status(400).json({ message: 'Invalid order ID format.' });
  }

  const { clientId, toolId, quantity, status } = req.body;

  if (!clientId || !toolId || !quantity) {
    return res.status(400).json({ message: 'Missing required fields: clientId, toolId, or quantity.' });
  }

  if (!ObjectId.isValid(clientId) || !ObjectId.isValid(toolId)) {
    return res.status(400).json({ message: 'Invalid clientId or toolId format. Must be a valid ObjectId.' });
  }

  if (typeof quantity !== 'number' || quantity <= 0) {
    return res.status(400).json({ message: 'Quantity must be a positive number.' });
  }

  const order = {
    clientId,
    toolId,
    quantity,
    status: status || 'pending',
    orderDate: new Date()
  };

  try {
    const response = await mongodb.getDatabase().db()
      .collection('orders')
      .replaceOne({ _id: new ObjectId(orderId) }, order);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Order not found or data not modified.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating order.', error });
  }
};

const deleteOrder = async (req, res) => {
  const orderId = req.params.id;
  if (!ObjectId.isValid(orderId)) {
    return res.status(400).json({ message: 'Invalid order ID format.' });
  }

  try {
    const response = await mongodb.getDatabase().db()
      .collection('orders')
      .deleteOne({ _id: new ObjectId(orderId) });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Order not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order.', error });
  }
};

module.exports = {
  getAll,
  getSingle,
  createOrder,
  updateOrder,
  deleteOrder
};