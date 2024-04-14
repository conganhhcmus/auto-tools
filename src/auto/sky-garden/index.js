const fs = require('fs')
const path = require('path')
const Promise = require('bluebird')
const ADB = require('adbkit')
const Helpers = require('./util')
const Client = ADB.createClient({ port: 5037, host: '127.0.0.1' })
const AutoFunc = require('./func')

const auto = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../data/auto.json'), 'utf8'))
const gameName = 'sky-garden'

class Device {
    constructor(id, monkey, vmSize) {
        this.id = id
        this.size = Helpers.getSize(vmSize.toString())
        this.monkey = monkey
        this.client = this.monkey.multi()
    }

    Calculator() {
        const calc_X = (x) => Helpers.calc_X(x, this.size)
        const calc_Y = (y) => Helpers.calc_Y(y, this.size)
        return [calc_X, calc_Y]
    }
}

const ProduceItems = async (device, gameOptions = {}, index) => {
    const runningDevice = await CreateDevice(device)

    const { runAuto, hasEventTree } = gameOptions
    const isLast = index === 9
    switch (runAuto) {
        case auto[gameName][1].key:
            AutoFunc.ProduceItems_1(runningDevice, hasEventTree, isLast)
            break

        case auto[gameName][2].key:
            AutoFunc.ProduceItems_2(runningDevice, hasEventTree, isLast)
            break

        case auto[gameName][3].key:
            AutoFunc.ProduceItems_3(runningDevice, hasEventTree, isLast)
            break

        case auto[gameName][4].key:
            AutoFunc.ProduceItems_4(runningDevice, hasEventTree, isLast)
            break

        case auto[gameName][5].key:
            AutoFunc.ProduceItems_5(runningDevice, hasEventTree, isLast)
            break

        case auto[gameName][6].key:
            AutoFunc.ProduceItems_6(runningDevice, hasEventTree, isLast)
            break

        case auto[gameName][7].key:
            AutoFunc.ProduceItems_7(runningDevice, hasEventTree, isLast)
            break

        case auto[gameName][8].key:
            AutoFunc.ProduceItems_8(runningDevice, hasEventTree, isLast)
            break

        default:
            AutoFunc.PlantEventTree(runningDevice)
            break
    }

    return AutoFunc.Execute(runningDevice)
}

const SellItems = async (device, gameOptions) => {
    const { runAuto, sellItems } = gameOptions
    if (!sellItems) return

    const runningDevice = await CreateDevice(device)

    switch (runAuto) {
        case auto[gameName][1].key:
            AutoFunc.SellItems_1(runningDevice)
            break

        case auto[gameName][2].key:
            AutoFunc.SellItems_2(runningDevice)
            break

        case auto[gameName][3].key:
            AutoFunc.SellItems_3(runningDevice)
            break

        case auto[gameName][4].key:
            AutoFunc.SellItems_4(runningDevice)
            break

        case auto[gameName][5].key:
            AutoFunc.SellItems_5(runningDevice)
            break

        case auto[gameName][6].key:
            AutoFunc.SellItems_6(runningDevice)
            break

        case auto[gameName][7].key:
            AutoFunc.SellItems_7(runningDevice)
            break

        case auto[gameName][8].key:
            AutoFunc.SellItems_8(runningDevice)
            break

        default:
            break
    }

    return AutoFunc.Execute(runningDevice)
}

const OpenGame = async (device, gameOptions = {}, index) => {
    const runningDevice = await CreateDevice(device)

    const { openGame, openGameAfter } = gameOptions
    const needOpen = openGame && index % openGameAfter == 0
    needOpen && AutoFunc.OpenGame(runningDevice)

    return AutoFunc.Execute(runningDevice)
}

const CreateDevice = async (device) => {
    let output = [device.id]
    // kill all process monkey
    output.push(await Client.shell(device.id, 'kill $(pgrep monkey)').then(ADB.util.readAll))
    output.push(await Client.shell(device.id, 'nohup monkey --port 1080 &').then(ADB.util.readAll))
    output.push(await Client.forward(device.id, 'tcp:1080', 'tcp:1080'))

    let vmSize = await Client.shell(device.id, 'wm size').then(ADB.util.readAll)
    let monkey = await Client.openMonkey(device.id)

    return new Device(device.id, monkey, vmSize)
}

const Main = async (argv) => {
    // parse data
    const state = JSON.parse(Buffer.from(argv[2], 'base64').toString('ascii'))
    const index = parseInt(argv[3])
    const { gameOptions, selectedDevices } = state
    let listDevices = await Client.listDevices().then((devices) => devices.filter((device) => selectedDevices.includes(device.id)))

    return await Promise.all(
        listDevices.map(async (device) => {
            await OpenGame(device, gameOptions, index)
            for (let i = 0; i < 10; i++) {
                await ProduceItems(device, gameOptions, i)
            }
            await SellItems(device, gameOptions)
        })
    )
}

//Run Main Function
Main(process.argv)
