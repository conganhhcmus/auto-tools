const core = require('../core')
const { EventKeys } = require('../const')

// Chuyen ga
module.exports = async (driver) => {
    await core.sellEventItems(driver, EventKeys.ga, false)
}