const Jimp = require('jimp')
const { cv, cvTranslateError } = require('opencv-wasm')
const { logErrMsg } = require('../utils/log')
const { resolve } = require('path')

const exactRate = 0.9 // 90%
const defaultSize = [800, 450]

readAndResizeImage = async (filePath) => {
    const imageSource = await Jimp.read(filePath)
    if (imageSource.bitmap.width > imageSource.bitmap.height) {
        imageSource.resize(defaultSize[0], defaultSize[1])
    } else {
        imageSource.resize(defaultSize[1], defaultSize[0])
    }

    return imageSource
}

async function findCoordinates(deviceId, itemId) {
    try {
        const screenCapPath = resolve(__dirname, `../assets/device/${deviceId}.png`)
        const itemFilePath = resolve(__dirname, `../assets/items/${itemId}.png`)
        const imageSource = await readAndResizeImage(screenCapPath)
        const imageTemplate = await Jimp.read(itemFilePath)
        let src = cv.matFromImageData(imageSource.bitmap)
        let templ = cv.matFromImageData(imageTemplate.bitmap)
        let processedImage = new cv.Mat()
        let mask = new cv.Mat()
        let contours = new cv.MatVector()
        let hierarchy = new cv.Mat()

        cv.matchTemplate(src, templ, processedImage, cv.TM_CCOEFF_NORMED, mask)
        cv.threshold(processedImage, processedImage, exactRate, 1, cv.THRESH_BINARY)
        processedImage.convertTo(processedImage, cv.CV_8UC1)
        cv.findContours(processedImage, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)

        let result = []
        for (let i = 0; i < contours.size(); ++i) {
            let point = contours.get(i).data32S
            const pointA = new cv.Point(point[0], point[1])
            const pointB = new cv.Point(point[0] + templ.cols, point[1] + templ.rows)
            result.push({
                x: Math.floor((pointA.x + pointB.x) / 2),
                y: Math.floor((pointA.y + pointB.y) / 2),
            })
        }

        // release memory
        src.delete()
        templ.delete()
        processedImage.delete()
        mask.delete()
        contours.delete()
        hierarchy.delete()

        return result.map((point) => ({
            x: (point.x / defaultSize[0]) * 100.0,
            y: (point.y / defaultSize[1]) * 100.0,
        }))
    } catch (err) {
        logErrMsg(cvTranslateError(cv, err))
        return []
    }
}

module.exports = {
    findCoordinates,
}
