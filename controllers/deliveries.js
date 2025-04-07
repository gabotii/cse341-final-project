const mongodb = require('../data/database');
const { ObjectId } = require('mongodb');

const getAll = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().db().collection('deliveries').find();
    const deliveries = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving deliveries', error });
  }
};

const getSingle = async (req, res) => {
  const deliveryId = req.params.id;
  if (!ObjectId.isValid(deliveryId)) {
    return res.status(400).json({ message: 'Invalid delivery ID format' });
  }
  try {
    const result = await mongodb.getDatabase().db()
      .collection('deliveries')
      .find({ _id: new ObjectId(deliveryId) });
    const deliveries = await result.toArray();
    if (deliveries.length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(deliveries[0]);
    } else {
      res.status(404).json({ message: 'Delivery not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving delivery', error });
  }
};

const createDelivery = async (req, res) => {
  const { orderId, clientId, deliveryDate, status, trackingNumber, items } = req.body;
  if (!orderId || !clientId || !deliveryDate || !status) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  if (!ObjectId.isValid(orderId) || !ObjectId.isValid(clientId)) {
    return res.status(400).json({ message: 'Invalid orderId or clientId format' });
  }
  const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }
  const delivery = {
    orderId: new ObjectId(orderId),
    clientId: new ObjectId(clientId),
    deliveryDate,
    status,
    trackingNumber,
    items
  };
  try {
    const response = await mongodb.getDatabase().db()
      .collection('deliveries')
      .insertOne(delivery);
    if (response.acknowledged) {
      res.status(201).send();
    } else {
      res.status(500).json({ message: 'Error creating delivery' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating delivery', error });
  }
};

const updateDelivery = async (req, res) => {
  const deliveryId = req.params.id;
  const { orderId, clientId, deliveryDate, status, trackingNumber, items } = req.body;
  if (!ObjectId.isValid(deliveryId)) {
    return res.status(400).json({ message: 'Invalid delivery ID format' });
  }
  if (!orderId || !clientId || !deliveryDate || !status) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }
  const delivery = {
    orderId: new ObjectId(orderId),
    clientId: new ObjectId(clientId),
    deliveryDate,
    status,
    trackingNumber,
    items
  };
  try {
    const response = await mongodb.getDatabase().db()
      .collection('deliveries')
      .replaceOne({ _id: new ObjectId(deliveryId) }, delivery);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Delivery not found or not modified' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating delivery', error });
  }
};

const deleteDelivery = async (req, res) => {
  const deliveryId = req.params.id;
  if (!ObjectId.isValid(deliveryId)) {
    return res.status(400).json({ message: 'Invalid delivery ID format' });
  }
  try {
    const response = await mongodb.getDatabase().db()
      .collection('deliveries')
      .deleteOne({ _id: new ObjectId(deliveryId) });
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Delivery not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting delivery', error });
  }
};

const getDeliveryStats = async (req, res) => {
  try {
    const result = await mongodb.getDatabase().db()
      .collection('deliveries')
      .aggregate([
        {
          $group: {
            _id: "$clientId",
            totalDeliveries: { $sum: 1 },
            totalItems: { $sum: { $size: { $ifNull: ["$items", []] } } },
            pendingCount: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
            completedCount: { $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] } }
          }
        },
        {
          $lookup: {
            from: "clients",
            localField: "_id",
            foreignField: "_id",
            as: "clientInfo"
          }
        },
        {
          $unwind: "$clientInfo"
        },
        {
          $project: {
            clientName: "$clientInfo.name",
            totalDeliveries: 1,
            totalItems: 1,
            pendingCount: 1,
            completedCount: 1
          }
        }
      ])
      .toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving delivery statistics', error });
  }
};

module.exports = {
  getAll,
  getSingle,
  createDelivery,
  updateDelivery,
  deleteDelivery,
  getDeliveryStats
};