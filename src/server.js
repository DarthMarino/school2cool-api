const express = require("express");
const userRouter = require("./routers/user");
const classroomRouter = require("./routers/classroom");
const rubricRouter = require("./routers/rubric");
const assignmentRouter = require("./routers/assignment");
require("dotenv").config();

const app = express();
const port = process.env.PORT | 3000;

require("./db/mongoose");

app.use(express.json()); // recognize the incoming Request Object as a JSON Object
app.use(userRouter);
app.use(classroomRouter);
app.use(rubricRouter);
app.use(assignmentRouter);

app.listen(port, () => {
  console.log("server is up on port " + port);
});
