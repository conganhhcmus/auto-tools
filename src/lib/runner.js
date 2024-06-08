const { writeLogData, getLogData, writeDeviceData, getDeviceData, getGamesData } = require('../utils/data')
const moment = require('moment')
const { ADBHelper } = require('./adb')
const { logErrMsg } = require('../utils/log')
const { resolve } = require('path')
const { runSpawn } = require('../utils/shell')
const Promise = require('bluebird')

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

    runAutoTool = (params) => {
        const { selectedGame } = params
        const gameOptions = getGamesData()
        if (gameOptions.listGameOption.some((x) => x.key === selectedGame && !x.disabled)) {
            const filePath = resolve(__dirname, `../tools/${selectedGame}/index.js`)
            const data = new Buffer.from(JSON.stringify(params)).toString('base64')
            return new Promise((resolve, reject, onCancel) => {
                const childProcess = runSpawn(
                    `node ${filePath} ${data}`,
                    (err) => reject(err),
                    (code) => resolve(code)
                )

                onCancel(() => {
                    childProcess.kill()
                    reject(new Error('Kill process'))
                })
            })
        }
        return Promise.reject(new Error('Not found auto file!'))
    }

    push = (deviceId, argv) => {
        this.queue.push({ id: deviceId, params: argv, promise: null })
        return this
    }

    run = async (deviceId) => {
        const runnerIndex = this.queue.findIndex((x) => x.id === deviceId)
        const { frequency } = this.queue[runnerIndex].params.gameOptions

        let logData = getLogData()
        let index = logData.findIndex((x) => x.device == deviceId)
        if (index < 0) {
            logData.push({ device: deviceId, logs: '' })
        } else {
            logData[index] = { device: deviceId, logs: '' }
        }
        writeLogData(logData)

        for (let i = 0; i < frequency; i++) {
            // write log
            let logData = getLogData()
            const index = logData.findIndex((x) => x.device == deviceId)
            logData[index].logs += 'Run ' + (i + 1) + ' times at ' + moment().format('LTS') + '\n'
            writeLogData(logData)

            // run auto
            try {
                this.queue[runnerIndex].promise = this.runAutoTool({ ...this.queue[runnerIndex].params, index: i })
                await this.queue[runnerIndex].promise
            } catch (err) {
                logErrMsg(err.toString())
                break
            }
        }

        logData = getLogData()
        index = logData.findIndex((x) => x.device == deviceId)
        logData[index].logs += 'Finish at ' + moment().format('LTS') + '\n'
        writeLogData(logData)

        const deviceData = getDeviceData()
        writeDeviceData(deviceData.filter((x) => x.device != deviceId))

        return this
    }

    kill = async (deviceId) => {
        const runner = this.queue.find((x) => x.id === deviceId)
        runner.promise.cancel()

        this.queue = this.queue.fill((x) => x.id !== deviceId)
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
