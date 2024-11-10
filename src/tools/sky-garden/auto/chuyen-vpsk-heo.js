const core = require('../core')
const { EventKeys } = require('../const')

// Chuyen heo
module.exports = async (driver) => {
    await core.sellEventItems(driver, EventKeys.heo, false)
}