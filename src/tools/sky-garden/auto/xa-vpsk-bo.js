const core = require('../core')
const { EventKeys } = require('../const')

// Xa bo
module.exports = async (driver) => {
    await core.sellEventItems(driver, EventKeys.bo, true)
}