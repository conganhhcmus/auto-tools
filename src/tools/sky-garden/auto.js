const core = require('./core')
const { PlantSlotList, AchievementKeys, FriendHouseList } = require('./const')

const openGame = async (driver, gameOptions = {}, index) => {
    const { openGame } = gameOptions
    const needOpen = openGame && index == 0
    needOpen ? await core.openGame(driver) : await driver.setCurrentWindowSize()
}

const openChests = async (driver, gameOptions = {}) => {
    const { openChests } = gameOptions
    openChests && (await core.openChests(driver))
}

const produceItems = async (driver, gameOptions = {}, index, auto, gameName, frequencyIndex) => {
    const { runAuto } = gameOptions
    const isLast = index === 9
    const isFirstRun = frequencyIndex === 0 && index === 0

    switch (runAuto) {
        case auto[gameName][0].key:
            await produceItems_1(driver, isLast)
            break

        case auto[gameName][1].key:
            await produceItems_2(driver, isLast)
            break

        case auto[gameName][2].key:
            await produceItems_3(driver, isLast)
            break

        case auto[gameName][3].key:
            await plantEventTree(driver, index)
            break

        case auto[gameName][4].key:
            await buyEventItem8Slot(driver, isFirstRun)
            break

        case auto[gameName][13].key:
            await getAchievement(driver, AchievementKeys.GapNhauMoiNgay)
            break

        case auto[gameName][14].key:
            await produceItems_4(driver, isLast)
            break

        case auto[gameName][15].key:
            await produceItems_5(driver, isLast)
            break

        case auto[gameName][16].key:
            await produceItems_6(driver, isLast)
            break

        case auto[gameName][17].key:
            await produceItems_7(driver, isLast)
            break

        default:
            break
    }
}

const sellItems = async (driver, gameOptions, auto, gameName) => {
    const { runAuto, sellItems } = gameOptions
    if (!sellItems) return

    switch (runAuto) {
        case auto[gameName][0].key:
            await sellItems_1(driver)
            break

        case auto[gameName][1].key:
            await sellItems_2(driver)
            break

        case auto[gameName][2].key:
            await sellItems_3(driver)
            break

        case auto[gameName][5].key:
            await sellEventItem(driver, EventKeys.ga, false)
            break

        case auto[gameName][6].key:
            await sellEventItem(driver, EventKeys.bo, false)
            break

        case auto[gameName][7].key:
            await sellEventItem(driver, EventKeys.heo, false)
            break

        case auto[gameName][8].key:
            await sellEventItem(driver, EventKeys.cuu, false)
            break

        case auto[gameName][9].key:
            await sellEventItem(driver, EventKeys.ga)
            break

        case auto[gameName][10].key:
            await sellEventItem(driver, EventKeys.bo)
            break

        case auto[gameName][11].key:
            await sellEventItem(driver, EventKeys.heo)
            break

        case auto[gameName][12].key:
            await sellEventItem(driver, EventKeys.cuu)
            break

        case auto[gameName][14].key:
            await sellItems_4(driver)
            break

        case auto[gameName][15].key:
            await sellItems_5(driver)
            break

        case auto[gameName][16].key:
            await sellItems_6(driver)
            break

        case auto[gameName][17].key:
            await sellItems_7(driver)
            break

        default:
            break
    }
}

module.exports = {
    openGame,
    openChests,
    produceItems,
    sellItems,
}

// define auto function

const { SellItemOptions, ProductKeys, TreeKeys, EventKeys } = require('./const')

