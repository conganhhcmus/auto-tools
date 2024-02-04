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
    constructor(id, client, adb) {
        this.id = id
        this.ADBclient = client
        this.ADB = adb
        this.size = null
        this.monkey = null
        this.client = null
    }

    async CreateClient() {
        console.log('Creating client')
        let output = [this.id, this.ADBclient, this.size, this.monkey, this.client]
        // kill all process monkey
        await this.Shell('kill $(pgrep monkey)')
        //output.push(await this.ADBclient.shell(this.id, 'kill $(pgrep monkey)').then(this.ADB.util.readAll))
        // output.push(await Client.shell(this.id, 'nohup monkey --port 1080 &').then(ADB.util.readAll))
        // output.push(await Client.forward(this.id, 'tcp:1080', 'tcp:1080'))

        // let vmSize = await Client.shell(this.id, 'wm size').then(ADB.util.readAll)
        // let monkey = await Client.openMonkey(this.id)
        // console.log(output)
        // this.size = Helpers.getSize(vmSize.toString())
        // this.monkey = monkey
        // this.client = this.monkey.multi()
        console.log(output)
        return
    }

    Execute() {
        return new Promise((resolve) => {
            this.client.sleep(5).execute((err) => {
                if (err) {
                    console.error(err)
                }
                this.monkey.end()
                resolve()
            })
        })
    }

    Calculator() {
        const calc_X = (x) => Helpers.calc_X(x, this.size)
        const calc_Y = (y) => Helpers.calc_Y(y, this.size)
        return [calc_X, calc_Y]
    }

    Shell(command) {
        return this.ADBclient.shell(this.id, command)
    }
}

const ProduceItems = async (device, gameOptions = {}, index) => {
    const runningDevice = new Device(device.id, Client, ADB)
    const { runAuto, hasEventTree } = gameOptions
    const isLast = index === 9

    await AutoFunc.ProduceItems_2(runningDevice, hasEventTree, isLast)

    // switch (runAuto) {
    //     // case auto[gameName][1].key:
    //     //     AutoFunc.ProduceItems_1(runningDevice, hasEventTree, isLast)
    //     //     break

    //     // case auto[gameName][2].key:
    //     //     await AutoFunc.ProduceItems_2(runningDevice, hasEventTree, isLast)
    //     //     break

    //     // case auto[gameName][3].key:
    //     //     AutoFunc.ProduceItems_3(runningDevice, hasEventTree, isLast)
    //     //     break

    //     // case auto[gameName][4].key:
    //     //     AutoFunc.ProduceItems_4(runningDevice, hasEventTree, isLast)
    //     //     break

    //     // case auto[gameName][5].key:
    //     //     AutoFunc.ProduceItems_5(runningDevice, hasEventTree, isLast)
    //     //     break

    //     // case auto[gameName][6].key:
    //     //     AutoFunc.ProduceItems_6(runningDevice, hasEventTree, isLast)
    //     //     break

    //     // case auto[gameName][7].key:
    //     //     AutoFunc.ProduceItems_7(runningDevice, hasEventTree, isLast)
    //     //     break

    //     // case auto[gameName][8].key:
    //     //     AutoFunc.ProduceItems_8(runningDevice, hasEventTree, isLast)
    //     //     break

    //     // default:
    //     //     AutoFunc.PlantEventTree(runningDevice)
    //     //     break
    // }
}

const SellItems = async (device, gameOptions) => {
    const { runAuto, sellItems } = gameOptions
    if (!sellItems) return

    const runningDevice = new Device(device.id, Client)

    switch (runAuto) {
        case auto[gameName][1].key:
            await AutoFunc.SellItems_1(runningDevice)
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
}

const OpenGame = async (device, gameOptions = {}, index) => {
    const runningDevice = new Device(device.id, Client)

    const { openGame, openGameAfter } = gameOptions
    const needOpen = openGame && index % openGameAfter == 0
    needOpen && AutoFunc.OpenGame(runningDevice)
}

const Main = async (state = {}, index = 0) => {
    const { gameOptions, selectedDevices } = state
    let listDevices = await Client.listDevices().then((devices) => devices.filter((device) => selectedDevices.includes(device.id)))

    return await Promise.all(
        listDevices.map(async (device) => {
            //await OpenGame(device, gameOptions, index)
            for (let i = 0; i < 1; i++) {
                await ProduceItems(device, gameOptions, i)
            }
            //await SellItems(device, gameOptions)
        })
    )
}

//Run Main Function
Main(JSON.parse(process.argv[2]), process.argv[3])
