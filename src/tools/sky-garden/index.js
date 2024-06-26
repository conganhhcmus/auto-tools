const { connectAppium } = require('../../lib/webdriverio')
const { getAutoData } = require('../../utils/data')
const autoFunc = require('./auto')

async function Auto(argv) {
    const auto = getAutoData()
    const gameName = 'sky-garden'
    const data = JSON.parse(Buffer.from(argv[2], 'base64').toString('ascii'))
    const { gameOptions, deviceId, index } = data
    const capabilities = {
        platformName: 'Android',
        'appium:udid': deviceId,
        'appium:appPackage': 'vn.kvtm.js',
        'appium:appActivity': 'gsn.game.zingplaynew.AppActivity',
        'appium:automationName': 'UiAutomator2',
        'appium:noReset': true,
    }

    const driver = await connectAppium(capabilities)
    try {
        await autoFunc.openGame(driver, gameOptions, index)
        for (let i = 0; i < 10; i++) {
            await autoFunc.produceItems(driver, gameOptions, i, auto, gameName)
        }
        await autoFunc.openChests(driver, gameOptions)
        await autoFunc.sellItems(driver, gameOptions, auto, gameName)
    } finally {
        await driver.finish()
    }
}

Auto(process.argv)
