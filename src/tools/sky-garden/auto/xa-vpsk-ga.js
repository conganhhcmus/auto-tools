const core = require('../core')
const { EventKeys } = require('../const')

// Xa ga
module.exports = async (driver, gameOptions) => {
    await core.sellEventItems(driver, EventKeys.ga, true)
}