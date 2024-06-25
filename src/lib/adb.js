const { Adb } = require('@devicefarmer/adbkit')
const Bluebird = require('bluebird')

const { isMacOS } = require('../utils/platform')
const { runExecAsync } = require('../utils/shell')
const fs = require('fs')

const client = Adb.createClient({ port: process.env.ADB_PORT || 5037, host: process.env.ADB_HOST || '127.0.0.1' })

class ADBHelper {
    static getDevices = async () => {
        const devices = await client.listDevices()
        return await Bluebird.map(devices, async (_) => {
            if (isMacOS) {
                const output = await runExecAsync(`adb -s ${_.id} emu avd name`)
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
