const Bluebird = require('bluebird')
const { runExecAsync, runSpawn } = require('../helper/shell')
const { logErrMsg } = require('../service/log')

const getDeviceNameById = async (deviceId) => {
    if (!deviceId.includes("emulator")) return deviceId
    try {
        switch (process.platform) {
            case 'darwin':
                const output = await runExecAsync(`adb -s ${deviceId} emu avd name`)
                return output.match(/([^\r\n]+)/g)[0].replaceAll('_', ' ')
            default:
                return deviceId
        }
    }
    catch (err) {
        logErrMsg(`Error getting device - ${deviceId}: ${err.message}`)
        return deviceId
    }
}

class ADBHelper {
    static getDevices = async () => {
        const ignoreText = ['device', 'offline']
        const output = await runExecAsync(`adb devices`)
        const deviceIds = output
            .substring(output.indexOf('\n') + 1)
            .match(/[\S]+/g)
            ?.filter((text) => !ignoreText.includes(text)) ?? []

        return await Bluebird.map(deviceIds, async (id) => ({
            id: id,
            name: await getDeviceNameById(id),
        }))
    }

    static screenCap = async (deviceId, path) => await runExecAsync(`adb -s ${deviceId} exec-out screencap -p > ${path}`)

    static screenRecord = (deviceId, outputHandler = null) => {
        const streamProcess = runSpawn(`adb -s ${deviceId} exec-out screenrecord --output-format=h264 -`)
        streamProcess.stdout.on('data', (data) => {
            outputHandler && outputHandler(data)
        })

        return streamProcess
    }
}

module.exports = {
    ADBHelper,
}
