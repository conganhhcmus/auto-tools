const moment = require('moment')
const express = require('express')
require('express-async-errors')
const router = require('./router')
const websocket = require('./websocket')
const path = require('path')
const fs = require('fs')
const app = express()
require('express-ws')(app)
const port = process.env.PORT || 8080

// UI
app.use(express.static(path.join(__dirname, '../dist')))
app.use(express.json())

// API
app.use('/api', router)

// Web Socket
app.ws('/live/:id', websocket.getLiveScreen)

// Error Handler
app.use((err, req, res, next) => {
    fs.appendFileSync(path.resolve(__dirname, 'logs/err.txt'), moment().format('LTS') + " : ")
    fs.appendFileSync(path.resolve(__dirname, 'logs/err.txt'), err.stack)
    res.status(500).send(err.stack)
})

app.listen(port, function () {
    console.log('Your app running on http://localhost:' + port)
})

// clear old data
fs.writeFileSync(path.resolve(__dirname, 'data/logs.json'), '[]')
fs.writeFileSync(path.resolve(__dirname, 'data/device.json'), '[]')

// clear logs when server start
fs.writeFileSync(path.resolve(__dirname, 'logs/out.txt'), '')
fs.writeFileSync(path.resolve(__dirname, 'logs/err.txt'), '')
