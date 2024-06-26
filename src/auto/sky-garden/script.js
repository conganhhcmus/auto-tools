const { SellSlotList, PlantSlotList, MakeSlotList, FirstRowSlotList, SecondRowSlotList, DefaultBasket, DefaultProduct, SellOptions } = require('./constance')
const Device = require('../core/device')
const Image = require('../core/image')

//#region private function
const _Move = (client, pointA, pointB, steps = 1) => {
    const distance_x = Math.abs(pointA.x - pointB.x) / steps
    const distance_y = Math.abs(pointA.y - pointB.y) / steps

    client.touchMove(pointA.x, pointA.y).sleep(5)

    for (let i = 0; i < steps; i++) {
        if (pointA.x <= pointB.x && pointA.y <= pointB.y) {
            client.touchMove(Math.floor(pointA.x + i * distance_x), Math.floor(pointA.y + i * distance_y)).sleep(5)
        } else if (pointA.x >= pointB.x && pointA.y <= pointB.y) {
            client.touchMove(Math.floor(pointA.x - i * distance_x), Math.floor(pointA.y + i * distance_y)).sleep(5)
        } else if (pointA.x <= pointB.x && pointA.y >= pointB.y) {
            client.touchMove(Math.floor(pointA.x + i * distance_x), Math.floor(pointA.y - i * distance_y)).sleep(5)
        } else {
            client.touchMove(Math.floor(pointA.x - i * distance_x), Math.floor(pointA.y - i * distance_y)).sleep(5)
        }
    }
}

const _plantBySlot = (client, calc, slot, floor = 2) => {
    const [calc_X, calc_Y] = calc
    const { x, y } = PlantSlotList[slot]

    client.touchDown(calc_X(x), calc_Y(y)).sleep(5)

    _Move(client, { x: calc_X(x), y: calc_Y(y) }, { x: calc_X(FirstRowSlotList[0].x), y: calc_Y(FirstRowSlotList[0].y) }, 5)

    // floor 1
    for (let i = 0; i < FirstRowSlotList.length - 1; i++) {
        _Move(
            client,
            {
                x: calc_X(FirstRowSlotList[i].x),
                y: calc_Y(FirstRowSlotList[i].y),
            },
            {
                x: calc_X(FirstRowSlotList[i + 1].x),
                y: calc_Y(FirstRowSlotList[i + 1].y),
            },
            5
        )
    }

    _Move(
        client,
        {
            x: calc_X(FirstRowSlotList[FirstRowSlotList.length - 1].x),
            y: calc_Y(FirstRowSlotList[FirstRowSlotList.length - 1].y),
        },
        {
            x: calc_X(SecondRowSlotList[0].x),
            y: calc_Y(SecondRowSlotList[0].y),
        },
        5
    )

    // floor 2
    if (floor === 2) {
        for (let i = 0; i < SecondRowSlotList.length - 1; i++) {
            _Move(
                client,
                {
                    x: calc_X(SecondRowSlotList[i].x),
                    y: calc_Y(SecondRowSlotList[i].y),
                },
                {
                    x: calc_X(SecondRowSlotList[i + 1].x),
                    y: calc_Y(SecondRowSlotList[i + 1].y),
                },
                5
            )
        }

        client.touchUp(calc_X(SecondRowSlotList[SecondRowSlotList.length - 1].x), calc_Y(SecondRowSlotList[SecondRowSlotList.length - 1].y)).sleep(500)
    } else {
        client.touchUp(calc_X(SecondRowSlotList[0].x), calc_Y(SecondRowSlotList[0].y)).sleep(500)
    }
}

