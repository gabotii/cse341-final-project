const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clients');
const { validateClient } = require('../middleware/validation');

router
  .get('/', clientsController.getAll)
  .get('/:id', clientsController.getSingle)
  .post('/', validateClient, clientsController.createClient)
  .put('/:id', validateClient, clientsController.updateClient)
  .delete('/:id', clientsController.deleteClient);

module.exports = router;