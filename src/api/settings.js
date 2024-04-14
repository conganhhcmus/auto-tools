const fs = require('fs')
const path = require('path')
const { runShell } = require('../utils/shell')

exports.getSettings = async function (req, res, next) {
    let data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/data.json'), 'utf8'))
    let games = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/game.json'), 'utf8'))

    let runningDevices = data.map((x) => x.device)
    let output = await runShell('adb devices')
    let listDevices = output.match(/(emulator[^\t]+)/g) ?? []
    let listDevicesWithName = await Promise.all(
        listDevices.map(async (device) => {
            let name = await runShell(`adb -s ${device} emu avd name`)
            return {
                value: device,
                label: !!name ? name.match(/([^\r\n|OK]+)/g)[0].replaceAll('_', ' ') : device,
            }
        })
    )
    let result = {
        listDevices: listDevicesWithName.map((device) => ({
            value: device.value,
            label: device.label,
            disabled: runningDevices.includes(device.value),
        })),
        listGameOption: [...games.listGameOption],
    }
    res.json(result)
}

exports.getGameOptions = function (req, res, next) {
    let auto = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/auto.json'), 'utf8'))
    let game = req.query.game
    let result = auto.hasOwnProperty(game) ? auto[game] : []
    res.json(result)
}

exports.getListGameOptions = function (req, res, next) {
    let games = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/game.json'), 'utf8'))
    let result = { ...games }
    res.json(result)
}
