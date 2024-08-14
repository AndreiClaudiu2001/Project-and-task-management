
const express = require("express");
const router = express.Router();
const membriiGrupChatController = require("../controllers/controllerMembriiGrupChat");

router.get("/", membriiGrupChatController.getMembriiGrupChat);

router.post("/", membriiGrupChatController.addMembriiGrupChat);

module.exports = router;
