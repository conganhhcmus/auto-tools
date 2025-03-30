const core = require('../core')

// Mua vpsk
module.exports = async (driver, gameOptions) => {
    await core.goFriendHouse(driver, 1);
    for (let i = 0; i < 10; i++) {
        await core.buy8SlotItem(driver)
    }
    await core.goMyHouse(driver);
}