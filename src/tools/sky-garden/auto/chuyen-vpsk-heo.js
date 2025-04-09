const core = require('../core')
const { EventKeys } = require('../const')

// Chuyen heo
module.exports = async (driver, gameOptions) => {
    await core.sellEventItems(driver, EventKeys.heo, false)
}