const _plantHalfBySlot_1st = (client, calc, slot, index = 6) => {
    const [calc_X, calc_Y] = calc
    const { x, y } = PlantSlotList[slot]

    client.touchDown(calc_X(x), calc_Y(y)).sleep(5)

    _Move(client, { x: calc_X(x), y: calc_Y(y) }, { x: calc_X(FirstRowSlotList[0].x), y: calc_Y(FirstRowSlotList[0].y) }, 5)

    // floor 1
    for (let i = 0; i < index; i++) {
        _Move(
            client,
            {
                x: calc_X(FirstRowSlotList[i].x),
                y: calc_Y(FirstRowSlotList[i].y),
            },
            {
                x: calc_X(FirstRowSlotList[i + 1].x),
                y: calc_Y(FirstRowSlotList[i + 1].y),
            },
            5
        )
    }

    client.touchUp(calc_X(FirstRowSlotList[index - 1].x), calc_Y(FirstRowSlotList[index - 1].y)).sleep(500)
}

const _plantHalfBySlot_2nd = (client, calc, slot, index = 6) => {
    const [calc_X, calc_Y] = calc
    const { x, y } = PlantSlotList[slot]

    client.touchDown(calc_X(x), calc_Y(y)).sleep(5)

    _Move(client, { x: calc_X(x), y: calc_Y(y) }, { x: calc_X(FirstRowSlotList[0].x), y: calc_Y(FirstRowSlotList[0].y) }, 5)

    // floor 1
    for (let i = 0; i < FirstRowSlotList.length - 1; i++) {
        _Move(
            client,
            {
                x: calc_X(FirstRowSlotList[i].x),
                y: calc_Y(FirstRowSlotList[i].y),
            },
            {
                x: calc_X(FirstRowSlotList[i + 1].x),
                y: calc_Y(FirstRowSlotList[i + 1].y),
            },
            5
        )
    }

    _Move(
        client,
        {
            x: calc_X(FirstRowSlotList[FirstRowSlotList.length - 1].x),
            y: calc_Y(FirstRowSlotList[FirstRowSlotList.length - 1].y),
        },
        {
            x: calc_X(SecondRowSlotList[0].x),
            y: calc_Y(SecondRowSlotList[0].y),
        },
        5
    )

    // floor 2

    for (let i = 0; i < index + 1; i++) {
        _Move(
            client,
            {
                x: calc_X(SecondRowSlotList[i].x),
                y: calc_Y(SecondRowSlotList[i].y),
            },
            {
                x: calc_X(SecondRowSlotList[i + 1].x),
                y: calc_Y(SecondRowSlotList[i + 1].y),
            },
            5
        )
    }

    client.touchUp(calc_X(SecondRowSlotList[index].x), calc_Y(SecondRowSlotList[index].y)).sleep(500)
}

const _makeGoodsBySlot = (client, calc, slot = 0, number = 1) => {
    const [calc_X, calc_Y] = calc
    const { x, y } = MakeSlotList[slot]
    const [produce_x, produce_y] = DefaultProduct

    for (let i = 0; i < number; i++) {
        client.touchDown(calc_X(x), calc_Y(y)).sleep(5)
        _Move(client, { x: calc_X(x), y: calc_Y(y) }, { x: calc_X(produce_x), y: calc_Y(produce_y) }, 5)
        client.touchUp(calc_X(produce_x), calc_Y(produce_y)).sleep(500)
    }
}
//#endregion

const Sleep = async (device, sec = 1) => {
    const runningDevice = await Device.CreateDevice(device)
    let client = runningDevice.client
    client.sleep(sec * 1000)
    return await Execute(runningDevice)
}

const GoDownLast = async (device) => {
    await GoUp(device)
    const runningDevice = await Device.CreateDevice(device)
    const [calc_X, calc_Y] = runningDevice.Calculator()

    let client = runningDevice.client
    client.tap(calc_X(405), calc_Y(430)).sleep(1 * 1000)

    return await Execute(runningDevice)
}

const GoDown = async (device, number = 1) => {
    const runningDevice = await Device.CreateDevice(device)

    const [calc_X, calc_Y] = runningDevice.Calculator()

    for (let i = 0; i < number; i++) {
        let client = runningDevice.client
        client
            .touchDown(calc_X(730), calc_Y(300))
            .sleep(5)
            .touchMove(calc_X(730), calc_Y(280))
            .sleep(5)
            .touchMove(calc_X(730), calc_Y(260))
            .sleep(5)
            .touchMove(calc_X(730), calc_Y(240))
            .sleep(5)
            .touchMove(calc_X(730), calc_Y(220))
            .sleep(5)
            .touchMove(calc_X(730), calc_Y(200))
            .sleep(5)
            .touchUp(calc_X(730), calc_Y(200))
            .sleep(i == number - 1 ? 500 : 5)
    }

    return await Execute(runningDevice)
}

