const core = require('../core')
const { EventKeys } = require('../const')

// Chuyen cuu
module.exports = async (driver, gameOptions) => {
    await core.sellEventItems(driver, EventKeys.cuu, false)
}