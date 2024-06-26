const Scripts = require('./script')
const { SellItemOptions } = require('./constance')

// Cao vai do
const ProduceItems_1 = async (device, hasEventTree, isLast) => {
    const NUMBER_OF_MAKE_GOODS = 2

    for (let k = 0; k < NUMBER_OF_MAKE_GOODS; k++) {
        // Floor 1
        await Scripts.GoUp(device)
        await Scripts.HarvestTrees(device)
        await Scripts.PlantTrees(device, 2)
        await Scripts.MakeGoods(device, 0, 4)

        // Floor 3
        await Scripts.GoUp(device, 2)
        await Scripts.HarvestTrees(device)
        await Scripts.PlantTrees(device, 0)
        await Scripts.MakeGoods(device, 0, 4)

        // Go Down
        await Scripts.BackToGame(device)
        await Scripts.GoDownLast(device)
        if (k < NUMBER_OF_MAKE_GOODS - 1 || !isLast) await Scripts.Sleep(device, 14)
    }
}

const SellItems_1 = async (device) => {
    // Sell Goods
    await Scripts.SellGoods(device, [0, 1, 2, 3, 4, 5, 6, 7], SellItemOptions.goods, 'vai-do')
}

// Cao vai tim
const ProduceItems_2 = async (device, hasEventTree, isLast) => {
    const NUMBER_OF_MAKE_GOODS = 2

    for (let k = 0; k < NUMBER_OF_MAKE_GOODS; k++) {
        // Floor 1
        await Scripts.GoUp(device)
        await Scripts.HarvestTrees(device)
        if (hasEventTree) {
            await Scripts.NextTrees(device, 'oai-huong')
            await Scripts.PlantTrees(device, 2)
        } else {
            await Scripts.PlantTrees(device, 3)
        }
        await Scripts.MakeGoods(device, 2, 4)

        // Floor 3
        await Scripts.GoUp(device, 2)
        await Scripts.HarvestTrees(device)
        hasEventTree && (await Scripts.PrevTrees(device, 'bong'))
        await Scripts.PlantTrees(device, 0)
        await Scripts.MakeGoods(device, 2, 4)

        // Go Down
        await Scripts.BackToGame(device)
        await Scripts.GoDownLast(device)
        if (k < NUMBER_OF_MAKE_GOODS - 1 || !isLast) await Scripts.Sleep(device, hasEventTree ? 10 : 14)
    }
}

const SellItems_2 = async (device) => {
    // Sell Goods
    await Scripts.SellGoods(device, [0, 1, 2, 3, 4, 5, 6, 7], SellItemOptions.goods, 'vai-tim')
}

// Cao vai do + nuoc tuyet
const ProduceItems_3 = async (device, hasEventTree, isLast) => {
    // Floor 1 & 2
    await Scripts.GoUp(device)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, hasEventTree ? 3 : 4)
    await Scripts.MakeGoods(device, 0, 4)

    // Floor 3
    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, 0)
    await Scripts.MakeGoods(device, 0, 4)

    // Go Down
    await Scripts.BackToGame(device)
    await Scripts.GoDownLast(device)

    await Scripts.GoUp(device)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, 2)
    await Scripts.MakeGoods_2(device, 1, 3)

    // Go Down
    await Scripts.BackToGame(device)
    await Scripts.GoDownLast(device)

    if (!isLast) await Scripts.Sleep(device, 1)
}

const SellItems_3 = async (device) => {
    // Sell Goods
    await Scripts.SellGoods(device, [0, 1, 2, 3, 4, 5, 6], SellItemOptions.goods, [
        { key: 'vai-do', value: 4 },
        { key: 'nuoc-tuyet', value: 3 },
    ])
}

// Cao vai tim + nuoc tuyet
const ProduceItems_4 = async (device, hasEventTree, isLast) => {
    // Floor 1
    await Scripts.GoUp(device)
    await Scripts.HarvestTrees(device)
    if (hasEventTree) {
        await Scripts.NextTrees(device, 'oai-huong')
        await Scripts.PlantTrees(device, 2)
    } else {
        await Scripts.PlantTrees(device, 3)
    }
    await Scripts.MakeGoods(device, 2, 4)

    // Floor 3
    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    hasEventTree && (await Scripts.PrevTrees(device, 'bong'))
    await Scripts.PlantTrees(device, hasEventTree ? 3 : 4)
    await Scripts.MakeGoods(device, 2, 4)

    // Go Down
    await Scripts.BackToGame(device)
    await Scripts.GoDownLast(device)

    await Scripts.GoUp(device)
    await Scripts.MakeGoods_2(device, 1, 3)

    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, 0)

    // Go Down
    await Scripts.BackToGame(device)
    await Scripts.GoDownLast(device)
}

