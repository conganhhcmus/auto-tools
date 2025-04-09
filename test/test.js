const Jimp = require('jimp')
const { findCoordinates } = require('../src/lib/image')
const { resolve } = require('path')

main = async (findPosition = null) => {
    console.time(`main_${findPosition}`)
    const deviceId = 'emulator-5554'
    const itemId = 'ruong-bau'
    let data = await Jimp.read(resolve(__dirname, `../screen/${deviceId}.png`))

    let result = await findCoordinates(data, resolve(__dirname, `../src/tools/sky-garden/item/${itemId}.png`), findPosition)
    console.timeEnd(`main_${findPosition}`)
    console.log(result)

    if (result.length > 0) {
        console.log(result[0].x * 8, result[0].y * 4.5)
    }
}

main()
main('1')

// console.log(Math.round((800 * 16.25) / 100.0), Math.round((450 * 77.78) / 100.0));
// console.log(Math.round((800 * 25.0) / 100.0), Math.round((450 * 62.22) / 100.0))