const GoUp = async (device, number = 1) => {
    const runningDevice = await Device.CreateDevice(device)

    const [calc_X, calc_Y] = runningDevice.Calculator()

    for (let i = 0; i < number; i++) {
        let client = runningDevice.client

        client
            .touchDown(calc_X(730), calc_Y(200))
            .sleep(5)
            .touchMove(calc_X(730), calc_Y(220))
            .sleep(5)
            .touchMove(calc_X(730), calc_Y(240))
            .sleep(5)
            .touchMove(calc_X(730), calc_Y(260))
            .sleep(5)
            .touchMove(calc_X(730), calc_Y(280))
            .sleep(5)
            .touchMove(calc_X(730), calc_Y(300))
            .sleep(5)
            .touchUp(calc_X(730), calc_Y(300))
            .sleep(i == number - 1 ? 500 : 5)
    }

    return await Execute(runningDevice)
}

const OpenGame = async (device) => {
    const packageName = 'vn.kvtm.js'
    const items = 'game'

    await Device.CloseApp(device, packageName)
    await Device.OpenApp(device, packageName)

    let runningDevice = await Device.CreateDevice(device)
    let [calc_X, calc_Y] = runningDevice.Calculator()
    let client = runningDevice.client

    // wait 10s
    client.sleep(10 * 1000)
    await Execute(runningDevice)

    runningDevice = await Device.CreateDevice(device)
    client = runningDevice.client
    ;[calc_X, calc_Y] = runningDevice.Calculator()

    const [pointX, pointY] = await Image.GetCoordinatesItem(device.id, GetItemId(items), [80, 510])
    client
        .tap(calc_X(pointX), calc_Y(pointY))
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
        .tap(calc_X(470), calc_Y(325))
        .sleep(1 * 1000)
        .tap(calc_X(770), calc_Y(165))
        .sleep(1.5 * 1000)
        .press('KEYCODE_BACK')
        .sleep(500)
        .press('KEYCODE_BACK')
        .sleep(500)
        .press('KEYCODE_BACK')
        .sleep(500)
        .tap(calc_X(470), calc_Y(325))
        .sleep(1 * 1000)

    return await Execute(runningDevice)
}

const OpenChests = async (device) => {
    const itemId = 'ruong-bau'
    let found = false
    let count = 3

    while (!found && count > 0) {
        found = await Image.IsIncludeItem(device.id, itemId)
        count--
    }

    if (found) {
        const runningDevice = await Device.CreateDevice(device)
        const [calc_X, calc_Y] = runningDevice.Calculator()
        let client = runningDevice.client

        client
            .tap(calc_X(280), calc_Y(100))
            .sleep(500)
            .tap(calc_X(280), calc_Y(100))
            .sleep(1 * 1000)
            .tap(calc_X(170), calc_Y(355))
            .sleep(500)
            .tap(calc_X(170), calc_Y(355))
            .sleep(1 * 1000)
            .tap(calc_X(400), calc_Y(280))
            .sleep(500)
            .tap(calc_X(400), calc_Y(280))
            .sleep(500)
            .tap(calc_X(400), calc_Y(280))
            .sleep(500)
            .tap(calc_X(400), calc_Y(280))
            .sleep(500)
            .tap(calc_X(400), calc_Y(280))
            .sleep(500)
            .tap(calc_X(400), calc_Y(280))
            .sleep(500)
            .tap(calc_X(400), calc_Y(280))
            .sleep(500)
            .tap(calc_X(400), calc_Y(280))
            .sleep(500)
            .tap(calc_X(400), calc_Y(280))
            .sleep(500)
            .tap(calc_X(400), calc_Y(280))
            .sleep(1 * 1000)
            //back to game
            .press('KEYCODE_BACK')
            .sleep(100)
            .press('KEYCODE_BACK')
            .sleep(100)
            .press('KEYCODE_BACK')
            .sleep(100)
            .tap(calc_X(470), calc_Y(325))
            .sleep(500)

        return await Execute(runningDevice)
    }
}

