const moment = require('moment')
const { logErrMsg } = require('../service/log')
const { connectAppium } = require('./webdriverio')
const { writeLogData, getLogData, writeDeviceData, getDeviceData, getGamesData } = require('../service/data')

class Runner {
    constructor() {
        this.queue = []
    }

    getAutoTool = (gameKey) => {
        const gameOptions = getGamesData()
        if (gameOptions.listGameOption.some((x) => x.key === gameKey && !x.disabled)) {
            return require(`../tools/${gameKey}/index`)
        }
        return null
    }

    push = (deviceId, argv) => {
        this.queue.push({ id: deviceId, params: argv, driver: null })
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

        const capabilities = {
            platformName: 'Android',
            'appium:options': {
                udid: deviceId,
                automationName: 'UiAutomator2',
                noReset: true,
                disableWindowAnimation: true,
                suppressKillServer: true,
                clearDeviceLogsOnStart: true,
                skipLogcatCapture: true,
                allowDelayAdb: false
            },
        }

        const driver = await connectAppium(capabilities)
        const runnerIndex = this.queue.findIndex((x) => x.id === deviceId)
        this.queue[runnerIndex].driver = driver

        for (let i = 0; i < frequency; i++) {
            // write log
            let logData = getLogData()
            const index = logData.findIndex((x) => x.device == deviceId)
            logData[index].logs += 'Run ' + (i + 1) + ' times at ' + moment().format('LTS') + '\n'
            writeLogData(logData)

            // run auto
            try {
                await driver.startRecordingScreen()
                const autoTool = this.getAutoTool(params.selectedGame)
                autoTool && (await autoTool({ ...params, index: i }, driver))
            } catch (err) {
                logErrMsg(err.toString())
                break
            } finally {
                let key = i % 2 // save up to 2 video
                await driver.stopRecordingScreen(key)
            }
        }

        logData = getLogData()
        index = logData.findIndex((x) => x.device == deviceId)
        logData[index].logs += 'Finish at ' + moment().format('LTS') + '\n'
        writeLogData(logData)

        const deviceData = getDeviceData()
        writeDeviceData(deviceData.filter((x) => x.device != deviceId))
        this.queue = this.queue.filter((x) => x.id !== deviceId)

        return this
    }

    kill = async (deviceId) => {
        const runner = this.queue.find((x) => x.id === deviceId)
        await runner.driver.finish()

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