//#region tinh dau dua + tra hoa hong
const produceItems_1 = async (driver, isLast) => {
    await core.goUp(driver)
    let slotTree = await core.findTreeOnScreen(driver, TreeKeys.tuyet, false)
    await core.plantTrees(driver, slotTree) // trong tuyet
    await core.goUp(driver, 2)
    await core.plantTrees(driver, slotTree) // trong tuyet
    await core.goUp(driver, 2)
    await core.plantTrees(driver, slotTree) // trong tuyet
    await core.goUp(driver, 2)
    await core.plantTrees(driver, slotTree) // trong hong
    await core.goUp(driver, 2)
    await core.plantTrees(driver, slotTree, 1) // trong hong
    await core.goDownLast(driver)

    // thu hoach 1
    await core.goUp(driver)
    await core.harvestTrees(driver)
    slotTree = await core.findTreeOnScreen(driver, TreeKeys.dua)
    await core.plantTrees(driver, slotTree) // trong dua
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.plantTrees(driver, slotTree) // trong dua
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.plantTrees(driver, slotTree) // trong dua
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.goDownLast(driver)

    // thu hoach 2
    await core.goUp(driver)
    await core.makeItems(driver, 1, 0, 6) // sx hoa hong say
    await core.makeItems(driver, 2, 1, 3) // sx nuoc tuyet
    await core.harvestTrees(driver)
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.makeItems(driver, 1, 3, 6) // sx tinh dau dua
    await core.makeItems(driver, 2, 0, 3) // sx tra hoa hong
    await core.goDownLast(driver)
}

const sellItems_1 = async (driver) => {
    // Sell Goods
    await core.sellItems(driver, SellItemOptions.goods, [
        { key: ProductKeys.tinhDauDua, value: 6 },
        { key: ProductKeys.traHoaHong, value: 3 },
    ])
}

//#endregion

//#region tinh dau chanh + nuoc chanh
const produceItems_2 = async (driver, isLast) => {
    // trong 1 - chanh
    await core.goUp(driver)
    let slotTree = await core.findTreeOnScreen(driver, TreeKeys.chanh)
    await core.plantTrees(driver, slotTree) // trong chanh
    await core.goUp(driver, 2)
    await core.plantTrees(driver, slotTree) // trong chanh
    await core.goUp(driver, 2)
    await core.plantTrees(driver, slotTree) // trong chanh
    await core.goUp(driver, 2)
    await core.plantTrees(driver, slotTree) // trong chanh
    await core.goUp(driver, 2)
    await core.plantTrees(driver, slotTree, 1) // trong chanh
    await core.goDownLast(driver)

    // thu hoach 1 & trong 2 - tuyet
    await core.goUp(driver)
    await core.harvestTrees(driver)
    slotTree = await core.findTreeOnScreen(driver, TreeKeys.tuyet, false)
    await core.plantTrees(driver, slotTree) // trong tuyet
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.plantTrees(driver, slotTree) // trong tuyet
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.goDownLast(driver)

    // thu hoach 2
    await core.goUp(driver)
    await core.makeItems(driver, 2, 3, 6) // sx nuoc chanh
    await core.harvestTrees(driver)
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.goUp(driver, 2)
    await core.makeItems(driver, 1, 4, 6) // sx tinh dau chanh
    await core.goDownLast(driver)
}

const sellItems_2 = async (driver) => {
    // Sell Goods
    await core.sellItems(driver, SellItemOptions.goods, [
        { key: ProductKeys.tinhDauChanh, value: 6 },
        { key: ProductKeys.nuocChanh, value: 6 },
    ])
}
//#endregion

//#region vai tim
const produceItems_3 = async (driver, isLast) => {
    await core.goUp(driver)
    let slotTree = await core.findTreeOnScreen(driver, TreeKeys.oaiHuong)
    await core.plantTrees(driver, slotTree) // trong oai huong
    await core.goUp(driver, 2)
    await core.plantTrees(driver, slotTree) // trong oai huong
    await core.goDownLast(driver)
    await driver.sleep(6)

    // thu hoach 1
    await core.goUp(driver)
    await core.harvestTrees(driver)
    slotTree = await core.findTreeOnScreen(driver, TreeKeys.bong, false)
    await core.plantTrees(driver, slotTree) // trong bong
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.plantTrees(driver, slotTree) // trong bong
    await core.goDownLast(driver)

    // thu hoach 2
    await core.goUp(driver)
    await core.makeItems(driver, 1, 2, 8) // sx oai huong say
    await core.harvestTrees(driver)
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.makeItems(driver, 1, 2, 8) // sx vai tim
    await core.goDownLast(driver)

    if (!isLast) {
        await driver.sleep(30)
    }
}

const sellItems_3 = async (driver) => {
    // Sell Goods
    await core.sellItems(driver, SellItemOptions.goods, [{ key: ProductKeys.vaiTim, value: 8 }])
}

