const { Adb } = require('@devicefarmer/adbkit')
const Bluebird = require('bluebird')

const { MonkeyRunner } = require('./monkey')
const { findCoordinates } = require('./image')
const { resolve } = require('path')
const { isMacOS } = require('../utils/platform')
const { runExec } = require('../utils/shell')
const fs = require('fs')

const client = Adb.createClient({ port: process.env.ADB_PORT || 5037, host: process.env.ADB_HOST || '127.0.0.1' })
const monkeyPort = process.env.MONKEY_PORT || 1080

class ADBHelper {
    static openApp = async (deviceId, packageName) => {
        const device = client.getDevice(deviceId)
        await device.shell(`monkey -p ${packageName} 1`).then(Adb.util.readAll)
    }

    static closeApp = async (deviceId, packageName) => {
        const device = client.getDevice(deviceId)
        await device.shell(`am force-stop ${packageName}`).then(Adb.util.readAll)
    }

    static openMonkey = async (deviceId) => {
        // kill all process monkey
        await ADBHelper.killMonkey(deviceId)

        // create monkey instance
        const device = client.getDevice(deviceId)

        const monkey = await device.openMonkey(monkeyPort)
        const vmSize = await ADBHelper.getVMSize(deviceId)
        return new MonkeyRunner(monkey, vmSize)
    }

    static killMonkey = async (deviceId) => {
        const device = client.getDevice(deviceId)
        let maxRun = 2
        while (maxRun > 0) {
            // kill all process monkey
            await device.shell('kill $(pgrep monkey)').then(Adb.util.readAll)
            maxRun--
        }
    }

    static getVMSize = async (deviceId) => {
        const device = client.getDevice(deviceId)
        const sizeText = (await device.shell('wm size').then(Adb.util.readAll)).toString('utf-8')
        const sizeArr = sizeText
            .replace(/[^\d.^x]/g, '')
            .split('x')
            .map((x) => parseInt(x))

        return {
            width: sizeArr[0],
            height: sizeArr[1],
        }
    }

    static tapByImg = async (deviceId, itemId) => {
        if (itemId === null || itemId === undefined) return
        let count = 5
        while (count > 0) {
            count--
            await ADBHelper.screenCap(deviceId, resolve(__dirname, `../assets/device/${deviceId}.png`))
            const points = await findCoordinates(deviceId, itemId)
            if (points.length <= 0) continue
            const device = client.getDevice(deviceId)
            return await device.shell(`input tap ${points[0].x} ${points[0].y}`)
        }
    }

    static haveItemOnScreen = async (deviceId, itemId) => {
        if (itemId === null || itemId === undefined) return false
        let count = 5
        while (count > 0) {
            count--
            await ADBHelper.screenCap(deviceId, resolve(__dirname, `../assets/device/${deviceId}.png`))
            const points = await findCoordinates(deviceId, itemId)
            if (points.length > 0) return true
        }
        return false
    }

    static getDevices = async () => {
        const devices = await client.listDevices()
        return await Bluebird.map(devices, async (_) => {
            if (isMacOS) {
                const output = await runExec(`adb -s ${_.id} emu avd name`)
                return {
                    id: _.id,
                    name: output.match(/([^\r\n|OK]+)/g)[0].replaceAll('_', ' '),
                }
            }
            return {
                id: _.id,
                name: _.id,
            }
        })
    }

    static screenCap = async (deviceId, path) => {
        const device = client.getDevice(deviceId)
        const data = await device.screencap().then(Adb.util.readAll)

        fs.writeFileSync(path, Buffer.from(data), 'binary')
    }
}

module.exports = {
    ADBHelper,
}
