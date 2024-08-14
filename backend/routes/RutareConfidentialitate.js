const express = require('express');
const router = express.Router();
const confidentialitateController = require('../controllers/controllerConfidentialitate');

router.get('/', confidentialitateController.getConfidentialitate);
router.post('/', confidentialitateController.createConfidentialitate);
router.put('/:id', confidentialitateController.updateConfidentialitate);
router.delete('/:id', confidentialitateController.deleteConfidentialitate);

module.exports = router;
