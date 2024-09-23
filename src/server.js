const express = require('express')
require('express-async-errors')
const router = require('./router')
const { getLiveScreen } = require('./websocket')
const { join } = require('path')
const { clearErrMsg, clearInfoMsg, logErrMsg } = require('./utils/log')
const { writeDeviceData, writeLogData } = require('./utils/data')
const expressWs = require('express-ws')

const app = express()
expressWs(app)
const port = process.env.PORT || 8080

// UI
app.use(express.static(join(__dirname, '../dist')))
app.use(express.json())

// API
app.use('/api', router)

// Web Socket
app.ws('/live/:id', getLiveScreen)

// Error Handler
app.use((err, req, res, next) => {
    logErrMsg(err.stack)
    res.status(500).send(err.stack)
})

app.listen(port, function () {
    console.log('Your app running on http://localhost:' + port)
})

// clear old data
writeDeviceData([])
writeLogData([])

// clear logs when server start
clearErrMsg()
clearInfoMsg()
