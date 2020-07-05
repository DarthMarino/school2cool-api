const express = require("express");
const Classroom = require("../models/classroom");
var bodyParser = require("body-parser");
const User = require("../models/user");
const Assignment = require("../models/assignment");
const auth = require("../middleware/auth");
const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const router = new express.Router();

// POST Requests
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

// Add new student to the classroom.
router.post("/classrooms/:classroom_id/add_student", auth, async (req, res) => {
  const classroom_id = req.params.classroom_id;
  const student_id = { user: req.body.student };
  const teacher_auth =
    (await Classroom.find({
      $or: [{ teacher: req.user._id }, { _id: classroom_id }],
    })) != [];
  const already_student =
    (await Classroom.find({
      students: { $elemMatch: { $eq: student_id } },
    })) == [];
  try {
    if (teacher_auth && !already_student) {
      const add_student = await Classroom.updateOne(
        { _id: classroom_id },
        { $push: { students: student_id } }
      );
      res.status(201).send("Added Student Succesfully.");
    } else {
      res.status(201).send("Cannot add student.");
    }
  } catch (e) {
    res.status(400);
  }
});

// GET Requests
// Get all classrooms related to user
// GET /classrooms?teacherOnly=true
router.get("/classrooms", auth, async (req, res) => {
  let classrooms = []
  if(req.query.teacherOnly) {
    classrooms = await Classroom.find({teacher: req.user._id })
  } else {
    classrooms = await Classroom.find({
      $or: [
        { teacher: req.user._id },
        { students: { $elemMatch: { user: req.user._id } } },
      ],
    });
  }
  try {
    res.status(200).send(classrooms);
  } catch (e) {
    res.status(400);
  }
});

// Returns a list with all assignments in the classroom
router.get("/classrooms/:classroom_id/assignments", auth, async (req, res) => {
  const classroom_id = req.params.classroom_id;
  const assignments = await Assignment.find({
    classroom: ObjectId(classroom_id),
  });
  try {
    res.status(200).send(assignments);
  } catch (e) {
    res.status(400);
  }
});

// Returns a list with all students names in the classroom
router.get("/classrooms/:classroom_id/students", auth, async (req, res) => {
  const classroom_id = req.params.classroom_id;
  const students = await Classroom.find(
    {
      _id: ObjectId(classroom_id),
    },
    ["students.user"]
  );
  let students_list = Promise.all(
    students[0].students.map((student) =>
      User.find(
        {
          _id: student.user,
        },
        ["name", "lastName"]
      )
    )
  );
  try {
    res.status(200).send(
      (await students_list).map(([student]) => {
        return { name: student.name, lastName: student.lastName };
      })
    );
  } catch (e) {
    res.status(400);
  }
});

module.exports = router;
