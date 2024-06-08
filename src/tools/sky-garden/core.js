const { DelayTime, SellSlotList, PlantSlotList, MakeSlotList, FirstRowSlotList, SecondRowSlotList, DefaultBasket, DefaultProduct, SellOptions } = require('./constant')
const { ADBHelper } = require('../../lib/adb')

//#region private function
const _move = (monkeyRunner, pointA, pointB, steps = 1) => {
    const distance_x = Math.abs(pointA.x - pointB.x) / steps
    const distance_y = Math.abs(pointA.y - pointB.y) / steps

    monkeyRunner.touchMove(pointA.x, pointA.y).sleep(DelayTime)

    for (let i = 0; i < steps; i++) {
        if (pointA.x <= pointB.x && pointA.y <= pointB.y) {
            monkeyRunner.touchMove(Math.floor(pointA.x + i * distance_x), Math.floor(pointA.y + i * distance_y)).sleep(DelayTime)
        } else if (pointA.x >= pointB.x && pointA.y <= pointB.y) {
            monkeyRunner.touchMove(Math.floor(pointA.x - i * distance_x), Math.floor(pointA.y + i * distance_y)).sleep(DelayTime)
        } else if (pointA.x <= pointB.x && pointA.y >= pointB.y) {
            monkeyRunner.touchMove(Math.floor(pointA.x + i * distance_x), Math.floor(pointA.y - i * distance_y)).sleep(DelayTime)
        } else {
            monkeyRunner.touchMove(Math.floor(pointA.x - i * distance_x), Math.floor(pointA.y - i * distance_y)).sleep(DelayTime)
        }
    }
}

const _sell = (monkeyRunner) => {
    monkeyRunner
        .sleep(500)
        // increase price
        .tap(660, 270)
        .sleep(DelayTime)
        .tap(660, 270)
        .sleep(DelayTime)
        .tap(660, 270)
        .sleep(DelayTime)
        .tap(660, 270)
        .sleep(DelayTime)
        .tap(660, 270)
        .sleep(DelayTime)
        .tap(660, 270)
        .sleep(DelayTime)
        .tap(660, 270)
        .sleep(DelayTime)
        .tap(660, 270)
        .sleep(DelayTime)
        .tap(660, 270)
        .sleep(DelayTime)
        .tap(660, 270)
        .sleep(500)
        // stop increase price
        .tap(590, 410)
        .sleep(500)
        .tap(400, 420)
        .sleep(500)
        .tap(500, 35)
        .sleep(500)
}

const _plantBySlot = (monkeyRunner, slot, floor = 2) => {
    const { x, y } = PlantSlotList[slot]

    monkeyRunner.touchDown(x, y).sleep(DelayTime)

    _move(monkeyRunner, PlantSlotList[slot], FirstRowSlotList[0], 5)

    // floor 1
    for (let i = 0; i < FirstRowSlotList.length - 1; i++) {
        _move(monkeyRunner, FirstRowSlotList[i], FirstRowSlotList[i + 1], 5)
    }

    _move(monkeyRunner, FirstRowSlotList[FirstRowSlotList.length - 1], SecondRowSlotList[0], 5)

    // floor 2
    if (floor === 2) {
        for (let i = 0; i < SecondRowSlotList.length - 1; i++) {
            _move(monkeyRunner, SecondRowSlotList[i], SecondRowSlotList[i + 1], 5)
        }

        monkeyRunner.touchUp(SecondRowSlotList[SecondRowSlotList.length - 1].x, SecondRowSlotList[SecondRowSlotList.length - 1].y).sleep(500)
    } else {
        monkeyRunner.touchUp(SecondRowSlotList[0].x, SecondRowSlotList[0].y).sleep(500)
    }
}