const SellItems_4 = async (device) => {
    // Sell Goods
    await Scripts.SellGoods(device, [0, 1, 2, 3, 4, 5, 6], SellItemOptions.goods, [
        { key: 'vai-tim', value: 4 },
        { key: 'nuoc-tuyet', value: 3 },
    ])
}

// Cao Vai Do + TD HH + Tra HH
const ProduceItems_5 = async (device, hasEventTree, isLast) => {
    // Floor 1
    await Scripts.GoUp(device)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, 2)
    await Scripts.MakeGoods(device, 0, 4)

    // Floor 3
    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, 2)
    await Scripts.MakeGoods(device, 0, 4)

    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, hasEventTree ? 3 : 4)

    // Go Down
    await Scripts.BackToGame(device)
    await Scripts.GoDownLast(device)

    // Floor 1 & 2
    await Scripts.GoUp(device)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, 2)
    await Scripts.MakeGoods(device, 0, 3)
    await Scripts.MakeGoods_2(device, 1, 3)

    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, 2)

    // Floor 5
    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, hasEventTree ? 3 : 4)
    await Scripts.MakeGoods(device, 0, 3)

    // Go Down
    await Scripts.BackToGame(device)
    await Scripts.GoDownLast(device)

    await Scripts.GoUp(device)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, 2)
    await Scripts.MakeGoods(device, 0, 3)

    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, 0)

    // Floor 5 & 6
    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, hasEventTree ? 3 : 4)
    await Scripts.MakeGoods(device, 0, 3)
    await Scripts.MakeGoods_2(device, 0, 3)

    // Go Down
    await Scripts.BackToGame(device)
    await Scripts.GoDownLast(device)
}

const SellItems_5 = async (device) => {
    // Sell Goods
    const slotA = [0, 1, 2, 3, 4, 5, 6, 7]
    const slotB = []
    const slotC = [0, 1, 2, 4, 5]
    await Scripts.SellFullGoods(device, slotA, slotB, slotC, SellItemOptions.goods, [
        { key: 'vai-do', value: 4 },
        { key: 'tinh-dau-hoa-hong', value: 6 },
        { key: 'tra-hoa-hong', value: 3 },
    ])
}

// Cao vai vang + Tra hoa hong
const ProduceItems_6 = async (device, hasEventTree, isLast) => {
    // Floor 1 & 2
    await Scripts.GoUp(device)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, hasEventTree ? 3 : 4)
    await Scripts.MakeGoods(device, 0, 6)
    await Scripts.MakeGoods_2(device, 1, 3)
    await Scripts.MakeGoods_2(device, 0, 4)

    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, 2)
    await Scripts.MakeGoods(device, 1, 4)

    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, 2, 1)
    await Scripts.MakeGoods_2(device, 0, 3)

    await Scripts.GoUp(device, 1)
    await Scripts.PlantTrees_Half(device, 1, 4)

    await Scripts.GoUp(device, 1)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, 1)

    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, 0)

    // Go Down
    await Scripts.BackToGame(device)
    await Scripts.GoDownLast(device)

    if (!isLast) await Scripts.Sleep(device, 6)
}

const SellItems_6 = async (device) => {
    // Sell Goods
    await Scripts.SellGoods(device, [0, 1, 2, 3, 4, 5, 6], SellItemOptions.goods, [
        { key: 'vai-vang', value: 4 },
        { key: 'tra-hoa-hong', value: 3 },
    ])
}

// Cao Vai Vang + TD HH + Tra HH
const ProduceItems_7 = async (device, hasEventTree, isLast) => {
    // Floor 1
    await Scripts.GoUp(device)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, hasEventTree ? 3 : 4)
    await Scripts.MakeGoods(device, 0, 2)
    await Scripts.MakeGoods_2(device, 1, 1)
    await Scripts.MakeGoods_2(device, 0, 4)

    // Floor 3
    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, 2)
    await Scripts.MakeGoods(device, 1, 4)

    // floor 5
    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees_Half(device, 2, 4)
    await Scripts.MakeGoods(device, 0, 2)
    await Scripts.MakeGoods_2(device, 0, 1)

    //floor 6
    await Scripts.GoUp(device)
    await Scripts.PlantTrees_Half(device, 1, 4)
    await Scripts.GoUp(device)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, 1)

    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, 0)

    // Go Down
    await Scripts.BackToGame(device)
    await Scripts.GoDownLast(device)
}

const SellItems_7 = async (device) => {
    // Sell Goods
    await Scripts.SellGoods(device, [0, 1, 2, 3, 4, 5, 6], SellItemOptions.goods, [
        { key: 'vai-vang', value: 4 },
        { key: 'tinh-dau-hoa-hong', value: 2 },
        { key: 'tra-hoa-hong', value: 1 },
    ])
}

