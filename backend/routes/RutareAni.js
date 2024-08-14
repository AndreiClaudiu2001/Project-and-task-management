const express = require("express");
const {
  createAn,
  getAni,
  getAn,
  updateAn,
  deleteAn,
} = require("../controllers/controllerAni");

const router = express.Router();

router.get("/", getAni);

router.get("/:id", getAn);

router.post("/", createAn);

router.delete("/:id", deleteAn);

router.patch("/:id", updateAn);

module.exports = router;