const _plantHalfBySlot_1st = (monkeyRunner, slot, index = 6) => {
    const { x, y } = PlantSlotList[slot]

    monkeyRunner.touchDown(x, y).sleep(DelayTime)

    _move(monkeyRunner, PlantSlotList[slot], FirstRowSlotList[0], 5)

    // floor 1
    for (let i = 0; i < index; i++) {
        _move(monkeyRunner, FirstRowSlotList[i], FirstRowSlotList[i + 1], 5)
    }

    monkeyRunner.touchUp(FirstRowSlotList[index].x, FirstRowSlotList[index].y).sleep(500)
}

const _plantHalfBySlot_2nd = (monkeyRunner, slot, index = 6) => {
    const { x, y } = PlantSlotList[slot]

    monkeyRunner.touchDown(x, y).sleep(DelayTime)

    _move(monkeyRunner, PlantSlotList[slot], FirstRowSlotList[0], 5)

    // floor 1
    for (let i = 0; i < FirstRowSlotList.length - 1; i++) {
        _move(monkeyRunner, FirstRowSlotList[i], FirstRowSlotList[i + 1], 5)
    }

    _move(monkeyRunner, FirstRowSlotList[FirstRowSlotList.length - 1], SecondRowSlotList[0], 5)

    // floor 2

    for (let i = 0; i < index + 1; i++) {
        _move(monkeyRunner, SecondRowSlotList[i], SecondRowSlotList[i + 1], 5)
    }

    monkeyRunner.touchUp(SecondRowSlotList[index + 1].x, SecondRowSlotList[index + 1].y).sleep(500)
}

const _makeGoodsBySlot = (monkey, slot = 0, number = 1) => {
    const { x, y } = MakeSlotList[slot]
    const { x: produce_x, y: produce_y } = DefaultProduct

    for (let i = 0; i < number; i++) {
        monkey.touchDown(x, y).sleep(DelayTime)
        _move(monkey, MakeSlotList[slot], DefaultProduct, 5)
        monkey.touchUp(produce_x, produce_y).sleep(500)
    }
}

const _getItemId = (items) => {
    if (typeof items === 'string') {
        return items
    }

    if (typeof items === 'object') {
        const foundIndex = items.findIndex((element) => element.value > 0)
        if (foundIndex >= 0) {
            items[foundIndex].value--
            return items[foundIndex].key
        }
        return undefined
    }

    return undefined
}

//#endregion

const sleep = async (monkey, sec = 1) => {
    const monkeyRunner = monkey.multi()
    monkeyRunner.sleep(sec * 1000)
    await monkeyRunner.execute()
}

const goDown = async (monkey, number = 1) => {
    const monkeyRunner = monkey.multi()

    for (let i = 0; i < number; i++) {
        monkeyRunner
            .touchDown(730, 300)
            .sleep(DelayTime)
            .touchMove(730, 300)
            .sleep(DelayTime)
            .touchMove(730, 280)
            .sleep(DelayTime)
            .touchMove(730, 260)
            .sleep(DelayTime)
            .touchMove(730, 240)
            .sleep(DelayTime)
            .touchMove(730, 220)
            .sleep(DelayTime)
            .touchMove(730, 200)
            .sleep(DelayTime)
            .touchUp(730, 200)
            .sleep(i === number - 1 ? 500 : DelayTime)
    }

    return await monkeyRunner.execute()
}

const goUp = async (monkey, number = 1) => {
    const monkeyRunner = monkey.multi()

    for (let i = 0; i < number; i++) {
        monkeyRunner
            .touchDown(730, 200)
            .sleep(DelayTime)
            .touchMove(730, 200)
            .sleep(DelayTime)
            .touchMove(730, 220)
            .sleep(DelayTime)
            .touchMove(730, 240)
            .sleep(DelayTime)
            .touchMove(730, 260)
            .sleep(DelayTime)
            .touchMove(730, 280)
            .sleep(DelayTime)
            .touchMove(730, 300)
            .sleep(DelayTime)
            .touchUp(730, 300)
            .sleep(i === number - 1 ? 500 : DelayTime)
    }

    return await monkeyRunner.execute()
}

const goDownLast = async (monkey) => {
    await goUp(monkey)
    const monkeyRunner = monkey.multi()

    monkeyRunner.tap(405, 430).sleep(750)

    return await monkeyRunner.execute()
}

