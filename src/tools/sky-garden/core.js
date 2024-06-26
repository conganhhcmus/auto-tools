const { KeyCode } = require('../../lib/webdriverio')
const { DelayTime, SellSlotList, PlantSlotList, MakeSlotList, FirstRowSlotList, SecondRowSlotList, DefaultBasket, DefaultProduct, SellOptions } = require('./const')

const openGame = async (driver) => {
    const appId = 'vn.kvtm.js'
    await driver.closeApp(appId)
    await driver.openApp(appId)
    await driver.sleep(10)
    await driver.tap(17.11, 63.75)
    await driver.sleep(15)
    for (let i = 0; i < 10; i++) {
        await driver.press(KeyCode.BACK)
        await driver.sleep(1)
    }
    await driver.tap(58, 72.22)
    await driver.sleep(1)
}

const openChests = async (driver) => {
    const itemId = 'ruong-bau'
    let isFound = await driver.haveItemOnScreen(_getItemId(itemId))
    if (isFound) {
        await driver.tap(35.0, 22.22)
        await driver.sleep(0.2)
        await driver.tap(35.0, 22.22)
        await driver.sleep(0.5)
        await driver.tap(21.25, 78.89)
        await driver.sleep(0.2)
        await driver.tap(21.25, 78.89)
        await driver.sleep(0.5)
        for (let i = 0; i < 10; i++) {
            await driver.tap(50.0, 62.22)
            await driver.sleep(0.2)
        }
        //back to game
        await backToGame(driver)
    }
}

const backToGame = async (driver) => {
    await driver.press(KeyCode.BACK)
    await driver.sleep(0.1)
    await driver.press(KeyCode.BACK)
    await driver.sleep(0.1)
    await driver.press(KeyCode.BACK)
    await driver.sleep(0.1)
    await driver.tap(58.75, 72.22)
    await driver.sleep(0.5)
}

const goUp = async (driver, times = 1) => {
    for (let i = 0; i < times; i++) {
        await driver.action([
            { duration: 0, x: 48, y: 10 },
            { duration: 1, x: 48, y: 50 },
        ])
    }
    await driver.sleep(0.5)
}

const goDown = async (driver, times = 1) => {
    for (let i = 0; i < times; i++) {
        await driver.action([
            { duration: 0, x: 48, y: 50 },
            { duration: 1, x: 48, y: 10 },
        ])
    }
    await driver.sleep(0.5)
}

const goDownLast = async (driver) => {
    await goUp(driver)
    await driver.tap(50.63, 97.78)
    await driver.sleep(DelayTime)
    await driver.tap(50.63, 97.78)
    await driver.sleep(0.75)
}

const harvestTrees = async (driver) => {
    const { x, y } = DefaultBasket

    await driver.tap(37.5, 84.44)
    await driver.sleep(0.4)
    const pointList = [{ duration: 0, x: x, y: y }]
    let duration = 0

    // floor 1
    for (let i = 0; i < FirstRowSlotList.length; i++) {
        duration += (i + 1) % 2
        pointList.push({
            duration: duration,
            x: FirstRowSlotList[i].x,
            y: FirstRowSlotList[i].y,
        })
    }

    // floor 2
    for (let i = 0; i < SecondRowSlotList.length; i++) {
        duration += i % 2
        pointList.push({
            duration: duration,
            x: SecondRowSlotList[i].x,
            y: SecondRowSlotList[i].y,
        })
    }
    await driver.action(pointList)
    await driver.sleep(0.5)
}

const plantTrees = async (driver, slot = 0, floor = 2, pot = 5) => {
    const { x, y } = PlantSlotList[slot]

    // open
    await driver.tap(37.5, 84.44)
    await driver.sleep(0.4)

    const pointList = [{ duration: 0, x: x, y: y }]
    let duration = 0
    // floor 1
    for (let i = 0; i < FirstRowSlotList.length && floor >= 1; i++) {
        if (i > 2 * pot && floor == 1) break
        duration += (i + 1) % 2
        pointList.push({
            duration: duration,
            x: FirstRowSlotList[i].x,
            y: FirstRowSlotList[i].y,
        })
    }

    // floor 2
    for (let i = 0; i < SecondRowSlotList.length && floor >= 2; i++) {
        duration += i % 2
        pointList.push({
            duration: duration,
            x: SecondRowSlotList[i].x,
            y: SecondRowSlotList[i].y,
        })
        if (i > 2 * pot && floor == 2) break
    }

    await driver.action(pointList)
    await driver.sleep(0.5)
}

const makeItems = async (driver, floor = 1, slot = 0, number = 1) => {
    // open
    for (let i = 0; i < 15; i++) {
        await driver.tap(21.875, floor == 1 ? 91.11 : 44.44)
        await driver.sleep(0.2)
    }

    // make goods
    const { x, y } = MakeSlotList[slot]

    for (let i = 0; i < number; i++) {
        const pointList = [{ duration: 0, x: x, y: y }]
        const duration = Math.round(DelayTime * 1000)
        pointList.push({ duration: duration, x: DefaultProduct.x, y: DefaultProduct.y })
        await driver.action(pointList)
        await driver.sleep(0.1)
    }
    // fix & close
    await driver.tap(10.0, floor == 1 ? 69.56 : 24.44)
    await driver.sleep(0.1)
    await driver.tap(78.75, 71.11)
    await driver.sleep(0.1)
    await backToGame(driver)
}

