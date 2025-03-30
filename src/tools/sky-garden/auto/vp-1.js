const core = require('../core')
const { SellItemOptions, ProductKeys, TreeKeys } = require('../const')

const produceItems = async (driver, isLast) => {
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

const sellItems = async (driver) => {
    // Sell Goods
    await core.sellItems(driver, SellItemOptions.goods, [
        { key: ProductKeys.tinhDauDua, value: 6 },
        { key: ProductKeys.traHoaHong, value: 3 },
    ])
}


// tinh dau dua + tra hoa hong
module.exports = async (driver, gameOptions) => {
    const { sellItems: sell } = gameOptions;
    for (let i = 0; i < 10; i++) {
        await produceItems(driver, i == 9);
    }
    sell && await sellItems(driver);
}