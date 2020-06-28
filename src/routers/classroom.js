const express = require("express");
const Classroom = require("../models/classroom");
var bodyParser = require("body-parser");
const User = require("../models/user");
const auth = require("../middleware/auth");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const router = new express.Router();

// Form to create a classroom.
router.post("/classrooms/create", auth, async (req, res) => {
  const classroom = new Classroom({
    ...req.body,
    teacher: req.user._id,
  });
  try {
    await classroom.save();
    res.status(201).send(classroom);
  } catch (e) {
    res.status(400);
  }
});

// Get all classrooms related to user
router.get("/classrooms", auth, async (req, res) => {
  // const classrooms = Classroom.find({
  //   $or: [{ "teacher._id": req.user._id }, { "student._id": req.user._id }],
  // });
  const student = await Classroom.find({
    $or: [
      { teacher: req.user._id },
      { students: { $elemMatch: { $eq: req.user._id } } },
    ],
  });
  console.log(student);
  try {
    res.status(201).send(classroom);
  } catch (e) {
    res.status(400);
  }
});

// Returns a list with all students names in the classroom
router.get("/classrooms/:classroom_id/students", auth, async (req, res) => {
  const classroom_id = request.params.classroom_id;
  const students = await Classroom.find({
    classroom: ObjectId(classroom_id),
  });
  try {
    res.status(201).send(students);
  } catch (e) {
    res.status(400);
  }
});

module.exports = router;
