const { getAutoData } = require('../../utils/data')
const autoFunc = require('./auto')

async function Auto(argv) {
    const auto = getAutoData()
    const gameName = 'sky-garden'
    const { gameOptions, deviceId, index, isRunning } = argv

    await autoFunc.openGame(isRunning, deviceId, gameOptions, index)
    for (let i = 0; i < 10; i++) {
        await autoFunc.produceItems(isRunning, deviceId, gameOptions, i, auto, gameName)
    }
    await autoFunc.openChests(isRunning, deviceId, gameOptions)
    await autoFunc.sellItems(isRunning, deviceId, gameOptions, auto, gameName)
}

module.exports = Auto
