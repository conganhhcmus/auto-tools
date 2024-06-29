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
        "appium:options": {
            udid: deviceId,
            automationName: "UiAutomator2",
            // appPackage: 'vn.kvtm.js',
            // appActivity: 'gsn.game.zingplaynew.AppActivity',
            newCommandTimeout: 300,
            noReset: true,
            printPageSourceOnFindFailure: true,
            suppressKillServer: true,
        },
    }

    const driver = await connectAppium(capabilities)
    try {
        await autoFunc.openGame(driver, gameOptions, index)
        for (let i = 0; i < 10; i++) {
            await autoFunc.produceItems(driver, gameOptions, i, auto, gameName)
        }
        await autoFunc.openChests(driver, gameOptions)
        await autoFunc.sellItems(driver, gameOptions, auto, gameName)
    }
    catch (err) {
        throw err
    }
    finally {
        await driver.finish()
    }
}

Auto(process.argv)