//#region nuoc hoa huong tao
const produceItems_4 = async (driver, isLast) => {
    // trong 1 - chanh
    await core.goUp(driver)
    let slotTree = await core.findTreeOnScreen(driver, TreeKeys.tao)
    await core.plantTrees(driver, slotTree) // trong tao
    await core.goUp(driver, 2)
    await core.plantTrees(driver, slotTree) // trong tao
    await core.goUp(driver, 2)
    await core.plantTrees(driver, slotTree) // trong tao
    await core.goUp(driver, 2)
    await core.plantTrees(driver, slotTree) // trong tao
    await core.goUp(driver, 2)
    await core.plantTrees(driver, slotTree, 1) // trong tao
    await core.goDownLast(driver)

    // thu hoach 1 & trong 2 - tuyet
    await core.goUp(driver)
    await core.harvestTrees(driver)
    slotTree = await core.findTreeOnScreen(driver, TreeKeys.tuyet, false)
    await core.plantTrees(driver, slotTree) // trong tuyet
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.plantTrees(driver, slotTree) // trong tuyet
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.goDownLast(driver)

    // thu hoach 2
    await core.goUp(driver)
    await core.makeItems(driver, 2, 0, 6) // sx nuoc tao
    await core.harvestTrees(driver)
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.goUp(driver, 2)
    await core.makeItems(driver, 1, 1, 6) // sx tinh dau tao
    await core.goUp(driver, 2)
    await core.makeItems(driver, 2, 1, 6) // sx nuoc hoa huong tao
    await core.goDownLast(driver)
}

const sellItems_4 = async (driver) => {
    // Sell Goods
    await core.sellItems(driver, SellItemOptions.goods, [{ key: ProductKeys.nuocHoaHuongTao, value: 6 }])
}

// #endregion


//#region vai xanh la
const produceItems_5 = async (driver, isLast) => {
    // trong bong, chanh
    await core.goUp(driver)
    let slotTree = await core.findTreeOnScreen(driver, TreeKeys.chanh)
    await core.plantTrees(driver, slotTree) // trong chanh
    await core.goUp(driver, 2)
    await core.plantTrees(driver, slotTree) // trong chanh
    await core.goDownLast(driver)
    await driver.sleep(6)

    await core.goUp(driver)
    await core.harvestTrees(driver)
    slotTree = await core.findTreeOnScreen(driver, TreeKeys.bong, false)
    await core.plantTrees(driver, slotTree) // trong bong
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.plantTrees(driver, slotTree, 1) // trong bong
    await core.goDownLast(driver)

    // san xuat
    await core.goUp(driver)
    await core.makeItems(driver, 2, 3, 6) // sx nuoc chanh
    await core.harvestTrees(driver)
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.makeItems(driver, 1, 3, 6) // sx vai xanh la
    await core.goDownLast(driver)

    if (!isLast) {
        await driver.sleep(3)
    }
}

const sellItems_5 = async (driver) => {
    // Sell Goods
    await core.sellItems(driver, SellItemOptions.goods, [{ key: ProductKeys.vaiXanhLa, value: 6 }])
}


//#region vai xanh la + tinh dau chanh
const produceItems_6 = async (driver, isLast) => {
    // trong 1 - chanh
    await core.goUp(driver)
    let slotTree = await core.findTreeOnScreen(driver, TreeKeys.chanh)
    await core.plantTrees(driver, slotTree) // trong chanh
    await core.goUp(driver, 2)
    await core.plantTrees(driver, slotTree) // trong chanh
    await core.goUp(driver, 2)
    await core.plantTrees(driver, slotTree) // trong chanh
    await core.goUp(driver, 2)
    await core.plantTrees(driver, slotTree) // trong chanh
    await core.goDownLast(driver)

    // thu hoach 1 & trong 2 - bong, tuyet
    await core.goUp(driver)
    await core.harvestTrees(driver)
    await core.plantTrees(driver, slotTree, 1) // trong chanh
    await core.goUp(driver)
    slotTree = await core.findTreeOnScreen(driver, TreeKeys.bong, false)
    await core.plantTrees(driver, slotTree, 1) // trong bong
    await core.goUp(driver)
    await core.harvestTrees(driver)
    await core.plantTrees(driver, slotTree) // trong bong
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    slotTree = await core.findTreeOnScreen(driver, TreeKeys.tuyet, false)
    await core.plantTrees(driver, slotTree) // trong tuyet
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.plantTrees(driver, slotTree) // trong tuyet
    await core.goDownLast(driver)

    // thu hoach 2
    await core.goUp(driver)
    await core.harvestTrees(driver)
    await core.makeItems(driver, 2, 3, 6) // sx nuoc chanh
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.makeItems(driver, 1, 3, 6) // sx vai xanh la
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.makeItems(driver, 1, 4, 6) // sx tinh dau chanh
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.goDownLast(driver)
}

