const express = require('express')
const app = express()
const path = require('path')
require('dotenv').config({
    path: `${__dirname}/.env.production`,
})

app.use(express.static(path.join(__dirname, 'build')))
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})
app.listen(3000, () => {
    console.log('server is running on port 3000')
})