const HarvestTrees = async (device) => {
    const runningDevice = await Device.CreateDevice(device)
    const [calc_X, calc_Y] = runningDevice.Calculator()
    const [x, y] = DefaultBasket

    let client = runningDevice.client

    client.tap(calc_X(300), calc_Y(380)).sleep(1 * 1000)

    client.touchDown(calc_X(x), calc_Y(y)).sleep(5)

    _Move(client, { x: calc_X(x), y: calc_Y(y) }, { x: calc_X(FirstRowSlotList[0].x), y: calc_Y(FirstRowSlotList[0].y) }, 5)

    // floor 1
    for (let i = 0; i < FirstRowSlotList.length - 1; i++) {
        _Move(
            client,
            {
                x: calc_X(FirstRowSlotList[i].x),
                y: calc_Y(FirstRowSlotList[i].y),
            },
            {
                x: calc_X(FirstRowSlotList[i + 1].x),
                y: calc_Y(FirstRowSlotList[i + 1].y),
            },
            5
        )
    }

    _Move(
        client,
        {
            x: calc_X(FirstRowSlotList[FirstRowSlotList.length - 1].x),
            y: calc_Y(FirstRowSlotList[FirstRowSlotList.length - 1].y),
        },
        {
            x: calc_X(SecondRowSlotList[0].x),
            y: calc_Y(SecondRowSlotList[0].y),
        },
        5
    )

    // floor 2
    for (let i = 0; i < SecondRowSlotList.length - 1; i++) {
        _Move(
            client,
            {
                x: calc_X(SecondRowSlotList[i].x),
                y: calc_Y(SecondRowSlotList[i].y),
            },
            {
                x: calc_X(SecondRowSlotList[i + 1].x),
                y: calc_Y(SecondRowSlotList[i + 1].y),
            },
            5
        )
    }

    client.touchUp(calc_X(SecondRowSlotList[SecondRowSlotList.length - 1].x), calc_Y(SecondRowSlotList[SecondRowSlotList.length - 1].y)).sleep(500)

    return await Execute(runningDevice)
}

const BackToGame = async (device) => {
    const runningDevice = await Device.CreateDevice(device)
    const [calc_X, calc_Y] = runningDevice.Calculator()
    let client = runningDevice.client

    client.press('KEYCODE_BACK').sleep(100).press('KEYCODE_BACK').sleep(100).press('KEYCODE_BACK').sleep(100).tap(calc_X(470), calc_Y(325)).sleep(500)

    return await Execute(runningDevice)
}

const PlantTrees = async (device, slot = 0, floor = 2) => {
    const runningDevice = await Device.CreateDevice(device)
    const [calc_X, calc_Y] = runningDevice.Calculator()

    let client = runningDevice.client
    // open
    client.tap(calc_X(300), calc_Y(380)).sleep(1.5 * 1000)

    _plantBySlot(client, [calc_X, calc_Y], slot, floor)

    return await Execute(runningDevice)
}

const PlantTrees_Half = async (device, slot = 0, index, floor = 1) => {
    const runningDevice = await Device.CreateDevice(device)
    const [calc_X, calc_Y] = runningDevice.Calculator()

    let client = runningDevice.client
    // open
    client.tap(calc_X(300), calc_Y(380)).sleep(1.5 * 1000)

    if (floor == 1) _plantHalfBySlot_1st(client, [calc_X, calc_Y], slot, index)
    else _plantHalfBySlot_2nd(client, [calc_X, calc_Y], slot, index)

    return await Execute(runningDevice)
}

