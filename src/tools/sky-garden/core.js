const { KeyCode } = require('../../lib/webdriverio')
const { DelayTime, PlantSlotList, MakeSlotList, FirstRowSlotList, SecondRowSlotList, DefaultBasket, DefaultProduct, SellOptions } = require('./const')

const openGame = async (driver) => {
    const appId = 'vn.kvtm.js'
    const gameId = 'game'
    const shopGemId = 'shop-gem'
    await driver.press(KeyCode.HOME)
    await driver.closeApp(appId)
    await driver.openApp(appId)
    await driver.sleep(5)
    // reset current window size
    await driver.setCurrentWindowSize()

    let count = 0
    while (!(await driver.haveItemOnScreen(_getItemId(gameId)))) {
        if (count > 10) {
            return await openGame(driver)
        } else {
            await driver.sleep(1)
            count++
        }
    }
    await driver.tapItemOnScreen(_getItemId(gameId))
    await driver.sleep(15)

    // reset current window size
    await driver.setCurrentWindowSize()

    for (let i = 0; i < 10; i++) {
        await driver.press(KeyCode.BACK)
        await driver.sleep(1)
    }
    await driver.tap(58, 72.22)
    await driver.sleep(1)
    if (!(await driver.haveItemOnScreen(_getItemId(shopGemId)))) {
        return await openGame(driver)
    }
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
            { duration: 0, x: 8.75, y: 53.33 },
            { duration: DelayTime * 1000, x: 8.75, y: 83.33 },
        ])
        await driver.sleep(10 * DelayTime)
    }
    await driver.sleep(0.5)
}

const goDown = async (driver, times = 1) => {
    for (let i = 0; i < times; i++) {
        await driver.action([
            { duration: 0, x: 8.75, y: 83.33 },
            { duration: DelayTime * 1000, x: 8.75, y: 53.33 },
        ])
        await driver.sleep(10 * DelayTime)
    }
    await driver.sleep(0.5)
}

const goDownLast = async (driver) => {
    // go up
    await goUp(driver)

    // click go down last 2 times
    await driver.tap(50.63, 97.78)
    await driver.sleep(DelayTime)
    await driver.tap(50.63, 97.78)
    await driver.sleep(0.75)
}

