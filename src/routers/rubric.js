const express = require("express");
const Rubric = require("../models/rubric");
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

const router = new express.Router();

// the user creates a rubric
// 1. recibe los criterios de evaluacion?
// // ej:
// {
//     "name": "Evaluacion de presentaciones",
//     "description": "una descripcion",
//     "minScore":,
//     "maxScore":,
//     // "user":, the user creating the rubric
// }
router.post("/rubrics/", auth, async (req, res) => {
  const rubric = new Rubric(req.body);
  try {
    await rubric.save();
    res.status(201).send();
  } catch (e) {
    res.status(400).send();
  }
});

module.exports = router;
