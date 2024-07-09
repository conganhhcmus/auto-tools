const fs = require('fs')
const { remote } = require('webdriverio')
const { resolve } = require('path')
const { findCoordinates } = require('./image')

const MIN = -2;
const MAX = 2;

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Driver {
    constructor(driver, deviceId) {
        this.driver = driver
        this.deviceId = deviceId
    }

    getX = (x, width) => {
        return Math.round((width * x) / 100.0) + getRandomInt(MIN, MAX) // Use a random integer to prevent robot detection during long-term use.
    }

    getY = (y, height) => {
        return Math.round((height * y) / 100.0) + getRandomInt(MIN, MAX) // Use a random integer to prevent robot detection during long-term use.
    }

    getDeviceId = () => {
        return this.deviceId
    }

    getDriver = () => {
        return this.driver
    }

    tap = async (x, y) => {
        const { width, height } = await this.driver.getWindowSize()
        const pointX = this.getX(x, width)
        const pointY = this.getY(y, height)
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
        const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
        while (true) {
            const screenshot = await this.driver.takeScreenshot();

            if (base64regex.test(screenshot)) {
                return fs.writeFileSync(path, screenshot, 'base64')
            }
        }
    }

    action = async (points) => {
        const { width, height } = await this.driver.getWindowSize()
        let action = this.driver
            .action('pointer')
            .move({ duration: Math.round(points[0].duration), x: this.getX(points[0].x, width), y: this.getY(points[0].y, height) })
            .down({ button: 0 })
            .pause(10)

        for (let i = 1; i < points.length; i++) {
            const { duration, x, y } = points[i]
            action = action.move({ duration: Math.round(duration), x: this.getX(x, width), y: this.getY(y, height) })
        }

        await action.up({ button: 0 }).perform()
    }

    haveItemOnScreen = async (itemId) => {
        if (itemId === null || itemId === undefined) return false
        let count = 5
        while (count > 0) {
            count--
            await this.screenshot(resolve(__dirname, `../assets/device/${this.deviceId}.png`))
            const points = await findCoordinates(this.deviceId, itemId)
            if (points.length > 0) return true
        }
        return false
    }

    tapItemOnScreen = async (itemId) => {
        if (itemId === null || itemId === undefined) return
        let count = 5
        while (count > 0) {
            count--
            await this.screenshot(resolve(__dirname, `../assets/device/${this.deviceId}.png`))
            const points = await findCoordinates(this.deviceId, itemId)
            if (points.length <= 0) continue
            return await this.tap(points[points.length - 1].x, points[points.length - 1].y)
        }
    }

    doubleTapItemOnScreen = async (itemId) => {
        if (itemId === null || itemId === undefined) return
        let count = 5
        while (count > 0) {
            count--
            await this.screenshot(resolve(__dirname, `../assets/device/${this.deviceId}.png`))
            const points = await findCoordinates(this.deviceId, itemId)
            if (points.length <= 0) continue
            await this.tap(points[points.length - 1].x, points[points.length - 1].y)
            await this.sleep(0.5)
            await this.tap(points[points.length - 1].x, points[points.length - 1].y)
            return
        }
    }

}

const connectAppium = async (capabilities) => {
    const wdOpts = {
        hostname: process.env.APPIUM_HOST || '0.0.0.0',
        port: parseInt(process.env.APPIUM_PORT, 10) || 4723,
        // path: '/wd/hub',
        logLevel: 'error',
        capabilities: capabilities,
    }
    const driver = await remote(wdOpts)
    return new Driver(driver, capabilities['appium:options'].udid)
}

const KeyCode = {
    HOME: 3,
    BACK: 4,
}

module.exports = {
    KeyCode,
    connectAppium,
}
