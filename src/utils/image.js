const Jimp = require('jimp')
const { cv, cvTranslateError } = require('opencv-wasm')
const util = require('util')
const exec = util.promisify(require('child_process').exec)

exports.GetCoordinatesItem = async (deviceId, itemId, defaultPosition) => {
    try {
        await exec(`adb -s ${deviceId} exec-out screencap -p > src/assets/device/${deviceId}.png`)
        const imageTemplate = await Jimp.read(__dirname + `/../assets/items/${itemId}.png`)
        const imageSource = await Jimp.read(__dirname + `/../assets/device/${deviceId}.png`)

        let src = cv.matFromImageData(imageSource.bitmap)
        let templ = cv.matFromImageData(imageTemplate.bitmap)
        let processedImage = new cv.Mat()
        let mask = new cv.Mat()

        cv.matchTemplate(src, templ, processedImage, cv.TM_CCOEFF_NORMED, mask)
        cv.threshold(processedImage, processedImage, 0.9, 1, cv.THRESH_BINARY)
        processedImage.convertTo(processedImage, cv.CV_8UC1)

        let contours = new cv.MatVector()
        let hierarchy = new cv.Mat()

        cv.findContours(processedImage, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)
        if (contours.size() > 0) {
            let point = contours.get(0).data32S // Contains the points
            let x = point[0]
            let y = point[1]

            let pointA = new cv.Point(x, y)
            let pointB = new cv.Point(x + templ.cols, y + templ.rows)

            return [Math.floor((pointA.x + pointB.x) / 2), Math.floor((pointA.y + pointB.y) / 2)]
        }

        return defaultPosition
    } catch (err) {
        console.log(cvTranslateError(cv, err))

        return defaultPosition
    }
}

exports.IsIncludeItem = async (deviceId, itemId) => {
    try {
        await exec(`adb -s ${deviceId} exec-out screencap -p > src/assets/device/${deviceId}.png`)
        const imageTemplate = await Jimp.read(__dirname + `/../assets/items/${itemId}.png`)
        const imageSource = await Jimp.read(__dirname + `/../assets/device/${deviceId}.png`)

        let src = cv.matFromImageData(imageSource.bitmap)
        let templ = cv.matFromImageData(imageTemplate.bitmap)
        let processedImage = new cv.Mat()
        let mask = new cv.Mat()

        cv.matchTemplate(src, templ, processedImage, cv.TM_CCOEFF_NORMED, mask)
        cv.threshold(processedImage, processedImage, 0.9, 1, cv.THRESH_BINARY)
        processedImage.convertTo(processedImage, cv.CV_8UC1)

        let contours = new cv.MatVector()
        let hierarchy = new cv.Mat()

        cv.findContours(processedImage, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE)

        return contours.size() > 0
    } catch (err) {
        console.log(cvTranslateError(cv, err))

        return false
    }
}
