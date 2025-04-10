const { remote } = require('webdriverio')
const { resolve } = require('path')
const { findCoordinates } = require('./image')
const { logErrMsg } = require('../service/log')

const MIN = -1
const MAX = 1
const MAX_RETRY = 3
const TAP_HOLD_TIME = 50 // or 30 for faster response
const Base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/
const SupportRecordVideo = false

const getRandomInt = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

const getSafeDuration = (duration) => Math.max(20, Math.round(duration))

class Driver {
    constructor(driver, deviceId) {
        this.driver = driver
        this.deviceId = deviceId
        this.width = 0
        this.height = 0
    }

    startRecordingScreen = async () => {
        if (!SupportRecordVideo) {
            return
        }
        await this.driver.startRecordingScreen({ timeLimit: 30 * 60 })
    }

    stopRecordingScreen = async (key) => {
        if (!SupportRecordVideo) {
            return
        }
        let path = resolve(__dirname, `../../screen/${this.deviceId}_${key}.mp4`)
        try {
            await this.driver.saveRecordingScreen(path)
        } catch (err) {
            logErrMsg(`Error saving recording to ${this.deviceId}_${key}: ${err.toString()}`)
        }
    }

    setCurrentWindowSize = async () => {
        const { width, height } = await this.driver.getWindowSize()
        this.width = width
        this.height = height
    }

    getX = (x) => {
        return Math.round((this.width * x) / 100.0) + getRandomInt(MIN, MAX) // Use a random integer to prevent robot detection during long-term use.
    }

    getY = (y) => {
        return Math.round((this.height * y) / 100.0) + getRandomInt(MIN, MAX) // Use a random integer to prevent robot detection during long-term use.
    }

    tap = async (x, y) => {
        const pointX = this.getX(x)
        const pointY = this.getY(y)
        await this.driver.executeScript('mobile:clickGesture', [{ x: pointX, y: pointY }])
    }

    press = async (key) => {
        await this.driver.executeScript('mobile:pressKey', [{ keycode: key }])
    }

    finish = async () => {
        await this.driver.deleteSession()
    }

    openApp = async (id) => {
        await this.driver.executeScript('mobile:activateApp', [{ appId: id }])
    }

    closeApp = async (id) => {
        await this.driver.executeScript('mobile:terminateApp', [{ appId: id, options: { timeout: 5000 } }])
    }

    sleep = async (s) => {
        await this.driver.pause(s * 1000)
    }

    swipe = async (pointA, pointB, direction) => {
        const w = Math.abs(pointA.x - pointB.x)
        const h = Math.abs(pointA.y - pointB.y)
        await this.driver.executeScript('mobile:swipeGesture', [
            {
                left: this.getX(pointA.x),
                top: this.getY(pointA.y),
                width: this.getX(w > 0 ? w : 1),
                height: this.getY(h > 0 ? h : 1),
                direction: direction,
                percent: 1.0,
            },
        ])
    }

    screenshot = async () => {
        const screenshot = await this.driver.takeScreenshot()
        if (Base64Regex.test(screenshot)) {
            return new Buffer.from(screenshot, 'base64')
        }
        return await screenshot()
    }

    action = async (points) => {
        let actionChain = this.driver.action('pointer', { parameters: { pointerType: 'touch' } })
        const startPoint = points[0]
        actionChain = actionChain
            .move({ duration: getSafeDuration(startPoint.duration), x: this.getX(startPoint.x), y: this.getY(startPoint.y) })
            .down()
            .pause(TAP_HOLD_TIME)

        for (let i = 1; i < points.length - 1; i++) {
            const { duration, x, y } = points[i]
            actionChain = actionChain
                .move({ duration: getSafeDuration(duration), x: this.getX(x), y: this.getY(y) })
        }

        const lastPoint = points[points.length - 1]
        actionChain = actionChain
            .move({ duration: getSafeDuration(lastPoint.duration), x: this.getX(lastPoint.x), y: this.getY(lastPoint.y) })
            .pause(TAP_HOLD_TIME)
            .up()

        await actionChain.perform()
    }

    haveItemOnScreen = async (itemFilePath, findPosition = null) => {
        if (!itemFilePath) return false
        let count = 0
        while (++count < MAX_RETRY) {
            let data = await this.screenshot()
            const points = await findCoordinates(data, itemFilePath, findPosition)

            if (points.length > 0) return true
            await this.sleep(0.2)
        }
        return false
    }

    getCoordinateItemOnScreen = async (itemFilePath, findPosition = null) => {
        if (!itemFilePath) return null
        let count = 0
        while (++count < MAX_RETRY) {
            let data = await this.screenshot()
            const points = await findCoordinates(data, itemFilePath, findPosition)

            if (points.length > 0) {
                return { x: points[points.length - 1].x, y: points[points.length - 1].y }
            }
            await this.sleep(0.2)
        }

        return null
    }

    tapItemOnScreen = async (itemFilePath, findPosition = null) => {
        if (!itemFilePath) return
        let count = 0
        while (++count < MAX_RETRY) {
            let data = await this.screenshot()
            const points = await findCoordinates(data, itemFilePath, findPosition)

            if (points.length > 0) {
                await this.tap(points[points.length - 1].x, points[points.length - 1].y)
                return true
            }
            await this.sleep(0.2)
        }

        return false
    }
}

const connectAppium = async (capabilities) => {
    const wdOpts = {
        hostname: process.env.APPIUM_HOST || '0.0.0.0',
        port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
        path: '/wd/hub',
        logLevel: 'error',
        capabilities: capabilities,
    }
    const driver = await remote(wdOpts)
    const deviceId = capabilities['appium:options'].udid

    return new Driver(driver, deviceId)
}

const KeyCode = {
    HOME: 3,
    BACK: 4,
}

const SwipeDirection = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right',
}

module.exports = {
    KeyCode,
    SwipeDirection,
    connectAppium,
}