const openGame = async (deviceId, monkey) => {
    const packageName = 'vn.kvtm.js'
    const item = 'game'

    await ADBHelper.closeApp(deviceId, packageName)
    await ADBHelper.openApp(deviceId, packageName)

    let monkeyRunner = monkey.multi()

    // wait 10s
    monkeyRunner.sleep(10 * 1000)
    await monkeyRunner.execute()

    await ADBHelper.tapByImg(deviceId, _getItemId(item))

    monkeyRunner = monkey.multi()
    monkeyRunner
        .sleep(15 * 1000)
        .press('KEYCODE_BACK')
        .sleep(1 * 1000)
        .press('KEYCODE_BACK')
        .sleep(1 * 1000)
        .press('KEYCODE_BACK')
        .sleep(1 * 1000)
        .press('KEYCODE_BACK')
        .sleep(1 * 1000)
        .press('KEYCODE_BACK')
        .sleep(1 * 1000)
        .press('KEYCODE_BACK')
        .sleep(1 * 1000)
        .press('KEYCODE_BACK')
        .sleep(1 * 1000)
        .press('KEYCODE_BACK')
        .sleep(1 * 1000)
        .press('KEYCODE_BACK')
        .sleep(1 * 1000)
        .tap(470, 325)
        .sleep(500)

    return await monkeyRunner.execute()
}

const openChests = async (deviceId, monkey) => {
    const itemId = 'ruong-bau'
    let isFound = await ADBHelper.haveItemOnScreen(deviceId, _getItemId(itemId))
    if (isFound) {
        const monkeyRunner = monkey.multi()
        monkeyRunner
            .tap(280, 100)
            .sleep(200)
            .tap(280, 100)
            .sleep(500)
            .tap(170, 355)
            .sleep(200)
            .tap(170, 355)
            .sleep(500)
            .tap(400, 280)
            .sleep(200)
            .tap(400, 280)
            .sleep(200)
            .tap(400, 280)
            .sleep(200)
            .tap(400, 280)
            .sleep(200)
            .tap(400, 280)
            .sleep(200)
            .tap(400, 280)
            .sleep(200)
            .tap(400, 280)
            .sleep(200)
            .tap(400, 280)
            .sleep(200)
            .tap(400, 280)
            .sleep(200)
            .tap(400, 280)
            .sleep(500)
            //back to game
            .press('KEYCODE_BACK')
            .sleep(100)
            .press('KEYCODE_BACK')
            .sleep(100)
            .press('KEYCODE_BACK')
            .sleep(100)
            .tap(470, 325)
            .sleep(500)

        return await monkeyRunner.execute()
    }
}

const harvestTrees = async (monkey) => {
    const { x, y } = DefaultBasket
    const monkeyRunner = monkey.multi()

    monkeyRunner.tap(300, 380).sleep(400)

    monkeyRunner.touchDown(x, y).sleep(DelayTime)

    _move(monkeyRunner, DefaultBasket, FirstRowSlotList[0], 5)

    // floor 1
    for (let i = 0; i < FirstRowSlotList.length - 1; i++) {
        _move(monkeyRunner, FirstRowSlotList[i], FirstRowSlotList[i + 1], 5)
    }

    _move(monkeyRunner, FirstRowSlotList[FirstRowSlotList.length - 1], SecondRowSlotList[0], 5)

    // floor 2
    for (let i = 0; i < SecondRowSlotList.length - 1; i++) {
        _move(monkeyRunner, SecondRowSlotList[i], SecondRowSlotList[i + 1], 5)
    }

    monkeyRunner.touchUp(SecondRowSlotList[SecondRowSlotList.length - 1].x, SecondRowSlotList[SecondRowSlotList.length - 1].y).sleep(500)

    return await monkeyRunner.execute()
}