const sellItems_6 = async (driver) => {
    // Sell Goods
    await core.sellItems(driver, SellItemOptions.goods, [
        { key: ProductKeys.vaiXanhLa, value: 6 },
        { key: ProductKeys.tinhDauChanh, value: 6 },
    ])
}
//#endregion


//#region vai do
const produceItems_7 = async (driver, isLast) => {
    await core.goUp(driver)
    let slotTree = await core.findTreeOnScreen(driver, TreeKeys.hong)
    await core.plantTrees(driver, slotTree) // trong hong
    await core.goUp(driver, 2)
    await core.plantTrees(driver, slotTree) // trong hong
    await core.goDownLast(driver)
    await driver.sleep(6)

    // thu hoach 1
    await core.goUp(driver)
    await core.harvestTrees(driver)
    slotTree = await core.findTreeOnScreen(driver, TreeKeys.bong, false)
    await core.plantTrees(driver, slotTree) // trong bong
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.plantTrees(driver, slotTree) // trong bong
    await core.goDownLast(driver)

    // thu hoach 2
    await core.goUp(driver)
    await core.makeItems(driver, 1, 0, 8) // sx hong say
    await core.harvestTrees(driver)
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.makeItems(driver, 1, 0, 8) // sx vai do
    await core.goDownLast(driver)

    if (!isLast) {
        await driver.sleep(30)
    }
}

const sellItems_7 = async (driver) => {
    // Sell Goods
    await core.sellItems(driver, SellItemOptions.goods, [{ key: ProductKeys.vaiDo, value: 8 }])
}


const plantEventTree = async (driver, index) => {
    const slotTree = PlantSlotList[4]

    if (index == 0) {
        await core.goUp(driver)
        // chac chan reset ve ban dau
        await core.findTreeOnScreen(driver, TreeKeys.hong)
        // trong cay
        for (let j = 0; j < 4; j++) {
            await core.plantTrees(driver, slotTree, 4)
            await core.goUp(driver, 2)
        }
        await core.plantTrees(driver, slotTree, 4)
        await core.goDownLast(driver)
        await driver.sleep(1)
    } else {
        await core.goUp(driver)
        // thu hoach cay
        for (let j = 0; j < 4; j++) {
            await core.harvestTrees(driver)
            await core.plantTrees(driver, slotTree, 4)
            await core.goUp(driver, 2)
        }
        await core.harvestTrees(driver)
        await core.plantTrees(driver, slotTree, 4)
        await core.goDownLast(driver)
    }

    if (index == 9) {
        await core.goUp(driver)
        // thu hoach cay
        for (let j = 0; j < 4; j++) {
            await core.harvestTrees(driver)
            await core.goUp(driver, 2)
        }
        await core.harvestTrees(driver)
        await core.goDownLast(driver)
    }
}

const sellEventItem = async (driver, itemKey, isAds = true) => {
    await core.sellEventItems(driver, itemKey, isAds)
}

const buyEventItem8Slot = async (driver, isFirst) => {
    isFirst && (await core.goFriendHouse(driver))
    await core.buy8SlotItem(driver)
}

const getAchievement = async (driver, key) => {
    switch (key) {
        case AchievementKeys.GapNhauMoiNgay:
            for (let i = 0; i < FriendHouseList.length; i++) {
                await core.goFriendHouse(driver, i)
            }
            break
        default:
            break
    }
}
