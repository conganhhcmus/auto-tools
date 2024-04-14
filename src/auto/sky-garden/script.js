const { SellSlotList, PlantSlotList, MakeSlotList, FirstRowSlotList, SecondRowSlotList, DefaultBasket, DefaultProduct, SellOptions } = require('./constance')
const Device = require('../core/device')
const Image = require('../../utils/image')

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

const _sellBySlot = (client, calc, slots = [], option = 1) => {
    const [calc_X, calc_Y] = calc
    const { x: option_x, y: option_y } = SellOptions[option]

    slots.forEach((slot) => {
        const { x, y } = SellSlotList[slot]
        client
            .tap(calc_X(x), calc_Y(y))
            .sleep(500)
            .tap(calc_X(x), calc_Y(y))
            .sleep(500)
            .tap(calc_X(option_x), calc_Y(option_y))
            .sleep(500)
            .tap(calc_X(70), calc_Y(130))
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
    })
}

const _sellFullSlot = (client, slotA = [], slotB = [], slotC = [], calc, option = 1) => {
    const [calc_X, calc_Y] = calc
    const { x: option_x, y: option_y } = SellOptions[option]
    // const slotA = [0, 1, 2, 3, 4, 5, 6, 7]
    // const slotB = [0, 1, 2, 3, 4, 5, 6, 7]
    // const slotC = [1, 2, 5, 6]

    // back front market
    client.touchDown(calc_X(130), calc_Y(270)).sleep(5)
    _Move(client, { x: calc_X(130), y: calc_Y(270) }, { x: calc_X(630), y: calc_Y(270) }, 50)
    client.touchUp(calc_X(630), calc_Y(270)).sleep(500)

    // back front market
    client.touchDown(calc_X(130), calc_Y(270)).sleep(5)
    _Move(client, { x: calc_X(130), y: calc_Y(270) }, { x: calc_X(630), y: calc_Y(270) }, 50)
    client.touchUp(calc_X(630), calc_Y(270)).sleep(500)

    slotA.forEach((slot) => {
        const { x, y } = SellSlotList[slot]
        client
            .tap(calc_X(x), calc_Y(y))
            .sleep(500)
            .tap(calc_X(x), calc_Y(y))
            .sleep(500)
            .tap(calc_X(option_x), calc_Y(option_y))
            .sleep(500)
            .tap(calc_X(70), calc_Y(130))
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
    })

    client.touchDown(calc_X(630), calc_Y(270)).sleep(5)
    _Move(client, { x: calc_X(630), y: calc_Y(270) }, { x: calc_X(130), y: calc_Y(270) }, 500)
    client.touchUp(calc_X(130), calc_Y(270)).sleep(500)

    slotB.forEach((slot) => {
        const { x, y } = SellSlotList[slot]
        client
            .tap(calc_X(x), calc_Y(y))
            .sleep(500)
            .tap(calc_X(x), calc_Y(y))
            .sleep(500)
            .tap(calc_X(option_x), calc_Y(option_y))
            .sleep(500)
            .tap(calc_X(70), calc_Y(130))
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
    })

    client.touchDown(calc_X(630), calc_Y(270)).sleep(5)
    _Move(client, { x: calc_X(630), y: calc_Y(270) }, { x: calc_X(130), y: calc_Y(270) }, 500)
    client.touchUp(calc_X(130), calc_Y(270)).sleep(500)

    slotC.forEach((slot) => {
        const { x, y } = SellSlotList[slot]
        client
            .tap(calc_X(x), calc_Y(y))
            .sleep(500)
            .tap(calc_X(x), calc_Y(y))
            .sleep(500)
            .tap(calc_X(option_x), calc_Y(option_y))
            .sleep(500)
            .tap(calc_X(70), calc_Y(130))
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
    })
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
        client.touchDown(x, y).sleep(5)
        _Move(client, { x: calc_X(x), y: calc_Y(y) }, { x: calc_X(produce_x), y: calc_Y(produce_y) }, 5)
        client.touchUp(produce_x, produce_y).sleep(500)
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
    const runningDevice = await Device.CreateDevice(device)
    const [calc_X, calc_Y] = runningDevice.Calculator()
    let client = runningDevice.client

    client.press('KEYCODE_APP_SWITCH').sleep(500)
    // close app
    client.touchDown(calc_X(400), calc_Y(300)).sleep(5)
    _Move(client, { x: calc_X(400), y: calc_Y(300) }, { x: calc_X(400), y: calc_Y(0) }, 10)
    client.touchUp(calc_X(400), calc_Y(0)).sleep(500)
    // close app
    client.touchDown(calc_X(400), calc_Y(300)).sleep(5)
    _Move(client, { x: calc_X(400), y: calc_Y(300) }, { x: calc_X(400), y: calc_Y(0) }, 10)
    client.touchUp(calc_X(400), calc_Y(0)).sleep(500)
    // close app
    client.touchDown(calc_X(400), calc_Y(300)).sleep(5)
    _Move(client, { x: calc_X(400), y: calc_Y(300) }, { x: calc_X(400), y: calc_Y(0) }, 10)
    client.touchUp(calc_X(400), calc_Y(0)).sleep(500)

    // open game
    client
        .press('KEYCODE_HOME')
        .sleep(1 * 1000)
        .tap(calc_X(750), calc_Y(288))
        .sleep(15 * 1000)
        .tap(calc_X(80), calc_Y(510))
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
    client.tap(calc_X(300), calc_Y(380)).sleep(1 * 1000)

    _plantBySlot(client, [calc_X, calc_Y], slot, floor)

    return await Execute(runningDevice)
}

