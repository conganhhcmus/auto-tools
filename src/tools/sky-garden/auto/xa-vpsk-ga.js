const core = require('../core')
const { EventKeys } = require('../const')

// Xa ga
module.exports = async (driver) => {
    await core.sellEventItems(driver, EventKeys.ga, true)
}