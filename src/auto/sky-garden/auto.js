const Scripts = require('./script')
const { SellItemOptions } = require('./constance')

// Cao tinh dau dua + tra hoa hong
const ProduceItems_1 = async (device, hasEventTree, isLast) => {
    // trong tuyet
    await Scripts.GoUp(device)
    await Scripts.PrevTrees(device, 'tuyet')
    await Scripts.PlantTrees(device, hasEventTree ? 3 : 4)
    await Scripts.GoUp(device, 2)
    await Scripts.PlantTrees(device, hasEventTree ? 3 : 4)

    // trong dua
    await Scripts.GoUp(device, 2)
    await Scripts.NextTrees(device, 'dua')
    await Scripts.PlantTrees(device, hasEventTree ? 1 : 2)
    await Scripts.GoUp(device, 2)
    await Scripts.PlantTrees(device, hasEventTree ? 1 : 2)
    await Scripts.GoUp(device, 2)
    await Scripts.PlantTrees_Half(device, hasEventTree ? 1 : 2)
    await Scripts.GoDownLast(device)

    // trong tuyet
    await Scripts.GoUp(device)
    await Scripts.HarvestTrees(device)
    await Scripts.PrevTrees(device, 'tuyet')
    await Scripts.PlantTrees(device, hasEventTree ? 3 : 4)

    // trong hong
    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, 2)
    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees_Half(device, 2)
    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    await Scripts.GoDownLast(device)

    // san xuat vat pham
    await Scripts.GoUp(device)
    await Scripts.HarvestTrees(device)
    await Scripts.MakeGoods(device, 0, 6)
    await Scripts.MakeGoods_2(device, 1, 3)
    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    await Scripts.MakeGoods(device, 3, 6)
    await Scripts.MakeGoods_2(device, 0, 3)
    await Scripts.GoDownLast(device)
}

const SellItems_1 = async (device) => {
    // Sell Goods
    const slotA = [0, 1, 2, 3, 4, 5, 6, 7]
    const slotB = []
    const slotC = [1]
    await Scripts.SellFullGoods(device, slotA, slotB, slotC, SellItemOptions.goods, [
        { key: 'tinh-dau-dua', value: 6 },
        { key: 'tra-hoa-hong', value: 3 },
    ])
}

const PlantEventTree = async (device) => {
    await Scripts.GoUp(device)

    // trong cay
    for (let j = 0; j < 4; j++) {
        await Scripts.PlantTrees(device, 4)
        await Scripts.GoUp(device, 2)
    }
    await Scripts.PlantTrees(device, 4)

    // xuong tang thap nhat
    await Scripts.GoDownLast(device)
    await Scripts.GoUp(device)

    // thu hoach cay
    for (let j = 0; j < 4; j++) {
        await Scripts.HarvestTrees(device)
        await Scripts.GoUp(device, 2)
    }
    await Scripts.HarvestTrees(device)
    // xuong tang thap nhat
    await Scripts.GoDownLast(device)
}

// export function

const OpenGame = async (device, gameOptions = {}, index) => {
    const { openGame, openGameAfter } = gameOptions
    const needOpen = openGame && index % openGameAfter == 0
    needOpen && (await Scripts.OpenGame(device))
}

const OpenChests = async (device, gameOptions = {}) => {
    const { openChests } = gameOptions

    openChests && (await Scripts.OpenChests(device))
}

const ProduceItems = async (device, gameOptions = {}, index, auto, gameName) => {
    const { runAuto, hasEventTree } = gameOptions
    const isLast = index === 9
    switch (runAuto) {
        case auto[gameName][0].key:
            await ProduceItems_1(device, hasEventTree, isLast)
            break

        default:
            await PlantEventTree(device)
            break
    }
}

const SellItems = async (device, gameOptions, auto, gameName) => {
    const { runAuto, sellItems } = gameOptions
    if (!sellItems) return

    switch (runAuto) {
        case auto[gameName][0].key:
            await SellItems_1(device)
            break

        default:
            break
    }
}

module.exports = {
    OpenGame,
    ProduceItems,
    SellItems,
    OpenChests,
}
