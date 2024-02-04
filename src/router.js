const express = require('express')
const router = express.Router()

const settings = require('./api/settings')
const device = require('./api/device')
const auto = require('./api/auto')
const logs = require('./api/logs')

// default
router.get('/', function (req, res) {
    res.send('app is running ...')
})

// settings api
router.get('/settings', settings.getSettings)
router.get('/gameOptions', settings.getGameOptions)
router.get('/listGameOptions', settings.getListGameOptions)

// device api
router.get('/runningDevice', device.getRunningDevice)
router.get('/viewDevice', device.viewCurrentScreenDevice)

// auto api
router.post('/start', auto.startAuto)
router.post('/stop', auto.stopAuto)
router.post('/stopAll', auto.stopAllAuto)

// logs api
router.get('/logs', logs.getLogs)
router.delete('/logs', logs.clearLogs)

module.exports = router
