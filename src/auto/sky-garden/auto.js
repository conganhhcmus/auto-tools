const Scripts = require('./script')

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
    await Scripts.SellGoods(device, [0, 1, 2, 3, 4, 5, 6, 7], 1)
}

// Cao vai tim
const ProduceItems_2 = async (device, hasEventTree, isLast) => {
    const NUMBER_OF_MAKE_GOODS = 2

    for (let k = 0; k < NUMBER_OF_MAKE_GOODS; k++) {
        // Floor 1
        await Scripts.GoUp(device)
        await Scripts.HarvestTrees(device)
        if (hasEventTree) {
            await Scripts.NextTrees(device, 1)
            await Scripts.PlantTrees(device, 2)
        } else {
            await Scripts.PlantTrees(device, 3)
        }
        await Scripts.MakeGoods(device, 2, 4)

        // Floor 3
        await Scripts.GoUp(device, 2)
        await Scripts.HarvestTrees(device)
        hasEventTree && (await Scripts.PrevTrees(device, 1))
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
    await Scripts.SellGoods(device, [0, 1, 2, 3, 4, 5, 6, 7], 1)
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
    await Scripts.SellGoods(device, [0, 1, 2, 3, 4, 5, 6], 1)
}

// Cao vai tim + nuoc tuyet
const ProduceItems_4 = async (device, hasEventTree, isLast) => {
    // Floor 1
    await Scripts.GoUp(device)
    await Scripts.HarvestTrees(device)
    if (hasEventTree) {
        await Scripts.NextTrees(device, 1)
        await Scripts.PlantTrees(device, 2)
    } else {
        await Scripts.PlantTrees(device, 3)
    }
    await Scripts.MakeGoods(device, 2, 4)

    // Floor 3
    await Scripts.GoUp(device, 2)
    await Scripts.HarvestTrees(device)
    hasEventTree && (await Scripts.PrevTrees(device, 1))
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
    await Scripts.SellGoods(device, [0, 1, 2, 3, 4, 5, 6], 1)
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
    await Scripts.SellFullGoods(device, slotA, slotB, slotC, 1)
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
    await Scripts.SellGoods(device, [0, 1, 2, 3, 4, 5, 6], 1)
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
    await Scripts.SellGoods(device, [0, 1, 2, 3, 4, 5, 6], 1)
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
    await Scripts.SellFullGoods(device, slotA, slotB, slotC, 1)
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

const ProduceItems = async (device, gameOptions = {}, index, auto, gameName) => {

    const { runAuto, hasEventTree } = gameOptions
    const isLast = index === 9
    switch (runAuto) {
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

        default:
            await PlantEventTree(device)
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

        default:
            break
    }
}

module.exports = {
    OpenGame,
    ProduceItems,
    SellItems
}
