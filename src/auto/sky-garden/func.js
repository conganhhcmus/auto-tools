const Scripts = require('./base')

const OpenGame = (device) => {
    Scripts.OpenGame(device)
}

// Cao vai do
const ProduceItems_1 = (device, hasEventTree, isLast) => {
    const NUMBER_OF_MAKE_GOODS = 2

    for (let k = 0; k < NUMBER_OF_MAKE_GOODS; k++) {
        // Floor 1
        Scripts.GoUp(device)
        Scripts.HarvestTrees(device)
        Scripts.PlantTrees(device, 2)
        Scripts.MakeGoods(device, 0, 4)

        // Floor 3
        Scripts.GoUp(device, 2)
        Scripts.HarvestTrees(device)
        Scripts.PlantTrees(device, 0)
        Scripts.MakeGoods(device, 0, 4)

        // Go Down
        Scripts.BackToGame(device)
        Scripts.GoDownLast(device)
        if (k < NUMBER_OF_MAKE_GOODS - 1 || !isLast) Scripts.Sleep(device, 14)
    }
}

const SellItems_1 = (device) => {
    // Sell Goods
    Scripts.SellGoods(device, [0, 1, 2, 3, 4, 5, 6, 7], 1)
}

// Cao vai tim
const ProduceItems_2 = (device, hasEventTree, isLast) => {
    const NUMBER_OF_MAKE_GOODS = 2

    for (let k = 0; k < NUMBER_OF_MAKE_GOODS; k++) {
        // Floor 1
        Scripts.GoUp(device)
        Scripts.HarvestTrees(device)
        if (hasEventTree) {
            Scripts.NextTrees(device, 1)
            Scripts.PlantTrees(device, 2)
        } else {
            Scripts.PlantTrees(device, 3)
        }
        Scripts.MakeGoods(device, 2, 4)

        // Floor 3
        Scripts.GoUp(device, 2)
        Scripts.HarvestTrees(device)
        hasEventTree && Scripts.PrevTrees(device, 1)
        Scripts.PlantTrees(device, 0)
        Scripts.MakeGoods(device, 2, 4)

        // Go Down
        Scripts.BackToGame(device)
        Scripts.GoDownLast(device)
        if (k < NUMBER_OF_MAKE_GOODS - 1 || !isLast) Scripts.Sleep(device, hasEventTree ? 10 : 14)
    }
}

const SellItems_2 = (device) => {
    // Sell Goods
    Scripts.SellGoods(device, [0, 1, 2, 3, 4, 5, 6, 7], 1)
}

// Cao vai do + nuoc tuyet
const ProduceItems_3 = (device, hasEventTree, isLast) => {
    // Floor 1 & 2
    Scripts.GoUp(device)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, hasEventTree ? 3 : 4)
    Scripts.MakeGoods(device, 0, 4)

    // Floor 3
    Scripts.GoUp(device, 2)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, 0)
    Scripts.MakeGoods(device, 0, 4)

    // Go Down
    Scripts.BackToGame(device)
    Scripts.GoDownLast(device)

    Scripts.GoUp(device)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, 2)
    Scripts.MakeGoods_2(device, 1, 3)

    // Go Down
    Scripts.BackToGame(device)
    Scripts.GoDownLast(device)

    if (!isLast) Scripts.Sleep(device, 1)
}

const SellItems_3 = (device) => {
    // Sell Goods
    Scripts.SellGoods(device, [0, 1, 2, 3, 4, 5, 6], 1)
}

// Cao vai tim + nuoc tuyet
const ProduceItems_4 = (device, hasEventTree, isLast) => {
    // Floor 1
    Scripts.GoUp(device)
    Scripts.HarvestTrees(device)
    if (hasEventTree) {
        Scripts.NextTrees(device, 1)
        Scripts.PlantTrees(device, 2)
    } else {
        Scripts.PlantTrees(device, 3)
    }
    Scripts.MakeGoods(device, 2, 4)

    // Floor 3
    Scripts.GoUp(device, 2)
    Scripts.HarvestTrees(device)
    hasEventTree && Scripts.PrevTrees(device, 1)
    Scripts.PlantTrees(device, hasEventTree ? 3 : 4)
    Scripts.MakeGoods(device, 2, 4)

    // Go Down
    Scripts.BackToGame(device)
    Scripts.GoDownLast(device)

    Scripts.GoUp(device)
    Scripts.MakeGoods_2(device, 1, 3)

    Scripts.GoUp(device, 2)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, 0)

    // Go Down
    Scripts.BackToGame(device)
    Scripts.GoDownLast(device)
}

const SellItems_4 = (device, hasEventTree) => {
    // Sell Goods
    Scripts.SellGoods(device, [0, 1, 2, 3, 4, 5, 6], 1)
}

// Cao Vai Do + TD HH + Tra HH
const ProduceItems_5 = (device, hasEventTree, isLast) => {
    // Floor 1
    Scripts.GoUp(device)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, 2)
    Scripts.MakeGoods(device, 0, 4)

    // Floor 3
    Scripts.GoUp(device, 2)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, 2)
    Scripts.MakeGoods(device, 0, 4)

    Scripts.GoUp(device, 2)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, hasEventTree ? 3 : 4)

    // Go Down
    Scripts.BackToGame(device)
    Scripts.GoDownLast(device)

    // Floor 1 & 2
    Scripts.GoUp(device)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, 2)
    Scripts.MakeGoods(device, 0, 3)
    Scripts.MakeGoods_2(device, 1, 3)

    Scripts.GoUp(device, 2)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, 2)

    // Floor 5
    Scripts.GoUp(device, 2)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, hasEventTree ? 3 : 4)
    Scripts.MakeGoods(device, 0, 3)

    // Go Down
    Scripts.BackToGame(device)
    Scripts.GoDownLast(device)

    Scripts.GoUp(device)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, 2)
    Scripts.MakeGoods(device, 0, 3)

    Scripts.GoUp(device, 2)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, 0)

    // Floor 5 & 6
    Scripts.GoUp(device, 2)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, hasEventTree ? 3 : 4)
    Scripts.MakeGoods(device, 0, 3)
    Scripts.MakeGoods_2(device, 0, 3)

    // Go Down
    Scripts.BackToGame(device)
    Scripts.GoDownLast(device)
}

