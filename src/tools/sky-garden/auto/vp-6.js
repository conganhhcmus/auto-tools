
const core = require('../core')
const { SellItemOptions, ProductKeys, TreeKeys } = require('../const')

const produceItems = async (driver, isLast) => {
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

const sellItems = async (driver) => {
    // Sell Goods
    await core.sellItems(driver, SellItemOptions.goods, [
        { key: ProductKeys.vaiXanhLa, value: 6 },
        { key: ProductKeys.tinhDauChanh, value: 6 },
    ])
}

// vai xanh la + tinh dau chanh
module.exports = async (driver, gameOptions) => {
    const { sellItems: sell } = gameOptions;

    for (let i = 0; i < 10; i++) {
        await produceItems(driver, i == 9);
    }
    sell && await sellItems(driver);
}