const backToGame = async (monkey) => {
    const monkeyRunner = monkey.multi()

    monkeyRunner.press('KEYCODE_BACK').sleep(100).press('KEYCODE_BACK').sleep(100).press('KEYCODE_BACK').sleep(100).tap(470, 325).sleep(500)

    return await monkeyRunner.execute()
}

const plantTrees = async (monkey, slot = 0, floor = 2) => {
    const monkeyRunner = monkey.multi()

    // open
    monkeyRunner.tap(300, 380).sleep(400)

    _plantBySlot(monkeyRunner, slot, floor)

    return await monkeyRunner.execute()
}

const plantTrees_Half = async (monkey, slot = 0, index, floor = 1) => {
    const monkeyRunner = monkey.multi()
    // open
    monkeyRunner.tap(300, 380).sleep(400)

    if (floor == 1) _plantHalfBySlot_1st(monkeyRunner, slot, index)
    else _plantHalfBySlot_2nd(monkeyRunner, slot, index)

    return await monkeyRunner.execute()
}

const makeItemFloor1 = async (monkey, slot = 0, number = 1) => {
    const monkeyRunner = monkey.multi()

    // open
    for (let i = 0; i < 10; i++) {
        monkeyRunner.tap(175, 410).sleep(200)
    }

    monkeyRunner.sleep(500)

    // make goods
    _makeGoodsBySlot(monkeyRunner, slot, number)

    // fix & close
    monkeyRunner.tap(80, 313).sleep(500).tap(630, 320).sleep(500).press('KEYCODE_BACK').sleep(500)

    return await monkeyRunner.execute()
}

const makeItemFloor2 = async (monkey, slot = 0, number = 1) => {
    const monkeyRunner = monkey.multi()

    // open
    for (let i = 0; i < 10; i++) {
        monkeyRunner.tap(175, 200).sleep(200)
    }

    monkeyRunner.sleep(500)

    // make goods
    _makeGoodsBySlot(monkeyRunner, slot, number)

    // fix & close
    monkeyRunner.tap(80, 110).sleep(500).tap(630, 320).sleep(500).press('KEYCODE_BACK').sleep(500)

    return await monkeyRunner.execute()
}

const nextTrees = async (deviceId, monkey, itemId) => {
    let monkeyRunner = monkey.multi()

    monkeyRunner.tap(300, 380).sleep(400)

    await monkeyRunner.execute()
    let isFound = await ADBHelper.haveItemOnScreen(deviceId, _getItemId(itemId))

    while (!isFound) {
        monkeyRunner = monkey.multi()

        monkeyRunner.tap(325, 305).sleep(300)

        await monkeyRunner.execute()
        isFound = await ADBHelper.haveItemOnScreen(deviceId, _getItemId(itemId))
    }

    monkeyRunner = monkey.multi()

    monkeyRunner.press('KEYCODE_BACK').sleep(500)

    await monkeyRunner.execute()
}

const prevTrees = async (deviceId, monkey, itemId) => {
    let monkeyRunner = monkey.multi()

    monkeyRunner.tap(300, 380).sleep(400)

    await monkeyRunner.execute()
    let isFound = await ADBHelper.haveItemOnScreen(deviceId, _getItemId(itemId))

    while (!isFound) {
        monkeyRunner = monkey.multi()

        monkeyRunner.tap(80, 305).sleep(300)

        await monkeyRunner.execute()
        isFound = await ADBHelper.haveItemOnScreen(deviceId, _getItemId(itemId))
    }

    monkeyRunner = monkey.multi()

    monkeyRunner.press('KEYCODE_BACK').sleep(500)

    await monkeyRunner.execute()
}

