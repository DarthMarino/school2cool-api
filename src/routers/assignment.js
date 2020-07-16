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
// /assignments?isTeacher=true
// /assignments?isStudent=true
router.get("/assignments", auth, async (req, res) => {
  try {
    let userClassrooms
    if(req.query.isTeacher) {
      userClassrooms = await Classroom.find({ teacher: req.user._id });
    } else if (req.query.isStudent) {
      userClassrooms = await Classroom.find({ 'students.user': { $eq: req.user._id } });
    } else {
      userClassrooms = await Classroom.find({
        $or: [
          { teacher: req.user._id },
          { 'students.user': { $eq: req.user._id } },
        ],
      });
    }
    
    const userClassroomsIds = []
    for(let index = 0; index < userClassrooms.length; index ++) {
      userClassroomsIds.push(userClassrooms[index]._id)
    }
    const assignments = await Assignment.find({
      classroom: {$in: userClassroomsIds}
    })
    for(let index = 0; index < assignments.length; index ++) {
       await assignments[index].populate('classroom').execPopulate()
       await assignments[index].populate('rubric').execPopulate()
    }
    if (!(Array.isArray(assignments) && assignments.length)) {
      return res.status(404).send(assignments)
    }
    res.status(200).send(assignments);
  } catch (e) {
    res.status(400).send();
  }
});


module.exports = router;
