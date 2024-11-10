const core = require('./core')

const openGame = async (driver, gameOptions = {}, index) => {
    const { openGame } = gameOptions
    const needOpen = openGame && index == 0
    needOpen ? await core.openGame(driver) : await driver.setCurrentWindowSize()
}

const openChests = async (driver, gameOptions = {}) => {
    const { openChests } = gameOptions
    openChests && (await core.openChests(driver))
}

const getAuto = (autoKey) => {
    try {
        return require(`./auto/${autoKey}`)
    } catch (e) {
        return null
    }
}

module.exports = async (data, driver) => {
    const { gameOptions, index } = data
    const { runAuto } = gameOptions
    try {
        await openGame(driver, gameOptions, index)
        await openChests(driver, gameOptions)
        var auto = getAuto(runAuto)
        auto && (await auto(driver))
    } catch (err) {
        throw err
    }
}