const sellItems = async (deviceId, monkey, slotA, slotB, slotC, option, items) => {
    // const slotA = [0, 1, 2, 3, 4, 5, 6, 7]
    // const slotB = [0, 1, 2, 3, 4, 5, 6, 7]
    // const slotC = [1, 2, 5, 6]

    const { x: option_x, y: option_y } = SellOptions[option]

    let monkeyRunner = monkey.multi()

    // open
    monkeyRunner.tap(530, 320).sleep(1 * 1000)

    // back front market
    monkeyRunner.touchDown(130, 270).sleep(DelayTime)
    _move(monkeyRunner, { x: 130, y: 270 }, { x: 630, y: 270 }, 50)
    monkeyRunner.touchUp(630, 270).sleep(500)

    // back front market
    monkeyRunner.touchDown(130, 270).sleep(DelayTime)
    _move(monkeyRunner, { x: 130, y: 270 }, { x: 630, y: 270 }, 50)
    monkeyRunner.touchUp(630, 270).sleep(500)

    await monkeyRunner.execute()

    for (const slot of slotA) {
        const { x, y } = SellSlotList[slot]
        monkeyRunner = monkey.multi()

        monkeyRunner.tap(x, y).sleep(500).tap(x, y).sleep(500).tap(option_x, option_y).sleep(500)

        await monkeyRunner.execute()

        // choose item by image
        await ADBHelper.tapByImg(deviceId, _getItemId(items))

        monkeyRunner = monkey.multi()
        _sell(monkeyRunner)

        await monkeyRunner.execute()
    }

    if (slotB.length === 0 && slotC.length === 0) {
        monkeyRunner = monkey.multi()

        // close
        monkeyRunner.press('KEYCODE_BACK').sleep(100).press('KEYCODE_BACK').sleep(100).press('KEYCODE_BACK').sleep(100).tap(470, 325).sleep(500)

        return await monkeyRunner.execute()
    }

    monkeyRunner = monkey.multi()

    monkeyRunner.touchDown(670, 270).sleep(DelayTime)
    _move(monkeyRunner, { x: 670, y: 270 }, { x: 130, y: 270 }, 1000)
    monkeyRunner.touchUp(130, 270).sleep(500)

    await monkeyRunner.execute()

    for (const slot of slotB) {
        const { x, y } = SellSlotList[slot]

        monkeyRunner = monkey.multi()

        monkeyRunner.tap(x, y).sleep(500).tap(x, y).sleep(500).tap(option_x, option_y).sleep(500)

        await monkeyRunner.execute()

        await ADBHelper.tapByImg(deviceId, _getItemId(items))

        monkeyRunner = monkey.multi()
        _sell(monkeyRunner)

        await monkeyRunner.execute()
    }

    if (slotC.length === 0) {
        monkeyRunner = monkey.multi()

        // close
        monkeyRunner.press('KEYCODE_BACK').sleep(100).press('KEYCODE_BACK').sleep(100).press('KEYCODE_BACK').sleep(100).tap(470, 325).sleep(500)

        return await monkeyRunner.execute()
    }

    monkeyRunner = monkey.multi()

    monkeyRunner.touchDown(670, 270).sleep(DelayTime)
    _move(monkeyRunner, { x: 670, y: 270 }, { x: 130, y: 270 }, 1000)
    monkeyRunner.touchUp(130, 270).sleep(500)

    await monkeyRunner.execute()

    for (const slot of slotC) {
        monkeyRunner = monkey.multi()

        const { x, y } = SellSlotList[slot]

        monkeyRunner.tap(x, y).sleep(500).tap(x, y).sleep(500).tap(option_x, option_y).sleep(500)

        await monkeyRunner.execute()

        await ADBHelper.tapByImg(deviceId, _getItemId(items))

        monkeyRunner = monkey.multi()
        _sell(monkeyRunner)

        await monkeyRunner.execute()
    }

    monkeyRunner = monkey.multi()

    // close
    monkeyRunner.press('KEYCODE_BACK').sleep(100).press('KEYCODE_BACK').sleep(100).press('KEYCODE_BACK').sleep(100).tap(470, 325).sleep(500)

    return await monkeyRunner.execute()
}

module.exports = {
    sleep,
    goUp,
    goDown,
    goDownLast,
    openGame,
    openChests,
    harvestTrees,
    backToGame,
    plantTrees,
    plantTrees_Half,
    makeItemFloor1,
    makeItemFloor2,
    nextTrees,
    prevTrees,
    sellItems,
}
