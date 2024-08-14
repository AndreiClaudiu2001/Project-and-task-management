const express = require("express");
const {
  createSpecializare,
  getSpecializari,
  getSpecializare,
  updateSpecializare,
  deleteSpecializare,
  getSpecializariFacultate
} = require("../controllers/controllerSpecializari");

const router = express.Router();

router.get("/", getSpecializari);

router.get("/:id", getSpecializare);

router.post("/", createSpecializare);

router.delete("/:id", deleteSpecializare);

router.patch("/:id", updateSpecializare);

router.get('/facultate/:facultateId', getSpecializariFacultate);

module.exports = router;
