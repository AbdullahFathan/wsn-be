const express = require("express");
const router = express.Router();
const {
  getAllSensor,
  getSensorById,
  createSensor,
} = require("../controller/sensor.controller.js");

router.post("/", createSensor);

module.exports = router;
