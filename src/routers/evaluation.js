const express = require("express")
const auth = require("../middleware/auth")
const mongoose = require("mongoose")
const Evaluation = require("../models/evaluation")

const router = new express.Router();

router.post("/evaluations", async (req, res) => {
    try {
      const evaluation = new Evaluation(req.body)
      await evaluation.save()
      // TODO: calculate grade.
      res.status(201).send(evaluation)
    } catch (e) {
      res.status(400).send(e);
    }
  });

module.exports = router;
  