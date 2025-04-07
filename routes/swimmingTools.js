const express = require('express');
const router = express.Router();
const swimmingToolsController = require('../controllers/swimmingTools');
const { validateSwimmingTool } = require('../middleware/validation');

router
  .get('/', swimmingToolsController.getAll)
  .get('/:id', swimmingToolsController.getSingle)
  .post('/', validateSwimmingTool, swimmingToolsController.createSwimmingTool)
  .put('/:id', validateSwimmingTool, swimmingToolsController.updateSwimmingTool)
  .delete('/:id', swimmingToolsController.deleteSwimmingTool);

module.exports = router;