const { KeyCode, SwipeDirection } = require('../../lib/webdriverio')
const {
    DelayTime,
    MakeSlotList,
    FirstRowSlotList,
    SecondRowSlotList,
    DefaultBasket,
    DefaultProduct,
    SellOptions,
    ItemKeys,
    SellItemOptions,
    SellSlotList,
    FriendHouseList,
    PlantSlotList,
    SlotPositions,
} = require('./const')

const { resolve } = require('path')

const openGame = async (driver) => {
    await driver.press(KeyCode.HOME)
    await driver.closeApp(ItemKeys.gameId)
    await driver.openApp(ItemKeys.gameId)
    await driver.sleep(5)
    // reset current window size
    await driver.setCurrentWindowSize()

    let count = 0
    let gamePosition = null
    while (!gamePosition) {
        if (count > 10) {
            gamePosition = { x: 17.55, y: 62.125 }
            break
        }
        gamePosition = await driver.getCoordinateItemOnScreen(_getItemPath(ItemKeys.game), SlotPositions.p2)
        await driver.sleep(1)
        count++
    }
    await driver.tap(gamePosition.x, gamePosition.y)
    await driver.sleep(15)

    // reset current window size
    await driver.setCurrentWindowSize()

    for (let i = 0; i < 10; i++) {
        await driver.press(KeyCode.BACK)
        await driver.sleep(1)
    }
    await driver.tap(58, 72.22)
    await driver.sleep(1)
    if (!(await driver.haveItemOnScreen(_getItemPath(ItemKeys.shopGem), SlotPositions.p3))) {
        return await openGame(driver)
    }
}

const openChests = async (driver) => {
    let isFound = await driver.haveItemOnScreen(_getItemPath(ItemKeys.chest), SlotPositions.p1)
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
        await driver.swipe({ x: 50, y: 50 }, { x: 50, y: 90 }, SwipeDirection.DOWN)
        await driver.sleep(10 * DelayTime)
    }
    await driver.sleep(0.5)
}

const goDown = async (driver, times = 1) => {
    for (let i = 0; i < times; i++) {
        await driver.swipe({ x: 50, y: 90 }, { x: 50, y: 50 }, SwipeDirection.UP)
        await driver.sleep(10 * DelayTime)
    }
    await driver.sleep(0.5)
}

const goDownLast = async (driver) => {
    await goUp(driver)
    await driver.tap(50.63, 97.78)
    await driver.sleep(0.75)
}

const harvestTrees = async (driver) => {
    const { x, y } = DefaultBasket
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

    await driver.sleep(0.5)
    await driver.tap(37.5, 84.44)
    await driver.sleep(0.5)

    let count = 0
    while (!(await driver.haveItemOnScreen(_getItemPath(ItemKeys.harvestBasket), SlotPositions.p3))) {
        if (count > 5) throw new Error(`Screen is not found ${ItemKeys.harvestBasket} item`)
        await driver.tap(37.5, 84.44)
        await driver.sleep(0.5)
        count++
    }

    await driver.action(pointList)
    await driver.sleep(0.5)
}

const plantTrees = async (driver, slotTree, floor = 2, pot = 5) => {
    const pointList = [{ duration: 0, x: slotTree.x, y: slotTree.y }]
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

    await driver.sleep(0.5)
    await driver.tap(37.5, 84.44)
    await driver.sleep(0.5)
    await driver.action(pointList)
    await driver.sleep(0.5)
}