const MakeGoods = async (device, slot = 0, number = 1) => {
    const runningDevice = await Device.CreateDevice(device)
    let client = runningDevice.client
    const [calc_X, calc_Y] = runningDevice.Calculator()

    // open
    for (let i = 0; i < 15; i++) {
        client.tap(calc_X(175), calc_Y(410)).sleep(200)
    }

    client.sleep(1 * 1000)

    // make goods
    _makeGoodsBySlot(client, [calc_X, calc_Y], slot, number)

    // fix & close
    client
        .tap(calc_X(80), calc_Y(313))
        .sleep(500)
        .tap(calc_X(630), calc_Y(320))
        .sleep(500)
        .press('KEYCODE_BACK')
        .sleep(1 * 1000)

    return await Execute(runningDevice)
}

const MakeGoods_2 = async (device, slot = 0, number = 1) => {
    const runningDevice = await Device.CreateDevice(device)
    let client = runningDevice.client
    const [calc_X, calc_Y] = runningDevice.Calculator()

    // open
    for (let i = 0; i < 15; i++) {
        client.tap(calc_X(175), calc_Y(200)).sleep(200)
    }

    client.sleep(1 * 1000)

    // make goods
    _makeGoodsBySlot(client, [calc_X, calc_Y], slot, number)

    // fix & close
    client
        .tap(calc_X(80), calc_Y(110))
        .sleep(500)
        .tap(calc_X(630), calc_Y(320))
        .sleep(500)
        .press('KEYCODE_BACK')
        .sleep(1 * 1000)

    return await Execute(runningDevice)
}

const SellGoods = async (device, slots = [], option, items) => {
    let runningDevice = await Device.CreateDevice(device)
    let [calc_X, calc_Y] = runningDevice.Calculator()
    let client = runningDevice.client

    // open
    client.tap(calc_X(555), calc_Y(340)).sleep(1 * 1000)

    await Execute(runningDevice)

    //sell by slots
    const { x: option_x, y: option_y } = SellOptions[option]

    for (const slot of slots) {
        runningDevice = await Device.CreateDevice(device)
        client = runningDevice.client
        ;[calc_X, calc_Y] = runningDevice.Calculator()

        const { x, y } = SellSlotList[slot]
        client.tap(calc_X(x), calc_Y(y)).sleep(500).tap(calc_X(x), calc_Y(y)).sleep(500).tap(calc_X(option_x), calc_Y(option_y)).sleep(500)
        await Execute(runningDevice)

        // choose item by image
        const [pointX, pointY] = await Image.GetCoordinatesItem(device.id, GetItemId(items), [70, 130])

        runningDevice = await Device.CreateDevice(device)
        client = runningDevice.client
        ;[calc_X, calc_Y] = runningDevice.Calculator()

        client
            .tap(calc_X(pointX), calc_Y(pointY))
            .sleep(500)
            // increase price
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(500)
            // stop increase price
            .tap(calc_X(590), calc_Y(410))
            .sleep(500)
            .tap(calc_X(400), calc_Y(420))
            .sleep(500)
            .tap(calc_X(500), calc_Y(35))
            .sleep(500)

        await Execute(runningDevice)
    }

    // close
    runningDevice = await Device.CreateDevice(device)
    client = runningDevice.client
    ;[calc_X, calc_Y] = runningDevice.Calculator()

    client.press('KEYCODE_BACK').sleep(100).press('KEYCODE_BACK').sleep(100).press('KEYCODE_BACK').sleep(100).tap(calc_X(470), calc_Y(325)).sleep(500)

    return await Execute(runningDevice)
}

