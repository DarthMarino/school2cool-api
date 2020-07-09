const express = require("express")
const auth = require("../middleware/auth")
const mongoose = require("mongoose")
const multer = require("multer")
const Deliverable = require("../models/deliverable")

const router = new express.Router();

const upload = multer({
  // limits: {
  //   fileSize: 1000000
  // },
  fileFilter(req, file, cb) {
      // TODO: allow other file extensions
      if(!file.originalname.match(/\.(pdf)$/)) {
          return cb(new Error('Please upload a pdf'))
      }
      cb(undefined, true)
  }
})
// TODO: check if the user is allowed to submit this assignment
// the id in the params is the assignment id.
router.post("/deliverables/assignment/:id", auth, upload.single('file'), async (req, res) => {
  try {
      let deliverable = await Deliverable.findOne({assignment: req.params.id, student: req.user._id})
      if (!deliverable) {
          deliverable = new Deliverable({
          file: req.file.buffer,
          assignment: req.params.id,
          student: req.user._id
        })
      } else {
        deliverable.file = req.file.buffer
      }
      await deliverable.save()
      res.send(deliverable)
    } catch (e) {
      res.status(400).send()
    }
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})
// get the file in a deliverable by the assignment's and user's id
router.get("/deliverables/assignment/:id", auth, async (req, res) => {
    try {
      const deliverable = await Deliverable.findOne({assignment: req.params.id, student: req.user._id})
      if (!deliverable || !deliverable.file) {
        throw new Error()
      }
      res.set('Content-Type', 'application/pdf')
      res.send(deliverable.file)
    } catch (e) {
      res.status(404).send()
    }
})

module.exports = router;