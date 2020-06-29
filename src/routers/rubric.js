const express = require("express")
const Rubric = require("../models/rubric")
const auth = require("../middleware/auth")
const mongoose = require("mongoose")

const router = new express.Router();

// User can create rubrics
router.post("/rubrics", auth, async (req, res) => {
  const rubric = new Rubric({
    ...req.body,
    user: req.user._id
  });
  try {
    await rubric.save()
    res.status(201).send(rubric)
  } catch (e) {
    res.status(400).send()
  }
});

// Gets all rubrics created by the authenticated user
router.get("/rubrics", auth, async (req, res) => {
  try {
    const rubrics = await Rubric.find({user: req.user._id})
    if (!(Array.isArray(rubrics) && rubrics.length)) {
      return res.status(404).send(rubrics)
    }
    res.status(200).send(rubrics)
  } catch (e) {
    res.status(400).send()
  }
})

// Get a rubric by it's _id.
router.get("/rubrics/:id", auth, async (req, res) => {
  try {
    const rubric = await Rubric.findById(req.params.id)
    // Only the user who created the rubric can access it.
    if(JSON.stringify(rubric.user) != JSON.stringify(req.user._id)) {
      return res.status(401).send()
    }
    res.status(200).send(rubric)
  } catch (e) {
    res.status(400).send()
  }
})

module.exports = router;