const SellFullGoods = async (device, slotA, slotB, slotC, option, items) => {
    let runningDevice = await Device.CreateDevice(device)
    let [calc_X, calc_Y] = runningDevice.Calculator()
    let client = runningDevice.client

    const { x: option_x, y: option_y } = SellOptions[option]
    // const slotA = [0, 1, 2, 3, 4, 5, 6, 7]
    // const slotB = [0, 1, 2, 3, 4, 5, 6, 7]
    // const slotC = [1, 2, 5, 6]

    // open
    client.tap(calc_X(555), calc_Y(340)).sleep(1 * 1000)

    // back front market
    client.touchDown(calc_X(130), calc_Y(270)).sleep(5)
    _Move(client, { x: calc_X(130), y: calc_Y(270) }, { x: calc_X(630), y: calc_Y(270) }, 50)
    client.touchUp(calc_X(630), calc_Y(270)).sleep(500)

    // back front market
    client.touchDown(calc_X(130), calc_Y(270)).sleep(5)
    _Move(client, { x: calc_X(130), y: calc_Y(270) }, { x: calc_X(630), y: calc_Y(270) }, 50)
    client.touchUp(calc_X(630), calc_Y(270)).sleep(500)

    await Execute(runningDevice)

    for (const slot of slotA) {
        runningDevice = await Device.CreateDevice(device)
        client = runningDevice.client
        ;[calc_X, calc_Y] = runningDevice.Calculator()

        const { x, y } = SellSlotList[slot]

        client.tap(calc_X(x), calc_Y(y)).sleep(500).tap(calc_X(x), calc_Y(y)).sleep(500).tap(calc_X(option_x), calc_Y(option_y)).sleep(500)

        await Execute(runningDevice)

        // choose item by image
        const [pointX, pointY] = await Image.GetCoordinatesItem(device.id, GetItemId(items), [70, 130])

        runningDevice = await Device.CreateDevice(device)
        client = runningDevice.client
        ;[calc_X, calc_Y] = runningDevice.Calculator()

        client
            .tap(calc_X(pointX), calc_Y(pointY))
            .sleep(500)
            // increase price
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(500)
            // stop increase price
            .tap(calc_X(590), calc_Y(410))
            .sleep(500)
            .tap(calc_X(400), calc_Y(420))
            .sleep(500)
            .tap(calc_X(500), calc_Y(35))
            .sleep(500)

        await Execute(runningDevice)
    }

    runningDevice = await Device.CreateDevice(device)
    client = runningDevice.client
    ;[calc_X, calc_Y] = runningDevice.Calculator()

    client.touchDown(calc_X(630), calc_Y(270)).sleep(5)
    _Move(client, { x: calc_X(650), y: calc_Y(270) }, { x: calc_X(150), y: calc_Y(270) }, 650)
    client.touchUp(calc_X(130), calc_Y(270)).sleep(500)

    await Execute(runningDevice)

    for (const slot of slotB) {
        runningDevice = await Device.CreateDevice(device)
        client = runningDevice.client
        ;[calc_X, calc_Y] = runningDevice.Calculator()

        const { x, y } = SellSlotList[slot]

        client.tap(calc_X(x), calc_Y(y)).sleep(500).tap(calc_X(x), calc_Y(y)).sleep(500).tap(calc_X(option_x), calc_Y(option_y)).sleep(500)

        await Execute(runningDevice)

        const [pointX, pointY] = await Image.GetCoordinatesItem(device.id, GetItemId(items), [70, 130])

        runningDevice = await Device.CreateDevice(device)
        client = runningDevice.client
        ;[calc_X, calc_Y] = runningDevice.Calculator()

        client
            .tap(calc_X(pointX), calc_Y(pointY))
            .sleep(500)
            // increase price
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(500)
            // stop increase price
            .tap(calc_X(590), calc_Y(410))
            .sleep(500)
            .tap(calc_X(400), calc_Y(420))
            .sleep(500)
            .tap(calc_X(500), calc_Y(35))
            .sleep(500)

        await Execute(runningDevice)
    }

    runningDevice = await Device.CreateDevice(device)
    client = runningDevice.client
    ;[calc_X, calc_Y] = runningDevice.Calculator()

    client.touchDown(calc_X(630), calc_Y(270)).sleep(5)
    _Move(client, { x: calc_X(650), y: calc_Y(270) }, { x: calc_X(150), y: calc_Y(270) }, 650)
    client.touchUp(calc_X(130), calc_Y(270)).sleep(500)

    await Execute(runningDevice)

    for (const slot of slotC) {
        runningDevice = await Device.CreateDevice(device)
        client = runningDevice.client
        ;[calc_X, calc_Y] = runningDevice.Calculator()

        const { x, y } = SellSlotList[slot]

        client.tap(calc_X(x), calc_Y(y)).sleep(500).tap(calc_X(x), calc_Y(y)).sleep(500).tap(calc_X(option_x), calc_Y(option_y)).sleep(500)

        await Execute(runningDevice)

        const [pointX, pointY] = await Image.GetCoordinatesItem(device.id, GetItemId(items), [70, 130])

        runningDevice = await Device.CreateDevice(device)
        client = runningDevice.client
        ;[calc_X, calc_Y] = runningDevice.Calculator()

        client
            .tap(calc_X(pointX), calc_Y(pointY))
            .sleep(500)
            // increase price
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(5)
            .tap(calc_X(660), calc_Y(270))
            .sleep(500)
            // stop increase price
            .tap(calc_X(590), calc_Y(410))
            .sleep(500)
            .tap(calc_X(400), calc_Y(420))
            .sleep(500)
            .tap(calc_X(500), calc_Y(35))
            .sleep(500)

        await Execute(runningDevice)
    }

    runningDevice = await Device.CreateDevice(device)
    client = runningDevice.client
    ;[calc_X, calc_Y] = runningDevice.Calculator()

    // close
    client.press('KEYCODE_BACK').sleep(100).press('KEYCODE_BACK').sleep(100).press('KEYCODE_BACK').sleep(100).tap(calc_X(470), calc_Y(325)).sleep(500)

    return await Execute(runningDevice)
}

