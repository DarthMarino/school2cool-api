const express = require("express")
const Assignment = require("../models/assignment")
const auth = require("../middleware/auth")
const mongoose = require("mongoose")
const Classroom = require('../models/classroom')

const router = new express.Router();

// User can create assignments
router.post("/assignments", auth, async (req, res) => {
  const assignment = new Assignment(req.body);
  try {
    /// TODO: add logic validations
    // ex: is the user the classroom teacher?
    // ex: did the user create that rubric?
    // dates validations
    await assignment.save();
    res.status(201).send(assignment);
  } catch (e) {
    res.status(400).send();
  }
});

// Get assignment by it's _id
router.get("/assignments/:id", auth, async (req, res) => {
  try {
    /// TODO: add logic validations
    // ex: are you allow to access that assignment?
    const assignment = await Assignment.findById(req.params.id)
    if(!assignment) {
      return res.status(404).send();
    }
    res.status(200).send(assignment);
  } catch (e) {
    res.status(400).send();
  }
});

// Get all authenticated user's assignments
router.get("/assignments", auth, async (req, res) => {
  try {
    const userClassrooms = await Classroom.find({
      $or: [
        { teacher: req.user._id },
        { 'students.user': { $eq: req.user._id } },
      ],
    });
    const userClassroomsIds = []
    for(let index = 0; index < userClassrooms.length; index ++) {
      userClassroomsIds.push(userClassrooms[index]._id)
    }
    const assignmnets = await Assignment.find({
      classroom: {$in: userClassroomsIds}
    })
    res.status(200).send(assignmnets);
  } catch (e) {
    res.status(400).send();
  }
});


module.exports = router;