const harvestTrees = async (driver) => {
    const itemId = 'thu-hoach'
    const { x, y } = DefaultBasket

    let count = 0
    do {
        if (count > 10) throw new Error('Screen is not found "thu-hoach" item')
        await driver.tap(37.5, 84.44)
        await driver.sleep(0.5)
        count++
    } while (!(await driver.haveItemOnScreen(_getItemId(itemId))))

    const pointList = [{ duration: 0, x: x, y: y }]
    const duration = DelayTime * 1000

    // floor 1
    for (let i = 0; i < FirstRowSlotList.length; i++) {
        pointList.push({
            duration: duration,
            x: FirstRowSlotList[i].x,
            y: FirstRowSlotList[i].y,
        })
    }

    // floor 2
    for (let i = 0; i < SecondRowSlotList.length; i++) {
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
    const itemId = 'next-option'
    let count = 0

    // open
    do {
        if (count > 10) throw new Error('Screen is not found "next-option" item')
        await driver.tap(37.5, 84.44)
        await driver.sleep(0.5)
        count++
    } while (!(await driver.haveItemOnScreen(_getItemId(itemId))))

    const pointList = [{ duration: 0, x: x, y: y }]
    const duration = DelayTime * 1000
    // floor 1
    for (let i = 0; i < FirstRowSlotList.length && floor >= 1; i++) {
        if (i > 2 * pot && floor == 1) break
        pointList.push({
            duration: duration,
            x: FirstRowSlotList[i].x,
            y: FirstRowSlotList[i].y,
        })
    }

    // floor 2
    for (let i = 0; i < SecondRowSlotList.length && floor >= 2; i++) {
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
    const itemId = 'o-trong-san-xuat'
    const position = { x: 21.875, y: floor == 1 ? 81.11 : 32.22 }

    for (let i = 0; i < 10; i++) {
        await driver.tap(position.x, position.y)
        await driver.sleep(0.2)
    }
    // chan chan mo duoc o san xuat
    do {
        await driver.tap(position.x, position.y)
        await driver.sleep(0.1)
    } while (!(await driver.haveItemOnScreen(_getItemId(itemId))))

    // make goods
    const { x, y } = MakeSlotList[slot]

    for (let i = 0; i < number; i++) {
        await driver.action([
            { duration: 0, x: x, y: y },
            { duration: 100, x: DefaultProduct.x, y: DefaultProduct.y },
        ])
        await driver.sleep(0.4)
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
    await driver.sleep(0.5)

    let isFound = await driver.haveItemOnScreen(_getItemId(itemId))

    while (!isFound) {
        await driver.tap(40.625, 67.78)
        await driver.sleep(0.5)

        isFound = await driver.haveItemOnScreen(_getItemId(itemId))
    }

    await driver.press(KeyCode.BACK)
    await driver.sleep(0.5)
}

const prevTrees = async (driver, itemId) => {
    await driver.tap(37.5, 84.44)
    await driver.sleep(0.5)

    let isFound = await driver.haveItemOnScreen(_getItemId(itemId))

    while (!isFound) {
        await driver.tap(10, 67.78)
        await driver.sleep(0.5)

        isFound = await driver.haveItemOnScreen(_getItemId(itemId))
    }

    await driver.press(KeyCode.BACK)
    await driver.sleep(0.5)
}

const sellItems = async (driver, option, items) => {
    const { x: option_x, y: option_y } = SellOptions[option]

    // open
    await driver.tap(66.25, 71.11)
    await driver.sleep(1)

    // back front market
    await driver.action([
        { duration: 0, x: 16.25, y: 60.0 },
        { duration: 200, x: 78.75, y: 60.0 },
    ])
    await driver.sleep(0.5)

    // back front market
    await driver.action([
        { duration: 0, x: 16.25, y: 60.0 },
        { duration: 200, x: 78.75, y: 60.0 },
    ])
    await driver.sleep(0.5)

    // buy all items
    const emptySlotId = 'o-trong-ban'
    const soldSlotId = 'o-da-ban'
    let itemId = _getItemId(items)
    let count = 0
    while (itemId) {
        if (await driver.haveItemOnScreen(_getItemId(soldSlotId))) {
            await driver.doubleTapItemOnScreen(_getItemId(soldSlotId))
            await driver.sleep(0.5)
            await driver.tap(option_x, option_y)
            await driver.sleep(0.5)

            // choose item by image
            await driver.tapItemOnScreen(itemId)
            await _sell(driver)
            itemId = _getItemId(items)
        } else if (await driver.haveItemOnScreen(_getItemId(emptySlotId))) {
            await driver.tapItemOnScreen(_getItemId(emptySlotId))
            await driver.sleep(0.5)
            await driver.tap(option_x, option_y)
            await driver.sleep(0.5)

            // choose item by image
            await driver.tapItemOnScreen(itemId)
            await _sell(driver)
            itemId = _getItemId(items)
        } else {
            await driver.action([
                { duration: 0, x: 84.375, y: 60.0 },
                { duration: 3 * 1000, x: 21.875, y: 60.0 },
            ])
            await driver.sleep(0.5)
            count++
        }

        if (count > 2) {
            // click ads
            await driver.tap(25.63, 36.67) // click first slot
            await driver.sleep(0.5)
            await driver.tap(50.0, 93.33)
            await driver.sleep(0.5)
            await driver.tap(62.5, 7.78)
            await driver.sleep(0.5)

            await backToGame(driver)
            // setup item
            _rollbackItem(items, itemId)
            return await sellItems(driver, option, items)
        }
    }
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

const _rollbackItem = (items, key) => {
    if (typeof items === 'object') {
        const foundIndex = items.findIndex((element) => element.key == key)
        if (foundIndex >= 0) {
            items[foundIndex].value++
        }
    }
}

const _sell = async (driver) => {
    await driver.sleep(0.5)
    // increase price
    for (let i = 0; i < 10; i++) {
        await driver.tap(82.5, 60.0)
        await driver.sleep(DelayTime)
    }
    await driver.sleep(0.5)
    // stop increase price
    await driver.tap(73.75, 91.11)
    await driver.sleep(0.5)
    await driver.tap(50.0, 93.33)
    await driver.sleep(0.5)
    await driver.tap(62.5, 7.78)
    await driver.sleep(0.5)
}
