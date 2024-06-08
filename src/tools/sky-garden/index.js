const { getAutoData } = require('../../utils/data')
const autoFunc = require('./auto')

async function Auto(argv) {
    const auto = getAutoData()
    const gameName = 'sky-garden'
    const data = JSON.parse(Buffer.from(argv[2], 'base64').toString('ascii'))
    const { gameOptions, deviceId, index } = data

    await autoFunc.openGame(deviceId, gameOptions, index)
    for (let i = 0; i < 10; i++) {
        await autoFunc.produceItems(deviceId, gameOptions, i, auto, gameName)
    }
    await autoFunc.openChests(deviceId, gameOptions)
    await autoFunc.sellItems(deviceId, gameOptions, auto, gameName)
}

Auto(process.argv)
