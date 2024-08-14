const express = require('express');
const {
  createAdministrator,
  getAdministratori,
  getAdministrator,
  updateAdministrator,
  deleteAdministrator
} = require('../controllers/controllerAdministratori');

const router = express.Router();

router.get('/', getAdministratori);
router.get('/:id', getAdministrator);
router.post('/', createAdministrator);
router.delete('/:id', deleteAdministrator);
router.patch('/:id', updateAdministrator);

module.exports = router;
