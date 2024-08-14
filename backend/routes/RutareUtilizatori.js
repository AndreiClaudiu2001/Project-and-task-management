const express = require('express')

const {loginUser,getUtilizatorID,getUtilizatorByID} = require('../controllers/controllerUtilizatori')
const router = express.Router()


router.post('/login', loginUser)
router.get('/email/:email',getUtilizatorID)
router.get('/:id',getUtilizatorByID)





module.exports = router