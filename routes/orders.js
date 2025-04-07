const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/orders');
const { validateOrder } = require('../middleware/validation');

router
  .get('/', ordersController.getAll)
  .get('/:id', ordersController.getSingle)
  .post('/', validateOrder, ordersController.createOrder)
  .put('/:id', validateOrder, ordersController.updateOrder)
  .delete('/:id', ordersController.deleteOrder);

module.exports = router;