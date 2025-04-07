const express = require('express');
const router = express.Router();
const deliveriesController = require('../controllers/deliveries');
const { validateDelivery } = require('../middleware/validation');

router
  .get('/', deliveriesController.getAll)
  .get('/aggregate', deliveriesController.getDeliveryStats)
  .get('/:id', deliveriesController.getSingle)
  .post('/', validateDelivery, deliveriesController.createDelivery)
  .put('/:id', validateDelivery, deliveriesController.updateDelivery)
  .delete('/:id', deliveriesController.deleteDelivery);

module.exports = router;