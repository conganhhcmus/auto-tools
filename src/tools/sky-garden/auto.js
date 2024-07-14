const core = require('./core')

const openGame = async (driver, gameOptions = {}, index) => {
    const { openGame, openGameAfter } = gameOptions
    const needOpen = openGame && index % openGameAfter == 0
    needOpen ? (await core.openGame(driver)) : (await driver.setCurrentWindowSize())
}

const openChests = async (driver, gameOptions = {}) => {
    const { openChests } = gameOptions
    openChests && (await core.openChests(driver))
}

const produceItems = async (driver, gameOptions = {}, index, auto, gameName) => {
    const { runAuto, hasEventTree } = gameOptions
    const isLast = index === 9

    switch (runAuto) {
        case auto[gameName][0].key:
            await produceItems_1(driver, hasEventTree, isLast)
            break

        case auto[gameName][1].key:
            await produceItems_2(driver, hasEventTree, isLast)
            break

        case auto[gameName][2].key:
            await produceItems_3(driver, hasEventTree, isLast)
            break

        default:
            await plantEventTree(driver)
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

const { SellItemOptions } = require('./const')

//#region tinh dau dua + tra hoa hong
const produceItems_1 = async (driver, hasEventTree, isLast) => {
    await core.goUp(driver)
    await core.prevTrees(driver, 'tuyet')
    await core.plantTrees(driver, hasEventTree ? 3 : 4) // trong tuyet
    await core.goUp(driver, 2)
    await core.plantTrees(driver, hasEventTree ? 3 : 4) // trong tuyet
    await core.goUp(driver, 2)
    await core.plantTrees(driver, hasEventTree ? 3 : 4) // trong tuyet
    await core.goUp(driver, 2)
    await core.plantTrees(driver, 2) // trong hong
    await core.goUp(driver, 2)
    await core.plantTrees(driver, 2, 1) // trong hong
    await core.goDownLast(driver)

    // thu hoach 1
    await core.goUp(driver)
    await core.harvestTrees(driver)
    await core.nextTrees(driver, 'dua')
    await core.plantTrees(driver, hasEventTree ? 1 : 2) // trong dua
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.plantTrees(driver, hasEventTree ? 1 : 2) // trong dua
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.plantTrees(driver, hasEventTree ? 1 : 2, 1) // trong dua
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
        { key: 'tinh-dau-dua', value: 6 },
        { key: 'tra-hoa-hong', value: 3 },
    ])
}

//#endregion

//#region tinh dau dua + nuoc chanh
const produceItems_2 = async (driver, hasEventTree, isLast) => {
    await core.goUp(driver)
    await core.nextTrees(driver, 'chanh')
    await core.plantTrees(driver, hasEventTree ? 0 : 1) // trong chanh
    await core.goUp(driver, 2)
    await core.plantTrees(driver, hasEventTree ? 0 : 1) // trong chanh
    await core.goUp(driver, 2)
    await core.plantTrees(driver, hasEventTree ? 1 : 2) // trong dua
    await core.goUp(driver, 2)
    await core.plantTrees(driver, hasEventTree ? 1 : 2) // trong dua
    await core.goUp(driver, 2)
    await core.plantTrees(driver, hasEventTree ? 1 : 2, 1) // trong dua
    await core.goDownLast(driver)

    // thu hoach 1
    await core.goUp(driver)
    await core.harvestTrees(driver)
    await core.prevTrees(driver, 'tuyet')
    await core.plantTrees(driver, hasEventTree ? 3 : 4) // trong tuyet
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.plantTrees(driver, hasEventTree ? 3 : 4) // trong tuyet
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
    await core.makeItems(driver, 1, 3, 6) // sx tinh dau dua
    await core.goDownLast(driver)
}

const sellItems_2 = async (driver) => {
    // Sell Goods
    await core.sellItems(driver, SellItemOptions.goods, [
        { key: 'tinh-dau-dua', value: 6 },
        { key: 'nuoc-chanh', value: 6 },
    ])
}

//#region tinh dau dua + nuoc chanh
const produceItems_3 = async (driver, hasEventTree, isLast) => {
    await core.goUp(driver)
    await core.nextTrees(driver, 'chanh')
    await core.plantTrees(driver, hasEventTree ? 0 : 1) // trong chanh
    await core.goUp(driver, 2)
    await core.plantTrees(driver, hasEventTree ? 0 : 1) // trong chanh
    await core.goUp(driver, 2)
    await core.plantTrees(driver, hasEventTree ? 0 : 1) // trong chanh
    await core.goUp(driver, 2)
    await core.plantTrees(driver, hasEventTree ? 0 : 1) // trong chanh
    await core.goUp(driver, 2)
    await core.plantTrees(driver, hasEventTree ? 0 : 1, 1) // trong chanh
    await core.goDownLast(driver)

    // thu hoach 1
    await core.goUp(driver)
    await core.harvestTrees(driver)
    await core.prevTrees(driver, 'tuyet')
    await core.plantTrees(driver, hasEventTree ? 3 : 4) // trong tuyet
    await core.goUp(driver, 2)
    await core.harvestTrees(driver)
    await core.plantTrees(driver, hasEventTree ? 3 : 4) // trong tuyet
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

const sellItems_3 = async (driver) => {
    // Sell Goods
    await core.sellItems(driver, SellItemOptions.goods, [
        { key: 'tinh-dau-chanh', value: 6 },
        { key: 'nuoc-chanh', value: 6 },
    ])
}
//#endregion

const plantEventTree = async (driver) => {
    await core.goUp(driver)

    // trong cay
    for (let j = 0; j < 4; j++) {
        await core.plantTrees(driver, 4)
        await core.goUp(driver, 2)
    }
    await core.plantTrees(driver, 4)

    // xuong tang thap nhat
    await core.goDownLast(driver)
    await driver.sleep(1)
    await core.goUp(driver)

    // thu hoach cay
    for (let j = 0; j < 4; j++) {
        await core.harvestTrees(driver)
        await core.goUp(driver, 2)
    }
    await core.harvestTrees(driver)
    // xuong tang thap nhat
    await core.goDownLast(driver)
}
