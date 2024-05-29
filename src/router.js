const { Router } = require('express')
const router = Router()

const { getSettings, getGameOptions, getListGameOptions } = require('./api/settings')
const { getRunningDevice, viewCurrentScreenDevice } = require('./api/device')
const { startAuto, stopAuto, stopAllAuto } = require('./api/auto')
const { getLogs, clearLogs } = require('./api/logs')

// default
router.get('/', function (req, res) {
    res.send('app is running ...')
})

// settings api
router.get('/settings', getSettings)
router.get('/gameOptions', getGameOptions)
router.get('/listGameOptions', getListGameOptions)

// device api
router.get('/runningDevice', getRunningDevice)
router.get('/viewDevice', viewCurrentScreenDevice)

// auto api
router.post('/start', startAuto)
router.post('/stop', stopAuto)
router.post('/stopAll', stopAllAuto)

// logs api
router.get('/logs', getLogs)
router.delete('/logs', clearLogs)

module.exports = router
