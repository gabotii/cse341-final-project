const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().db().collection('swimmingTools').find();
    const tools = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(tools);
  } catch (error) {
    res.status(500).json({ message: 'Error occurred while retrieving swimming tools.', error });
  }
};

const getSingle = async (req, res) => {
  const toolId = req.params.id;
  if (!ObjectId.isValid(toolId)) {
    return res.status(400).json({ message: 'Invalid tool ID format.' });
  }
  try {
    const result = await mongodb.getDatabase().db().collection('swimmingTools').find({ _id: new ObjectId(toolId) });
    const tools = await result.toArray();
    if (tools.length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(tools[0]);
    } else {
      res.status(404).json({ message: 'Swimming tool not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error occurred while retrieving the swimming tool.', error });
  }
};

const createSwimmingTool = async (req, res) => {
  const { productName, price } = req.body;
  if (!productName || !price) {
    return res.status(400).json({ message: 'Missing required fields: productName or price.' });
  }
  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ message: 'Price must be a positive number.' });
  }
  const tool = { productName, price };
  try {
    const response = await mongodb.getDatabase().db().collection('swimmingTools').insertOne(tool);
    if (response.acknowledged) {
      res.status(201).send();
    } else {
      res.status(500).json({ message: 'Error occurred while creating the swimming tool.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error occurred while creating the swimming tool.', error });
  }
};

const updateSwimmingTool = async (req, res) => {
  const toolId = req.params.id;
  if (!ObjectId.isValid(toolId)) {
    return res.status(400).json({ message: 'Invalid tool ID format.' });
  }
  const { productName, price } = req.body;
  if (!productName || !price) {
    return res.status(400).json({ message: 'Missing required fields: productName or price.' });
  }
  if (typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ message: 'Price must be a positive number.' });
  }
  const tool = { productName, price };
  try {
    const response = await mongodb.getDatabase().db()
      .collection('swimmingTools')
      .replaceOne({ _id: new ObjectId(toolId) }, tool);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Swimming tool not found or data not modified.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error occurred while updating the swimming tool.', error });
  }
};

const deleteSwimmingTool = async (req, res) => {
  const toolId = req.params.id;
  if (!ObjectId.isValid(toolId)) {
    return res.status(400).json({ message: 'Invalid tool ID format.' });
  }
  try {
    const response = await mongodb.getDatabase().db()
      .collection('swimmingTools')
      .deleteOne({ _id: new ObjectId(toolId) });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Swimming tool not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error occurred while deleting the swimming tool.', error });
  }
};

module.exports = {
  getAll,
  getSingle,
  createSwimmingTool,
  updateSwimmingTool,
  deleteSwimmingTool
};