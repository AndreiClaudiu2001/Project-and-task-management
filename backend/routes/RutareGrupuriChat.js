
const express = require("express");
const router = express.Router();
const grupuriChatController = require("../controllers/controllerGrupuriChat");

router.get("/", grupuriChatController.getGrupuriChat);

router.post("/", grupuriChatController.createGrupChat);

module.exports = router;
