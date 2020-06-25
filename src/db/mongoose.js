require("dotenv").config()
const mongoose = require('mongoose')

const mongodbURI = process.env.mongodbURI

mongoose.connect(mongodbURI, {
    useNewUrlParser: true,
    useCreateIndex: true, // to create indexes automatically
   // useUnifiedTopology: true --> don't use this. Unstable
})