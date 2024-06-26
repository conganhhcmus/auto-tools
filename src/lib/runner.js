const moment = require('moment')
const { ADBHelper } = require('./adb')
const { logErrMsg } = require('../utils/log')
const { resolve } = require('path')
const { runSpawn } = require('../utils/shell')
const Promise = require('bluebird')
const { writeLogData, getLogData, writeDeviceData, getDeviceData, getGamesData } = require('../utils/data')

class Runner {
    constructor() {
        this.queue = []
    }

    runAutoTool = (params) => {
        const { selectedGame, deviceId } = params
        const gameOptions = getGamesData()
        if (gameOptions.listGameOption.some((x) => x.key === selectedGame && !x.disabled)) {
            const filePath = resolve(__dirname, `../tools/${selectedGame}/index.js`)
            const data = new Buffer.from(JSON.stringify(params)).toString('base64')
            const runnerIndex = this.queue.findIndex((x) => x.id === deviceId)

            return new Promise((resolve, reject) => {
                const childProcess = runSpawn(
                    `node ${filePath} ${data}`,
                    (err) => reject(err),
                    (code, signal) => {
                        if (signal === 'SIGINT') {
                            return reject(new Error('Kill process'))
                        }
                        if (code !== 0) {
                            return reject(new Error(`Failed with code = ${code}`))
                        }
                        return resolve('done')
                    }
                )

                this.queue[runnerIndex].childProcess = childProcess
            })
        }
        return Promise.reject(new Error('Not found auto file!'))
    }

    push = (deviceId, argv) => {
        this.queue.push({ id: deviceId, params: argv, childProcess: null })
        return this
    }

    run = async (deviceId) => {
        const params = this.queue.find((x) => x.id === deviceId).params
        const { frequency } = params.gameOptions

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
                await this.runAutoTool({ ...params, index: i })
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
        this.queue = this.queue.fill((x) => x.id !== deviceId)

        return this
    }

    kill = async (deviceId) => {
        const runner = this.queue.find((x) => x.id === deviceId)
        runner.childProcess.stdin.end()
        runner.childProcess.kill('SIGINT')

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
