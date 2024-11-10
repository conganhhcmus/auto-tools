const core = require('../core')
const { EventKeys } = require('../const')

// Xa cuu
module.exports = async (driver) => {
    await core.sellEventItems(driver, EventKeys.cuu, true)
}