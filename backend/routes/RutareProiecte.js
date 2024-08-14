const express = require("express");
const {
  createProiect,
  getProiecte,
  getProiect,
  updateProiect,
  deleteProiect,
} = require("../controllers/controllerProiecte");

const requireAuth = require('../middleware/requireAuth');

const router = express.Router();
router.use(requireAuth);

router.get("/", getProiecte);
router.get("/:id", getProiect);
router.post("/", createProiect);
router.delete("/:id", deleteProiect);
router.patch("/:id", updateProiect);

module.exports = router;
