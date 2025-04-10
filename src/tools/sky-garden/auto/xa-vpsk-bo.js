const core = require('../core')
const { EventKeys } = require('../const')

// Xa bo
module.exports = async (driver, gameOptions) => {
    await core.sellEventItems(driver, EventKeys.bo, true)
}