const nextTrees = async (driver, itemId) => {
    await driver.tap(37.5, 84.44)
    await driver.sleep(0.4)

    let isFound = await driver.haveItemOnScreen(_getItemId(itemId))

    while (!isFound) {
        await driver.tap(40.625, 67.78)
        await driver.sleep(0.3)

        isFound = await driver.haveItemOnScreen(_getItemId(itemId))
    }

    await driver.press(KeyCode.BACK)
    await driver.sleep(0.5)
}

const prevTrees = async (driver, itemId) => {
    await driver.tap(37.5, 84.44)
    await driver.sleep(0.4)

    let isFound = await driver.haveItemOnScreen(_getItemId(itemId))

    while (!isFound) {
        await driver.tap(10, 67.78)
        await driver.sleep(0.3)

        isFound = await driver.haveItemOnScreen(_getItemId(itemId))
    }

    await driver.press(KeyCode.BACK)
    await driver.sleep(0.5)
}

const sellItems = async (driver, slotA, slotB, slotC, option, items) => {
    // const slotA = [0, 1, 2, 3, 4, 5, 6, 7]
    // const slotB = [0, 1, 2, 3, 4, 5, 6, 7]
    // const slotC = [1, 2, 5, 6]

    const { x: option_x, y: option_y } = SellOptions[option]

    // open
    await driver.tap(66.25, 71.11)
    await driver.sleep(1)

    // back front market
    await driver.action([
        { duration: 0, x: 16.25, y: 60.0 },
        { duration: 0.2 * 1000, x: 78.75, y: 60.0 },
    ])
    await driver.sleep(0.5)

    // back front market
    await driver.action([
        { duration: 0, x: 16.25, y: 60.0 },
        { duration: 0.2 * 1000, x: 78.75, y: 60.0 },
    ])
    await driver.sleep(0.5)

    for (const slot of slotA) {
        const { x, y } = SellSlotList[slot]

        await driver.tap(x, y)
        await driver.sleep(0.5)
        await driver.tap(x, y)
        await driver.sleep(0.5)
        await driver.tap(option_x, option_y)
        await driver.sleep(0.5)

        // choose item by image
        await driver.tapItemOnScreen(_getItemId(items))

        await _sell(driver)
    }

    if (slotB.length === 0 && slotC.length === 0) {
        return await backToGame(driver)
    }

    await driver.action([
        { duration: 0, x: 84.375, y: 60.0 },
        { duration: 3 * 1000, x: 21.875, y: 60.0 },
    ])
    await driver.sleep(0.5)

    for (const slot of slotB) {
        const { x, y } = SellSlotList[slot]

        await driver.tap(x, y)
        await driver.sleep(0.5)
        await driver.tap(x, y)
        await driver.sleep(0.5)
        await driver.tap(option_x, option_y)
        await driver.sleep(0.5)

        // choose item by image
        await driver.tapItemOnScreen(_getItemId(items))

        await _sell(driver)
    }

    if (slotC.length === 0) {
        return await backToGame(driver)
    }

    await driver.action([
        { duration: 0, x: 84.375, y: 60.0 },
        { duration: 3 * 1000, x: 21.875, y: 60.0 },
    ])
    await driver.sleep(0.5)

    for (const slot of slotC) {
        const { x, y } = SellSlotList[slot]

        await driver.tap(x, y)
        await driver.sleep(0.5)
        await driver.tap(x, y)
        await driver.sleep(0.5)
        await driver.tap(option_x, option_y)
        await driver.sleep(0.5)

        // choose item by image
        await driver.tapItemOnScreen(_getItemId(items))

        await _sell(driver)
    }

    // close
    await backToGame(driver)
}

module.exports = {
    openGame,
    openChests,
    goDown,
    goUp,
    goDownLast,
    backToGame,
    harvestTrees,
    plantTrees,
    makeItems,
    nextTrees,
    prevTrees,
    sellItems,
}

// private method

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

const _sell = async (driver) => {
    await driver.sleep(0.5)
    // increase price
    await driver.tap(82.5, 60.0)
    await driver.sleep(DelayTime)
    await driver.tap(82.5, 60.0)
    await driver.sleep(DelayTime)
    await driver.tap(82.5, 60.0)
    await driver.sleep(DelayTime)
    await driver.tap(82.5, 60.0)
    await driver.sleep(DelayTime)
    await driver.tap(82.5, 60.0)
    await driver.sleep(DelayTime)
    await driver.tap(82.5, 60.0)
    await driver.sleep(DelayTime)
    await driver.tap(82.5, 60.0)
    await driver.sleep(DelayTime)
    await driver.tap(82.5, 60.0)
    await driver.sleep(DelayTime)
    await driver.tap(82.5, 60.0)
    await driver.sleep(DelayTime)
    await driver.tap(82.5, 60.0)
    await driver.sleep(0.5)
    // stop increase price
    await driver.tap(73.75, 91.11)
    await driver.sleep(0.5)
    await driver.tap(50.0, 93.33)
    await driver.sleep(0.5)
    await driver.tap(62.5, 7.78)
    await driver.sleep(0.5)
}
