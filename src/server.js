const express = require('express')
const userRouter = require('./routers/user')
require("dotenv").config()

const app = express()
const port = process.env.PORT | 3000

require('./db/mongoose')

app.use(express.json()) // recognize the incoming Request Object as a JSON Object
app.use(userRouter)


app.listen(port, () => {
    console.log('server is up on port ' + port)
})