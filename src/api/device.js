const { getDeviceData, readFileData } = require('../service/data')
const { ADBHelper } = require('../lib/adb')
const { resolve } = require('path')
const Promise = require('bluebird')

async function getRunningDevice(req, res, next) {
    const dataRaw = getDeviceData()
    const deviceList = await ADBHelper.getDevices()
    const data = await Promise.all(
        dataRaw.map(async (raw) => {
            const name = deviceList.find((x) => x.id === raw.device).name
            return {
                ...raw,
                deviceName: name,
            }
        })
    )
    res.json(data)
}

async function viewCurrentScreenDevice(req, res, next) {
    const deviceId = req.query.device
    const filePath = resolve(__dirname, `../../screen/${deviceId}.png`)
    await ADBHelper.screenCap(deviceId, filePath)
    const data = readFileData(filePath)

    res.contentType('image/jpeg')
    return res.end(Buffer.from(data, 'binary'))
}

module.exports = {
    getRunningDevice,
    viewCurrentScreenDevice,
}
