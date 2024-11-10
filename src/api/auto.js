const { Runner } = require('../lib/runner')
const { getDeviceData, getGamesData, getAutoData, writeDeviceData } = require('../service/data')

const runner = new Runner()

const startAuto = async (req, res, next) => {
    let data = getDeviceData()
    const games = getGamesData()
    const auto = getAutoData()
    const payload = req.body
    let newData = []
    payload.selectedDevices.forEach((device) => {
        newData.push({
            device: device,
            game: games.listGameOption.find((x) => x.key === payload.selectedGame).name,
            runAuto: auto[payload.selectedGame].find((x) => x.key === payload.gameOptions.runAuto).name,
            gameOptions: payload.gameOptions,
        })
    })
    data = data.concat(newData)
    writeDeviceData(data)
    const { selectedDevices, ...params } = payload

    for (const device of payload.selectedDevices) {
        params.deviceId = device
        runner.push(device, params)
        runner.run(device)
    }

    res.json(data)
}

const stopAuto = async (req, res, next) => {
    let data = getDeviceData()
    const device = req.body.device
    data = data.filter((x) => x.device !== device)
    writeDeviceData(data)
    await runner.kill(device)
    res.json(data)
}

const stopAllAuto = async (req, res, next) => {
    let data = getDeviceData()
    const listDevices = req.body.listDevices
    for (const device of listDevices) {
        data = data.filter((x) => x.device !== device)
    }
    writeDeviceData(data)
    await runner.killAll(listDevices)
    res.json(data)
}

module.exports = {
    startAuto,
    stopAllAuto,
    stopAuto,
}
