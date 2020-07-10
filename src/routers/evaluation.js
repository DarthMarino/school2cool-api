const express = require("express")
const auth = require("../middleware/auth")
const mongoose = require("mongoose")
const Evaluation = require("../models/evaluation")
const Deliverable = require('../models/deliverable')
const Assignment = require('../models/assignment')
const Rubric = require('../models/rubric')

const router = new express.Router();

const computeEvaluationGrade = async (evaluation) => {
    const deliverable = await Deliverable.findById(evaluation.deliverable)
    const assignment = await Assignment.findById(deliverable.assignment)
    const rubric = await Rubric.findById(assignment.rubric)
    const gradeData = []
    let totalWeight = 0
    rubric.evaluativeCriteria.map((criteria, idxCriteria) => {
      const evaluativeCriteriaDetail = criteria.evaluativeCriteriaDetail.filter((criteriaDetail) => {
        return JSON.stringify(criteriaDetail._id) === JSON.stringify(evaluation.evaluativeCriteriaDetail[idxCriteria].evaluativeCriterionDetail)
      })
      gradeData.push({
        weight: criteria.weight,
        score: evaluativeCriteriaDetail[0].score
      })
      totalWeight += criteria.weight
    })
    let gradeBasedRubricScore = 0
    gradeData.forEach((data) => {
      gradeBasedRubricScore += 
      (totalWeight === 0 || data.score === 0)? 0 
      : data.weight / totalWeight * data.score
    })
    const grade = (rubric.maxScore === 0 || assignment.baseScore === 0)? 0 
          : gradeBasedRubricScore / rubric.maxScore * assignment.baseScore
    return Math.round(grade)
}

router.post("/evaluations", async (req, res) => {
    try {
      const evaluation = new Evaluation(req.body)
      await evaluation.save()
      const grade = await computeEvaluationGrade(evaluation)
      const deliverable = await Deliverable.findById(evaluation.deliverable)
      evaluation.grade = grade
      evaluation.finalGrade = grade - deliverable.missedPointsDelay
      await evaluation.save()
      res.status(201).send(evaluation)
    } catch (e) {
      res.status(400).send(e);
    }
  });

module.exports = router;