const { Adb } = require('@devicefarmer/adbkit')
const util = require('./util')
const client = Adb.createClient({ port: 5037, host: '127.0.0.1' })

class Device {
    constructor(id, monkey, vmSize) {
        this.id = id
        this.size = util.getSize(vmSize.toString())
        this.monkey = monkey
        this.client = this.monkey.multi()
    }

    Calculator() {
        const calc_X = (x) => util.calc_X(x, this.size)
        const calc_Y = (y) => util.calc_Y(y, this.size)
        return [calc_X, calc_Y]
    }
}

const CreateDevice = async (device) => {
    const selectedDevice = client.getDevice(device.id)
    let output = [device.id]
    // kill all process monkey
    output.push(await selectedDevice.shell('kill $(pgrep monkey)').then(Adb.util.readAll))
    output.push(await selectedDevice.forward('tcp:1080', 'tcp:1080'))
    output.push(await selectedDevice.shell('nohup monkey --port 1080 &').then(Adb.util.readAll))

    let vmSize = await selectedDevice.shell('wm size').then(Adb.util.readAll)
    let monkey = await selectedDevice.openMonkey()

    return new Device(device.id, monkey, vmSize)
}

const GetListDevices = async (selectedDevices) => await client.listDevices().then((devices) => devices.filter((device) => selectedDevices.includes(device.id)))

const OpenApp = async (device, packageName) => {
    const selectedDevice = client.getDevice(device.id)
    await selectedDevice.shell(`monkey -p ${packageName} 1`).then(Adb.util.readAll)
}

const CloseApp = async (device, packageName) => {
    const selectedDevice = client.getDevice(device.id)
    await selectedDevice.shell(`am force-stop ${packageName}`).then(Adb.util.readAll)
}

module.exports = {
    CreateDevice,
    GetListDevices,
    OpenApp,
    CloseApp,
}
