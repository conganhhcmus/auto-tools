const express = require('express')
require('express-async-errors')
const router = require('./router')
const path = require('path')
const fs = require('fs')
const app = express()
const port = process.env.PORT || 8080

// UI
app.use(express.static(path.join(__dirname, '../dist')))
app.use(express.json())

// API
app.use('/api', router)

// Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send(err.stack)
})

app.listen(port, function () {
    console.log('Your app running on http://localhost:' + port)
})

// clear logs when server start
fs.writeFileSync(path.resolve(__dirname, 'logs/out.txt'), '')
fs.writeFileSync(path.resolve(__dirname, 'logs/err.txt'), '')