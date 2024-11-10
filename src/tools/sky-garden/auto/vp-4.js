
const core = require('../core')
const { SellItemOptions, ProductKeys, TreeKeys } = require('../const')

const produceItems = async (driver, isLast) => {
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

const sellItems = async (driver) => {
    // Sell Goods
    await core.sellItems(driver, SellItemOptions.goods, [{ key: ProductKeys.nuocHoaHuongTao, value: 6 }])
}

// nuoc hoa huong tao
module.exports = async (driver) => {
    for (let i = 0; i < 10; i++) {
        await produceItems(driver, i == 9);
    }
    await sellItems(driver);
}