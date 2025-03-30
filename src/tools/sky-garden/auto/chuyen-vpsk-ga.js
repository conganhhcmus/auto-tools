const core = require('../core')
const { EventKeys } = require('../const')

// Chuyen ga
module.exports = async (driver, gameOptions) => {
    await core.sellEventItems(driver, EventKeys.ga, false)
}