const SellItems_5 = (device) => {
    // Sell Goods
    const slotA = [0, 1, 2, 3, 4, 5, 6, 7]
    const slotB = []
    const slotC = [0, 1, 2, 4, 5]
    Scripts.SellFullGoods(device, slotA, slotB, slotC, 1)
}

// Cao vai vang + Tra hoa hong
const ProduceItems_6 = (device, hasEventTree, isLast) => {
    // Floor 1 & 2
    Scripts.GoUp(device)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, hasEventTree ? 3 : 4)
    Scripts.MakeGoods(device, 0, 6)
    Scripts.MakeGoods_2(device, 1, 3)
    Scripts.MakeGoods_2(device, 0, 4)

    Scripts.GoUp(device, 2)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, 2)
    Scripts.MakeGoods(device, 1, 4)

    Scripts.GoUp(device, 2)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, 2, 1)
    Scripts.MakeGoods_2(device, 0, 3)

    Scripts.GoUp(device, 1)
    Scripts.PlantTrees_Half(device, 1, 4)

    Scripts.GoUp(device, 1)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, 1)

    Scripts.GoUp(device, 2)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, 0)

    // Go Down
    Scripts.BackToGame(device)
    Scripts.GoDownLast(device)

    if (!isLast) Scripts.Sleep(device, 6)
}

const SellItems_6 = (device) => {
    // Sell Goods
    Scripts.SellGoods(device, [0, 1, 2, 3, 4, 5, 6], 1)
}

// Cao Vai Vang + TD HH + Tra HH
const ProduceItems_7 = (device, hasEventTree, isLast) => {
    // Floor 1
    Scripts.GoUp(device)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, hasEventTree ? 3 : 4)
    Scripts.MakeGoods(device, 0, 2)
    Scripts.MakeGoods_2(device, 1, 1)
    Scripts.MakeGoods_2(device, 0, 4)

    // Floor 3
    Scripts.GoUp(device, 2)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, 2)
    Scripts.MakeGoods(device, 1, 4)

    // floor 5
    Scripts.GoUp(device, 2)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees_Half(device, 2, 4)
    Scripts.MakeGoods(device, 0, 2)
    Scripts.MakeGoods_2(device, 0, 1)

    //floor 6
    Scripts.GoUp(device)
    Scripts.PlantTrees_Half(device, 1, 4)
    Scripts.GoUp(device)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, 1)

    Scripts.GoUp(device, 2)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, 0)

    // Go Down
    Scripts.BackToGame(device)
    Scripts.GoDownLast(device)
}

const SellItems_7 = (device) => {
    // Sell Goods
    Scripts.SellGoods(device, [0, 1, 2, 3, 4, 5, 6], 1)
}

// Cao Vai Vang + TD Tao + Tra HH
const ProduceItems_8 = (device, hasEventTree, isLast) => {
    // Harvest
    Scripts.GoUp(device)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, 2)

    Scripts.GoUp(device, 2)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, 0)

    Scripts.GoUp(device, 2)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, 1)

    Scripts.GoUp(device, 2)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, 1)

    Scripts.GoUp(device, 2)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, 1)

    // Go Down
    Scripts.BackToGame(device)
    Scripts.GoDownLast(device)

    // Make Items
    Scripts.GoUp(device)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, hasEventTree ? 3 : 4)
    Scripts.MakeGoods(device, 0, 4)
    Scripts.MakeGoods_2(device, 1, 2)
    Scripts.MakeGoods_2(device, 0, 4)

    Scripts.GoUp(device, 2)
    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, hasEventTree ? 3 : 4)
    Scripts.MakeGoods(device, 1, 4)

    // floor 5
    Scripts.GoUp(device, 2)
    Scripts.MakeGoods(device, 1, 4)
    Scripts.MakeGoods_2(device, 0, 2)

    // Go Down
    Scripts.BackToGame(device)
    Scripts.GoDownLast(device)
}

const SellItems_8 = (device) => {
    // Sell Goods
    const slotA = [0, 1, 2, 3, 4, 5, 6, 7]
    const slotB = [0, 1]
    const slotC = []
    Scripts.SellFullGoods(device, slotA, slotB, slotC, 1)
}

const PlantEventTree = (device) => {
    Scripts.GoUp(device)

    for (let j = 0; j < 4; j++) {
        Scripts.HarvestTrees(device)
        Scripts.PlantTrees(device, 4)
        Scripts.GoUp(device, 2)
    }

    Scripts.HarvestTrees(device)
    Scripts.PlantTrees(device, 4)
    Scripts.GoDownLast(device)
}

const Execute = (device) => {
    return new Promise((resolve) => {
        Scripts.Execute(device, resolve)
    })
}

module.exports = {
    OpenGame,
    // Produce Items
    ProduceItems_1,
    ProduceItems_2,
    ProduceItems_3,
    ProduceItems_4,
    ProduceItems_5,
    ProduceItems_6,
    ProduceItems_7,
    ProduceItems_8,
    PlantEventTree,
    // SellItems
    SellItems_1,
    SellItems_2,
    SellItems_3,
    SellItems_4,
    SellItems_5,
    SellItems_6,
    SellItems_7,
    SellItems_8,
    Execute,
}
