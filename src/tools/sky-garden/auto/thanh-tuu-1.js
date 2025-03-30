const core = require('../core')
const { FriendHouseList } = require('../const')

// TT - Gặp Nhau Mỗi Ngày
module.exports = async (driver, gameOptions) => {
    for (let i = 0; i < FriendHouseList.length; i++) {
        await core.goFriendHouse(driver, i)
    }
}