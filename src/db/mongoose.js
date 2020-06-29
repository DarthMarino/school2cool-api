require("dotenv").config();
const mongoose = require("mongoose");

const mongodbURI = process.env.mongodbURI;
mongoose.set("useUnifiedTopology", true);
mongoose.connect(mongodbURI, {
  useNewUrlParser: true,
  useCreateIndex: true,
});
