const fs = require('fs')
const path = require('path')
const Promise = require('bluebird')
const AutoFunc = require('./auto')
const Device = require('../core/device');

const Main = async (argv) => {
    const auto = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../data/auto.json'), 'utf8'))
    const gameName = 'sky-garden'
    // parse data
    const state = JSON.parse(Buffer.from(argv[2], 'base64').toString('ascii'))
    const index = parseInt(argv[3])
    const { gameOptions, selectedDevices } = state
    const listDevices = await Device.GetListDevices(selectedDevices);

    return await Promise.all(
        listDevices.map(async (device) => {
            await AutoFunc.OpenGame(device, gameOptions, index)
            for (let i = 0; i < 10; i++) {
                await AutoFunc.ProduceItems(device, gameOptions, i, auto, gameName)
            }
            await AutoFunc.SellItems(device, gameOptions, auto, gameName)
        })
    )
}

//Run Main Function
Main(process.argv)
