const fs = require('fs')
const { remote } = require('webdriverio')
const { resolve } = require('path')
const { findCoordinates } = require('./image')

const MIN = -1
const MAX = 1

const getRandomInt = (min, max) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

class Driver {
    constructor(driver, deviceId) {
        this.driver = driver
        this.deviceId = deviceId
        this.width = 0
        this.height = 0
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
        await this.driver.executeScript('mobile: clickGesture', [{ x: pointX, y: pointY }])
    }

    press = async (key) => {
        await this.driver.executeScript('mobile: pressKey', [{ keycode: key }])
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

    screenshot = async (path) => {
        const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/
        const screenshot = await this.driver.takeScreenshot()
        if (base64regex.test(screenshot)) {
            return fs.writeFileSync(path, screenshot, 'base64')
        }
        return await screenshot(path)
    }

    action = async (points) => {
        const action = this.driver
            .action('pointer', { parameters: { pointerType: 'touch' } })
            .move({ duration: Math.round(points[0].duration), x: this.getX(points[0].x), y: this.getY(points[0].y) })
            .down()
            .pause(100)

        for (let i = 1; i < points.length; i++) {
            const { duration, x, y } = points[i]
            action.move({ duration: Math.round(duration), x: this.getX(x), y: this.getY(y) })
            i === points.length - 1 && action.up()
        }

        return await action.perform()
    }

    haveItemOnScreen = async (itemId) => {
        if (!itemId) return false
        let count = 5
        while (count > 0) {
            count--
            await this.screenshot(resolve(__dirname, `../assets/device/${this.deviceId}.png`))
            const points = await findCoordinates(this.deviceId, itemId)

            if (points.length > 0) return true
            await this.sleep(0.2)
        }
        return false
    }

    getCoordinateItemOnScreen = async (itemId) => {
        if (!itemId) return null

        let count = 5
        while (count > 0) {
            count--
            await this.screenshot(resolve(__dirname, `../assets/device/${this.deviceId}.png`))
            const points = await findCoordinates(this.deviceId, itemId)

            if (points.length > 0) {
                return { x: points[points.length - 1].x, y: points[points.length - 1].y }
            }
            await this.sleep(0.2)
        }

        return null
    }

    tapItemOnScreen = async (itemId) => {
        if (!itemId) return
        let count = 5
        while (count > 0) {
            count--
            await this.screenshot(resolve(__dirname, `../assets/device/${this.deviceId}.png`))
            const points = await findCoordinates(this.deviceId, itemId)

            if (points.length > 0) {
                return await this.tap(points[points.length - 1].x, points[points.length - 1].y)
            }
            await this.sleep(0.2)
        }
    }

    doubleTapItemOnScreen = async (itemId) => {
        if (!itemId) return
        let count = 5
        while (count > 0) {
            count--
            await this.screenshot(resolve(__dirname, `../assets/device/${this.deviceId}.png`))
            const points = await findCoordinates(this.deviceId, itemId)

            if (points.length > 0) {
                await this.tap(points[points.length - 1].x, points[points.length - 1].y)
                await this.sleep(0.5)
                await this.tap(points[points.length - 1].x, points[points.length - 1].y)
                return
            }
            await this.sleep(0.2)
        }
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

module.exports = {
    KeyCode,
    connectAppium,
}
