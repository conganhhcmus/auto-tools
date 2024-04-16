const ADB = require('adbkit')
const Helpers = require('./util')
const Client = ADB.createClient({ port: 5037, host: '127.0.0.1' })

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

const GetListDevices = async (selectedDevices) => await Client.listDevices().then((devices) => devices.filter((device) => selectedDevices.includes(device.id)))

module.exports = {
    CreateDevice,
    GetListDevices,
}
