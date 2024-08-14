const express = require('express');
const router = express.Router();
const termeniController = require('../controllers/controllerTermeni');

router.get('/', termeniController.getTermeni);
router.post('/', termeniController.createTermeni);
router.put('/:id', termeniController.updateTermeni);
router.delete('/:id',termeniController.deleteTermeni)
module.exports = router;