const NextTrees = async (device, itemId) => {
    let runningDevice = await Device.CreateDevice(device)
    let client = runningDevice.client
    let [calc_X, calc_Y] = runningDevice.Calculator()

    client.tap(calc_X(300), calc_Y(380)).sleep(1.5 * 1000)

    await Execute(runningDevice)
    let count = 0

    while (!(await Image.IsIncludeItem(device.id, itemId)) && count < 10) {
        runningDevice = await Device.CreateDevice(device)
        client = runningDevice.client
        ;[calc_X, calc_Y] = runningDevice.Calculator()

        client.tap(calc_X(325), calc_Y(305)).sleep(500)

        await Execute(runningDevice)
        count++
    }

    runningDevice = await Device.CreateDevice(device)
    client = runningDevice.client
    ;[calc_X, calc_Y] = runningDevice.Calculator()

    client.press('KEYCODE_BACK').sleep(500)

    await Execute(runningDevice)

    if (count >= 10) return await NextTrees(device, itemId)
}

const PrevTrees = async (device, itemId) => {
    let runningDevice = await Device.CreateDevice(device)
    let client = runningDevice.client
    let [calc_X, calc_Y] = runningDevice.Calculator()

    client.tap(calc_X(300), calc_Y(380)).sleep(1.5 * 1000)

    await Execute(runningDevice)
    let count = 0

    while (!(await Image.IsIncludeItem(device.id, itemId)) && count < 10) {
        runningDevice = await Device.CreateDevice(device)
        client = runningDevice.client
        ;[calc_X, calc_Y] = runningDevice.Calculator()

        client.tap(calc_X(80), calc_Y(305)).sleep(500)
        await Execute(runningDevice)
        count++
    }

    runningDevice = await Device.CreateDevice(device)
    client = runningDevice.client
    ;[calc_X, calc_Y] = runningDevice.Calculator()

    client.press('KEYCODE_BACK').sleep(500)
    await Execute(runningDevice)
    if (count >= 10) return await PrevTrees(device, itemId)
}

const Execute = (runningDevice) =>
    new Promise((resolve) =>
        runningDevice.client.sleep(5).execute((err) => {
            if (err) {
                console.error(err)
            }
            runningDevice.monkey.end()
            resolve()
        })
    )

const GetItemId = (items) => {
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

module.exports = {
    Sleep,
    OpenGame,
    OpenChests,
    BackToGame,
    MakeGoods,
    MakeGoods_2,
    SellGoods,
    SellFullGoods,
    PlantTrees,
    PlantTrees_Half,
    HarvestTrees,
    GoDown,
    GoUp,
    GoDownLast,
    NextTrees,
    PrevTrees,
}
