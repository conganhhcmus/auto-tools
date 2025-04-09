const core = require('../core')
const { EventKeys } = require('../const')

// Xa cuu
module.exports = async (driver, gameOptions) => {
    await core.sellEventItems(driver, EventKeys.cuu, true)
}