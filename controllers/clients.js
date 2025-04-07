const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().db().collection('clients').find();
    const clients = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error occurred while retrieving clients.', error });
  }
};

const getSingle = async (req, res) => {
  const clientId = req.params.id;
  if (!ObjectId.isValid(clientId)) {
    return res.status(400).json({ message: 'Invalid client ID format.' });
  }
  try {
    const client = await mongodb.getDatabase().db()
      .collection('clients')
      .findOne({ _id: new ObjectId(clientId) });
    if (client) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(client);
    } else {
      res.status(404).json({ message: 'Client not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error occurred while retrieving the client.', error });
  }
};

const createClient = async (req, res) => {
  const { name, email, company } = req.body;
  if (!name || !email || !company) {
    return res.status(400).json({ message: 'Missing required fields: name, email, or company.' });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }
  const client = { name, email, company };
  try {
    const response = await mongodb.getDatabase().db().collection('clients').insertOne(client);
    if (response.acknowledged) {
      res.status(201).send();
    } else {
      res.status(500).json({ message: 'Error occurred while creating the client.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error occurred while creating the client.', error });
  }
};

const updateClient = async (req, res) => {
  const clientId = req.params.id;
  if (!ObjectId.isValid(clientId)) {
    return res.status(400).json({ message: 'Invalid client ID format.' });
  }
  const { name, email, company, ipaddress } = req.body;
  if (!name || !email || !company) {
    return res.status(400).json({ message: 'Missing required fields: name, email, or company.' });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }
  const client = { name, email, company, ipaddress };
  try {
    const response = await mongodb.getDatabase().db()
      .collection('clients')
      .replaceOne({ _id: new ObjectId(clientId) }, client);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Client not found or data not modified.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error occurred while updating the client.', error });
  }
};

const deleteClient = async (req, res) => {
  const clientId = req.params.id;
  if (!ObjectId.isValid(clientId)) {
    return res.status(400).json({ message: 'Invalid client ID format.' });
  }
  try {
    const response = await mongodb.getDatabase().db()
      .collection('clients')
      .deleteOne({ _id: new ObjectId(clientId) });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Client not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error occurred while deleting the client.', error });
  }
};

module.exports = {
  getAll,
  getSingle,
  createClient,
  updateClient,
  deleteClient
};