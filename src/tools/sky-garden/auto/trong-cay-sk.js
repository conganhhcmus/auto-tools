const core = require('../core')
const { TreeKeys, PlantSlotList } = require('../const')

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

// trong cay su kien
module.exports = async (driver) => {
    for (let i = 0; i < 10; i++) {
        await plantEventTree(driver, i);
    }
}