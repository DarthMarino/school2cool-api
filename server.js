const express = require("express");
const userRouter = require("./src/routers/user");
const classroomRouter = require("./src/routers/classroom");
const rubricRouter = require("./src/routers/rubric");
const assignmentRouter = require("./src/routers/assignment");
const deliverableRouter = require("./src/routers/deliverable");
const evaluationRouter = require("./src/routers/evaluation");
const cors = require("cors");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

require("./src/db/mongoose");

app.use(cors());
app.use(express.json()); // recognize the incoming Request Object as a JSON Object
app.use(userRouter);
app.use(classroomRouter);
app.use(rubricRouter);
app.use(assignmentRouter);
app.use(deliverableRouter);
app.use(evaluationRouter);

app.listen(port, () => {
  console.log("server is up on port " + port);
});
