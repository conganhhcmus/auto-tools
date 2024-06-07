const { writeLogData, getLogData, writeDeviceData, getDeviceData, getGamesData } = require('../utils/data')
const moment = require('moment')
const { ADBHelper } = require('./adb')
const { logErrMsg } = require('../utils/log')

class Runner {
    constructor() {
        this.queue = []
    }
    isRunning = (deviceId) => {
        const logData = getLogData()
        const index = logData.findIndex((x) => x.device == deviceId)
        if (index < 0) return false
        return logData[index].isRunning
    }

    getAutoTool = (gameKey) => {
        const gameOptions = getGamesData()
        if (gameOptions.listGameOption.some((x) => x.key === gameKey && !x.disabled)) {
            return require(`../tools/${gameKey}/index`)
        }
        return null
    }

    push = (deviceId, argv) => {
        this.queue.push({ id: deviceId, params: argv })
        return this
    }

    run = async (deviceId) => {
        const params = this.queue.find((x) => x.id === deviceId).params
        const { frequency } = params.gameOptions

        let logData = getLogData()
        let index = logData.findIndex((x) => x.device == deviceId)
        if (index < 0) {
            logData.push({ device: deviceId, logs: '', isRunning: true })
        } else {
            logData[index] = { device: deviceId, logs: '', isRunning: true }
        }
        writeLogData(logData)

        for (let i = 0; i < frequency; i++) {
            // check running
            if (!this.isRunning(deviceId)) {
                break
            }
            // write log
            let logData = getLogData()
            const index = logData.findIndex((x) => x.device == deviceId)
            logData[index].logs += 'Run ' + (i + 1) + ' times at ' + moment().format('LTS') + '\n'
            writeLogData(logData)

            // run auto
            try {
                const autoTool = this.getAutoTool(params.selectedGame)
                autoTool && (await autoTool({ ...params, index: i }))
            } catch (err) {
                logErrMsg(err.toString())
                break
            }
        }

        logData = getLogData()
        index = logData.findIndex((x) => x.device == deviceId)
        logData[index].logs += 'Finish at ' + moment().format('LTS') + '\n'
        logData[index].isRunning = false
        writeLogData(logData)

        const deviceData = getDeviceData()
        writeDeviceData(deviceData.filter((x) => x.device != deviceId))

        return this
    }

    kill = async (deviceId) => {
        this.queue = this.queue.fill((x) => x.id !== deviceId)
        let logData = getLogData()
        const index = logData.findIndex((x) => x.device === deviceId)
        if (index >= 0) {
            logData[index].isRunning = false
        }

        writeLogData(logData)

        await ADBHelper.killMonkey(deviceId)
        return this
    }

    killAll = async (listDeviceId) => {
        for (const deviceId of listDeviceId) {
            await this.kill(deviceId)
        }
        return this
    }
}

module.exports = {
    Runner,
}
