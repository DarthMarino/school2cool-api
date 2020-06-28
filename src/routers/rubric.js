const express = require("express")
const Rubric = require("../models/rubric")
const auth = require("../middleware/auth")
const mongoose = require("mongoose")
const EvaluativeCriterion = require("../models/evaluativeCriterion")
const EvaluativeCriterionDetail = require("../models/evaluativeCriterionDetail")


const router = new express.Router();

// User can create rubrics
router.post("/rubrics", auth, async (req, res) => {
  const rubric = new Rubric({
    name: req.body.name,
    description: req.body.description,
    minScore: req.body.minScore,
    maxScore: req.body.maxScore,
    user: req.user._id
  });
  try {
    await rubric.save();
    // Creates all evaluation criteria and associate them with the rubric
    req.body.evaluativeCriterion.forEach(async evalCriterion => {
      const evaluativeCriterion = new EvaluativeCriterion({
        name: evalCriterion.name,
        rubric: rubric._id
      })
      await evaluativeCriterion.save()
      // Creates the detail for each evaluation criterion
      evalCriterion.evaluativeCriterionDetail.forEach(async evalCriterionDetail => {
        const evaluativeCriterionDetail = new EvaluativeCriterionDetail({
          ...evalCriterionDetail,
          evaluativeCriterion: evaluativeCriterion._id
        })
        await evaluativeCriterionDetail.save()
      })
    });
    res.status(201).send(rubric);
  } catch (e) {
    res.status(400).send();
  }
});

// Gets all rubrics created by the authenticated user
router.get("/rubrics", auth, async (req, res) => {
  try {
    const rubrics = await Rubric.find({user: req.user._id})
    if (!(Array.isArray(rubrics) && rubrics.length)) {
      return res.status(404).send(rubrics);
    }
    res.status(200).send(rubrics);
  } catch (e) {
    res.status(400).send();
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
    const result = {
        _id: rubric._id,
        name: rubric.name,
        description: rubric.description,
        minScore: rubric.minScore,
        maxScore: rubric.maxScore,
        createdAt: rubric.createdAt
    }
    EvaluativeCriterion.aggregate([{
      $lookup: {
          from: "evaluativecriteriondetails", // collection name in db
          localField: "_id",
          foreignField: "evaluativeCriterion",
          as: "evaluativeCriterionDetail"
      }
      },{
          $match:{
            rubric: rubric._id
          }
      }]).exec(function(err, evaluativeCriteria) {
        result.evaluativeCriterion = evaluativeCriteria
        res.status(200).send(result);
      });
  } catch (e) {
    res.status(400).send();
  }
})

module.exports = router;
