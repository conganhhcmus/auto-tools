const moment = require('moment')
const fs = require('fs')
const path = require('path')
const { runShell } = require('../utils/shell')

exports.stopAuto = async (req, res, next) => {
    let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/device.json'), 'utf8'))
    let device = req.body.device
    data = data.filter((x) => x.device !== device)

    fs.writeFileSync(path.resolve(__dirname, '../data/device.json'), JSON.stringify(data))
    await stopAuto(device)
    res.json(data)
}

exports.stopAllAuto = async (req, res, next) => {
    let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/device.json'), 'utf8'))
    let listDevices = req.body.listDevices

    for (const device of listDevices) {
        data = data.filter((x) => x.device !== device)
    }

    fs.writeFileSync(path.resolve(__dirname, '../data/device.json'), JSON.stringify(data))

    for await (const device of listDevices) {
        await stopAuto(device)
    }

    res.json(data)
}

exports.startAuto = (req, res, next) => {
    let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/device.json'), 'utf8'))
    const games = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/game.json'), 'utf8'))
    const auto = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/auto.json'), 'utf8'))
    let payload = req.body
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
    fs.writeFileSync(path.resolve(__dirname, '../data/device.json'), JSON.stringify(data))
    startAuto(payload)
    res.json(data)
}

const stopAuto = async (device) => {
    let isSuccess = false
    let maxRun = 5
    while (!isSuccess && maxRun > 0) {
        isSuccess = true
        const processIdList = await runShell(`adb -s ${device} shell pgrep monkey`)
        for (const processId of processIdList.split('\n')) {
            const command = `adb -s ${device} shell kill ${processId}`
            await runShell(command, () => isSuccess = false)
        }
        maxRun--
    }
}

const startAuto = async (payload) => {
    const { selectedDevices, selectedGame } = payload
    const { frequency } = payload.gameOptions
    let logs = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/logs.json'), 'utf8'))

    // clear old logs
    logs = logs.filter((log) => !selectedDevices.includes(log.device))
    logs = logs.concat(selectedDevices.map((device) => ({ device: device, logs: '' })))
    fs.writeFileSync(path.resolve(__dirname, '../data/logs.json'), JSON.stringify(logs))

    let logDevices = logs.filter((x) => selectedDevices.includes(x.device))
    let command = ''
    for (let i = 0; i < frequency; i++) {
        // write logs
        logs = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/logs.json'), 'utf8'))
        logDevices = getDeviceLogs(selectedDevices, logs)

        logDevices.forEach((logDevice) => (logDevice.logs += 'Run ' + (i + 1) + ' times at ' + moment().format('LTS') + '\n'))
        fs.writeFileSync(path.resolve(__dirname, '../data/logs.json'), JSON.stringify(logs))

        // run auto
        let gameState = await getPayload(payload)
        const buffer = new Buffer.from(JSON.stringify(gameState)).toString('base64')
        command = `node src/auto/${selectedGame}/index.js ${buffer} ${i}`
        await runShell(command)
    }
    // write logs
    logs = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/logs.json'), 'utf8'))
    logDevices = getDeviceLogs(selectedDevices, logs)
    logDevices.forEach((logDevice) => (logDevice.logs += 'Exist!!!\n'))
    fs.writeFileSync(path.resolve(__dirname, '../data/logs.json'), JSON.stringify(logs))

    // remove running list
    let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/device.json'), 'utf8'))
    data = data.filter((x) => !selectedDevices.includes(x.device))
    fs.writeFileSync(path.resolve(__dirname, '../data/device.json'), JSON.stringify(data))
}

const getPayload = async (payload) => {
    const { selectedDevices } = payload
    let listRunningDevice = getRunningDevices(selectedDevices)

    return {
        ...payload,
        selectedDevices: listRunningDevice,
    }
}

const getDeviceLogs = (selectedDevices, logs) => {
    let logDevices = logs.filter((x) => selectedDevices.includes(x.device))
    let listAllRunningDevice = getAllRunningDevices()
    let stoppedDevicesLog = logDevices.filter((log) => !listAllRunningDevice.includes(log.device))
    stoppedDevicesLog.forEach((logDevice) => {
        let logString = logDevice.logs.replaceAll('Exist!!!\n', '') + 'Exist!!!\n'
        logDevice.logs = logString
    })

    return logDevices.filter((log) => listAllRunningDevice.includes(log.device))
}

const getRunningDevices = (selectedDevices) => {
    let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/device.json'), 'utf8'))
    let listRunningDevice = data.filter((x) => selectedDevices.includes(x.device)).map((x) => x.device)
    return listRunningDevice
}

const getAllRunningDevices = () => {
    let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/device.json'), 'utf8'))
    let listRunningDevice = data.map((x) => x.device)
    return listRunningDevice
}