const PlantTrees_Half = async (device, slot = 0, index, floor = 1) => {
    const runningDevice = await Device.CreateDevice(device)
    const [calc_X, calc_Y] = runningDevice.Calculator()

    let client = runningDevice.client
    // open
    client.tap(calc_X(300), calc_Y(380)).sleep(1 * 1000)

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

const SellGoods = async (device, slots = [], option = 1) => {
    const runningDevice = await Device.CreateDevice(device)
    const [calc_X, calc_Y] = runningDevice.Calculator()
    let client = runningDevice.client

    // open
    client.tap(555, 340).sleep(1 * 1000)

    //sell by slots
    _sellBySlot(client, [calc_X, calc_Y], slots, option)

    // close
    client.press('KEYCODE_BACK').sleep(100).press('KEYCODE_BACK').sleep(100).press('KEYCODE_BACK').sleep(100).tap(calc_X(470), calc_Y(325)).sleep(500)

    return await Execute(runningDevice)
}

const SellFullGoods = async (device, slotA, slotB, slotC, option = 1) => {
    const runningDevice = await Device.CreateDevice(device)
    const [calc_X, calc_Y] = runningDevice.Calculator()
    let client = runningDevice.client

    // open
    client.tap(555, 340).sleep(1 * 1000)

    //sell by slots
    _sellFullSlot(client, slotA, slotB, slotC, [calc_X, calc_Y], option)

    // close
    client.press('KEYCODE_BACK').sleep(100).press('KEYCODE_BACK').sleep(100).press('KEYCODE_BACK').sleep(100).tap(calc_X(470), calc_Y(325)).sleep(500)

    return await Execute(runningDevice)
}

const NextTrees = async (device, itemId) => {
    let runningDevice = await Device.CreateDevice(device)
    let client = runningDevice.client
    let [calc_X, calc_Y] = runningDevice.Calculator()

    client.tap(calc_X(300), calc_Y(380)).sleep(1 * 1000)

    await Execute(runningDevice)

    while (!(await Image.IsIncludeItem(device.id, itemId))) {
        runningDevice = await Device.CreateDevice(device)
        client = runningDevice.client
        ;[calc_X, calc_Y] = runningDevice.Calculator()

        client.tap(calc_X(325), calc_Y(305)).sleep(500)

        await Execute(runningDevice)
    }

    runningDevice = await Device.CreateDevice(device)
    client = runningDevice.client
    ;[calc_X, calc_Y] = runningDevice.Calculator()

    client.press('KEYCODE_BACK').sleep(500)

    return await Execute(runningDevice)
}

const PrevTrees = async (device, itemId) => {
    let runningDevice = await Device.CreateDevice(device)
    let client = runningDevice.client
    let [calc_X, calc_Y] = runningDevice.Calculator()

    client.tap(calc_X(300), calc_Y(380)).sleep(1 * 1000)

    await Execute(runningDevice)

    while (!(await Image.IsIncludeItem(device.id, itemId))) {
        runningDevice = await Device.CreateDevice(device)
        client = runningDevice.client
        ;[calc_X, calc_Y] = runningDevice.Calculator()

        client.tap(calc_X(80), calc_Y(305)).sleep(500)
        await Execute(runningDevice)
    }

    runningDevice = await Device.CreateDevice(device)
    client = runningDevice.client
    ;[calc_X, calc_Y] = runningDevice.Calculator()

    client.press('KEYCODE_BACK').sleep(500)
    return await Execute(runningDevice)
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

module.exports = {
    Sleep,
    OpenGame,
    MakeGoods,
    MakeGoods_2,
    SellGoods,
    PlantTrees,
    PlantTrees_Half,
    HarvestTrees,
    GoDown,
    GoUp,
    BackToGame,
    GoDownLast,
    NextTrees,
    PrevTrees,
    SellFullGoods,
}
