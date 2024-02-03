const fs = require('fs')
const path = require('path')
const { runShell } = require('../utils/shell')

exports.getRunningDevice = async function (req, res, next) {
    var dataRaw = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/data.json'), 'utf8'))
    let data = await Promise.all(
        dataRaw.map(async (raw) => ({
            ...raw,
            deviceName: (await runShell(`adb -s ${raw.device} emu avd name | awk '!/OK/'`)).replaceAll('_', ' '),
        }))
    )
    res.json(data)
}

exports.viewCurrentScreenDevice = async function (req, res, next) {
    let deviceId = req.query.device
    await runShell(`adb -s ${deviceId} exec-out screencap -p > src/assets/device/${deviceId}.png`)
    let data = fs.readFileSync(path.resolve(__dirname, `../assets/device/${deviceId}.png`), 'binary')

    res.contentType('image/jpeg')
    return res.end(Buffer.from(data, 'binary'))
}
