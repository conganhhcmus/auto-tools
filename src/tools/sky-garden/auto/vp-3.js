
const core = require('../core')
const { SellItemOptions, ProductKeys, TreeKeys } = require('../const')

const produceItems = async (driver, isLast) => {
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

const sellItems = async (driver) => {
    // Sell Goods
    await core.sellItems(driver, SellItemOptions.goods, [{ key: ProductKeys.vaiTim, value: 8 }])
}

// vai tim
module.exports = async (driver, gameOptions) => {
    const { sellItems: sell } = gameOptions;

    for (let i = 0; i < 10; i++) {
        await produceItems(driver, i == 9);
    }
    sell && await sellItems(driver);
}