// Cao Vai Vang + TD Tao + Tra HH
const ProduceItems_8 = async (device, hasEventTree, isLast) => {
    // Harvest
    await Scripts.GoUp(device)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, 2)

    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, 0)

    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, 1)

    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, 1)

    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, 1)

    // Go Down
    await Scripts.BackToGame(device)
    await Scripts.GoDownLast(device)

    // Make Items
    await Scripts.GoUp(device)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, hasEventTree ? 3 : 4)
    await Scripts.MakeGoods(device, 0, 4)
    await Scripts.MakeGoods_2(device, 1, 2)
    await Scripts.MakeGoods_2(device, 0, 4)

    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, hasEventTree ? 3 : 4)
    await Scripts.MakeGoods(device, 1, 4)

    // floor 5
    await Scripts.GoUp(device, 2)
    await Scripts.MakeGoods(device, 1, 4)
    await Scripts.MakeGoods_2(device, 0, 2)

    // Go Down
    await Scripts.BackToGame(device)
    await Scripts.GoDownLast(device)
}

const SellItems_8 = async (device) => {
    // Sell Goods
    const slotA = [0, 1, 2, 3, 4, 5, 6, 7]
    const slotB = [0, 1]
    const slotC = []
    await Scripts.SellFullGoods(device, slotA, slotB, slotC, SellItemOptions.goods, [
        { key: 'vai-vang', value: 4 },
        { key: 'tinh-dau-tao', value: 4 },
        { key: 'tra-hoa-hong', value: 2 },
    ])
}

// Cao vai tim + hat dua say
const ProduceItems_9 = async (device, hasEventTree, isLast) => {
    // Floor 1,2
    await Scripts.GoUp(device)
    await Scripts.HarvestTrees(device)
    await Scripts.NextTrees(device, 'dua-hau')
    await Scripts.PlantTrees(device, hasEventTree ? 4 : 0) // trong dua hau

    await Scripts.MakeGoods(device, 4, 4)
    await Scripts.MakeGoods_2(device, 3, 3)

    // Floor 3
    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, hasEventTree ? 0 : 1) // trong chanh

    // Go Down
    await Scripts.BackToGame(device)
    await Scripts.GoDownLast(device)
    if (!isLast) await Scripts.Sleep(device, 10)
}

const SellItems_9 = async (device) => {
    // Sell Goods
    await Scripts.SellGoods(device, [0, 1, 2, 3, 4, 5, 6], SellItemOptions.goods, [
        { key: 'hat-dua-say', value: 4 },
        { key: 'nuoc-chanh', value: 3 },
    ])
}

const PlantEventTree = async (device) => {
    await Scripts.GoUp(device)

    for (let j = 0; j < 4; j++) {
        await Scripts.HarvestTrees(device)
        await Scripts.PlantTrees(device, 4)
        await Scripts.GoUp(device, 2)
    }

    await Scripts.HarvestTrees(device)
    await Scripts.PlantTrees(device, 4)
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
            await PlantEventTree(device)
            break

        case auto[gameName][1].key:
            await ProduceItems_1(device, hasEventTree, isLast)
            break

        case auto[gameName][2].key:
            await ProduceItems_2(device, hasEventTree, isLast)
            break

        case auto[gameName][3].key:
            await ProduceItems_3(device, hasEventTree, isLast)
            break

        case auto[gameName][4].key:
            await ProduceItems_4(device, hasEventTree, isLast)
            break

        case auto[gameName][5].key:
            await ProduceItems_5(device, hasEventTree, isLast)
            break

        case auto[gameName][6].key:
            await ProduceItems_6(device, hasEventTree, isLast)
            break

        case auto[gameName][7].key:
            await ProduceItems_7(device, hasEventTree, isLast)
            break

        case auto[gameName][8].key:
            await ProduceItems_8(device, hasEventTree, isLast)
            break

        case auto[gameName][9].key:
            await ProduceItems_9(device, hasEventTree, isLast)
            break

        default:
            break
    }
}

const SellItems = async (device, gameOptions, auto, gameName) => {
    const { runAuto, sellItems } = gameOptions
    if (!sellItems) return

    switch (runAuto) {
        case auto[gameName][1].key:
            await SellItems_1(device)
            break

        case auto[gameName][2].key:
            await SellItems_2(device)
            break

        case auto[gameName][3].key:
            await SellItems_3(device)
            break

        case auto[gameName][4].key:
            await SellItems_4(device)
            break

        case auto[gameName][5].key:
            await SellItems_5(device)
            break

        case auto[gameName][6].key:
            await SellItems_6(device)
            break

        case auto[gameName][7].key:
            await SellItems_7(device)
            break

        case auto[gameName][8].key:
            await SellItems_8(device)
            break

        case auto[gameName][9].key:
            await SellItems_9(device)
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
