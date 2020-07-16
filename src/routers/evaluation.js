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

router.post("/evaluations", auth, async (req, res) => {
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

  router.get("/evaluations/assignment/:id", auth, async (req, res) => {
    try {
      const deliverable = await Deliverable.findOne({assignment: req.params.id, student: req.user._id})
      if(!deliverable) {
        res.status(404).send(deliverable);
      }
      const evaluation = await Evaluation.findOne({deliverable: deliverable._id})
      if(!evaluation) {
        res.status(404).send(evaluation);
      }
      const assignment = await Assignment.findById(req.params.id)
      const rubric = await Rubric.findById(assignment.rubric)
      const evaluationData = []
      rubric.evaluativeCriteria.map((criteria, idxCriteria) => {
        const evaluativeCriteriaDetail = criteria.evaluativeCriteriaDetail.filter((criteriaDetail) => {
          return JSON.stringify(criteriaDetail._id) === JSON.stringify(evaluation.evaluativeCriteriaDetail[idxCriteria].evaluativeCriterionDetail)
        })
        evaluationData.push({
          name: criteria.name,
          weight: criteria.weight,
          score: evaluativeCriteriaDetail[0].score,
          qualityDefinition: evaluativeCriteriaDetail[0].qualityDefinition
        })
    })
    const otherEvaluationData = {
      evaluationDate: evaluation.createdAt, 
      missedPointsDelay: deliverable.missedPointsDelay,
      grade: evaluation.grade,
      finalGrade: evaluation.finalGrade,
      baseScore: assignment.baseScore,
      minScore: rubric.minScore,
      maxScore: rubric.maxScore,
      comment: evaluation.comment
    }
      res.send({ evaluationData, otherEvaluationData })
    } catch (e) {
      res.status(400).send(e);
    }
  });
module.exports = router;