
const express = require("express");
const router = express.Router();
const mesajeController = require("../controllers/controllerMesaje");

router.get("/", mesajeController.getMesaje);

router.post("/", mesajeController.createMesaj);

module.exports = router;
