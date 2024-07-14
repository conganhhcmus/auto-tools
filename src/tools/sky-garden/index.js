const { getAutoData } = require('../../utils/data')
const autoFunc = require('./auto')

async function Auto(data, driver) {
    const auto = getAutoData()
    const gameName = 'sky-garden'
    const { gameOptions, index } = data
    try {
        await autoFunc.openGame(driver, gameOptions, index)
        for (let i = 0; i < 10; i++) {
            await autoFunc.produceItems(driver, gameOptions, i, auto, gameName)
        }
        await autoFunc.openChests(driver, gameOptions)
        await autoFunc.sellItems(driver, gameOptions, auto, gameName)
    }
    catch (err) {
        throw err
    }
}

module.exports = Auto;