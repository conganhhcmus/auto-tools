const { getDeviceData, getGamesData, getAutoData } = require('../service/data')
const { ADBHelper } = require('../lib/adb')

async function getSettings(req, res, next) {
    const data = getDeviceData()
    const games = getGamesData()

    const runningDevices = data.map((x) => x.device)
    const deviceList = await ADBHelper.getDevices()
    let result = {
        listDevices: deviceList.map((device) => ({
            value: device.id,
            label: device.name,
            disabled: runningDevices.includes(device.id),
        })),
        listGameOption: [...games.listGameOption],
    }
    res.json(result)
}

function getGameOptions(req, res, next) {
    let auto = getAutoData()
    let game = req.query.game
    let result = auto.hasOwnProperty(game) ? auto[game] : []
    res.json(result)
}

function getListGameOptions(req, res, next) {
    let games = getGamesData()
    let result = { ...games }
    res.json(result)
}

module.exports = {
    getSettings,
    getGameOptions,
    getListGameOptions,
}