const makeItems = async (driver, floor = 1, slot = 0, number = 1) => {
    // open
    const position = { x: 21.875, y: floor == 1 ? 81.11 : 32.22 }

    for (let i = 0; i < 10; i++) {
        await driver.tap(position.x, position.y)
        await driver.sleep(0.2)
    }
    // chan chan mo duoc o san xuat
    let count = 0
    do {
        if (count > 10) throw new Error(`Screen is not found ${ItemKeys.emptyProductionSlot} item`)
        await driver.tap(position.x, position.y)
        await driver.sleep(0.1)
        count++
    } while (!(await driver.haveItemOnScreen(_getItemPath(ItemKeys.emptyProductionSlot), SlotPositions.p4)))

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
    let itemId = _getItemId(items)
    let count = 0
    while (itemId) {
        var soldSlot = await driver.getCoordinateItemOnScreen(_getItemPath(ItemKeys.soldSlot))
        if (soldSlot !== null) {
            await driver.tap(soldSlot.x, soldSlot.y)
            await driver.sleep(0.5)
            await driver.tap(soldSlot.x, soldSlot.y)
            await driver.sleep(0.5)
            await driver.tap(option_x, option_y)
            await driver.sleep(0.5)

            // choose item by image
            await driver.tapItemOnScreen(_getItemPath(itemId), SlotPositions.p1p3)
            await _sell(driver)
            itemId = _getItemId(items)
            continue
        }

        var emptySlot = await driver.getCoordinateItemOnScreen(_getItemPath(ItemKeys.emptySellSlot))

        if (emptySlot != null) {
            await driver.tap(emptySlot.x, emptySlot.y)
            await driver.sleep(0.5)
            await driver.tap(option_x, option_y)
            await driver.sleep(0.5)

            // choose item by image
            await driver.tapItemOnScreen(_getItemPath(itemId), SlotPositions.p1p3)
            await _sell(driver)
            itemId = _getItemId(items)
            continue
        }

        await driver.action([
            { duration: 0, x: 84.375, y: 60.0 },
            { duration: 3 * 1000, x: 21.875, y: 60.0 },
        ])
        await driver.sleep(0.5)
        count++

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

const findTreeOnScreen = async (driver, treeKey, isFindNext = true) => {
    await driver.tap(37.5, 84.44)
    await driver.sleep(0.5)

    let slotItem = await driver.getCoordinateItemOnScreen(_getItemPath(treeKey), SlotPositions.p3)
    let retryCount = 0

    while (!slotItem && retryCount++ < 10) {
        isFindNext ? await driver.tap(40.625, 67.78) : await driver.tap(10, 67.78)
        await driver.sleep(0.5)

        slotItem = await driver.getCoordinateItemOnScreen(_getItemPath(treeKey), SlotPositions.p3)
    }

    if (retryCount > 10) throw new Error(`Screen is not found ${treeKey} item`)

    await driver.press(KeyCode.BACK)
    await driver.sleep(0.5)

    return _getSlotNearest(slotItem)
}

const sellEventItems = async (driver, itemKey, isAds) => {
    const { x: option_x, y: option_y } = SellOptions[SellItemOptions.events] // event item
    // open
    await driver.tap(66.25, 71.11)
    await driver.sleep(1)

    for (let i = 0; i < SellSlotList.length; i++) {
        const slot = SellSlotList[i]
        // double tap on slot
        await driver.tap(slot.x, slot.y)
        await driver.sleep(0.1)
        await driver.tap(slot.x, slot.y)
        await driver.sleep(0.5)
        // switch to event item
        await driver.tap(option_x, option_y)
        await driver.sleep(0.5)

        const eventItemSlot = await driver.getCoordinateItemOnScreen(_getItemPath(itemKey), SlotPositions.p1p3)
        if (!eventItemSlot) throw new Error(`Screen is not found ${itemKey} item`)

        await driver.tap(eventItemSlot.x, eventItemSlot.y)
        await _sell(driver, isAds)
    }
}

const buy8SlotItem = async (driver) => {
    // open
    await driver.tap(66.25, 71.11)
    await driver.sleep(1)

    let count = 5;
    while (count-- > 0) {
        for (let i = 0; i < SellSlotList.length; i++) {
            const slot = SellSlotList[i]
            // double tap on slot for buy
            await driver.tap(slot.x, slot.y)
            await driver.sleep(0.1)
            await driver.tap(slot.x, slot.y)
            await driver.sleep(0.1)
        }
    }

    await backToGame(driver)
}

const goFriendHouse = async (driver, index) => {
    const { x, y } = FriendHouseList[index]
    await driver.tapItemOnScreen(_getItemPath(ItemKeys.friendHouse), SlotPositions.p4)
    await driver.sleep(0.5)
    await driver.tap(x, y)
    await driver.sleep(2)
}

const goMyHouse = async (driver) => {
    await driver.tapItemOnScreen(_getItemPath(ItemKeys.myHouse), SlotPositions.p3)
    await driver.sleep(2)
}

const makeFoods = async (driver) => {
    if (await driver.tapItemOnScreen(_getItemPath(ItemKeys.livestockEvents))) {
        await driver.sleep(2)
        for (let i = 0; i < 5; i++) {
            await driver.tap(17, 70)
            await driver.sleep(1)
        }

        for (let i = 0; i < 3; i++) {
            await driver.action([
                { duration: 0, x: 40, y: 26 },
                { duration: 100, x: 17, y: 62.5 },
            ])
            await driver.sleep(1)
        }
        await backToGame(driver)
        await driver.sleep(1)
        await backToGame(driver)
    }
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
    sellItems,
    findTreeOnScreen,
    sellEventItems,
    buy8SlotItem,
    goFriendHouse,
    goMyHouse,
    makeFoods
}

// private method

const _getItemPath = (itemId) => {
    if (!itemId) return null
    return resolve(__dirname, `./item/${itemId}.png`)
}

const _getItemId = (items) => {
    if (typeof items === 'object') {
        const foundIndex = items.findIndex((element) => element.value > 0)
        if (foundIndex >= 0) {
            items[foundIndex].value--
            return items[foundIndex].key
        }
        return null
    }

    return null
}

const _rollbackItem = (items, key) => {
    if (typeof items === 'object') {
        const foundIndex = items.findIndex((element) => element.key == key)
        if (foundIndex >= 0) {
            items[foundIndex].value++
        }
    }
}

const _sell = async (driver, isAds = true) => {
    await driver.sleep(0.5)
    // increase price
    for (let i = 0; i < 10; i++) {
        await driver.tap(82.5, 60.0)
        await driver.sleep(DelayTime)
    }
    await driver.sleep(0.5)
    // stop increase price
    if (!isAds) {
        // disable ads
        await driver.tap(73.75, 78.88)
        await driver.sleep(0.5)
        // click sell
        await driver.tap(73.75, 91.11)
        await driver.sleep(0.5)
        await driver.tap(62.5, 7.78)
        await driver.sleep(0.5)
    } else {
        // click sell
        await driver.tap(73.75, 91.11)
        await driver.sleep(0.5)
        await driver.tap(50.0, 93.33)
        await driver.sleep(0.5)
        await driver.tap(62.5, 7.78)
        await driver.sleep(0.5)
    }
}

const _getSlotNearest = (slotFound) => {
    let min = Number.MAX_VALUE
    let choice = 0
    for (let i = 0; i < PlantSlotList.length; i++) {
        let slot = PlantSlotList[i]
        let value = Math.abs(slot.x - slotFound.x) * Math.abs(slot.x - slotFound.x) + Math.abs(slot.y - slotFound.y) * Math.abs(slot.y - slotFound.y)

        if (value < min) {
            min = value
            choice = i
        }
    }
    return PlantSlotList[choice]
}
