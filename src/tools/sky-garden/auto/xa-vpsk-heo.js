const core = require('../core')
const { EventKeys } = require('../const')

// Xa heo
module.exports = async (driver, gameOptions) => {
    await core.sellEventItems(driver, EventKeys.heo, true)
}