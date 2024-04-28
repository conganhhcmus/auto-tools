const { runShellSpawn } = require('./utils/shell')

exports.getLiveScreen = (ws, req) => {
    const deviceId = req.params.id
    // console.log('Client connected', deviceId)
    let interval = null

    const streamProcess = runShellSpawn(`adb -s ${deviceId} exec-out screenrecord --output-format=h264 -`)
    let prevChunk = Buffer.from([])
    let chunk = Buffer.from([])
    streamProcess.stdout.on('data', (data) => {
        if (isBeginChunk(data)) {
            if (chunk.length > 0) {
                ws.send(chunk, { binary: true }, (error) => {
                    if (error) console.error(error)
                })
                prevChunk = chunk
                interval && clearInterval(interval)
                interval = intervalSendData(ws, prevChunk)
            }
            chunk = Buffer.from(data)
        } else {
            chunk = Buffer.concat([chunk, data])
        }
    })

    ws.on('close', () => {
        // console.log('Client closed', deviceId)
        streamProcess.stdin.pause()
        streamProcess.kill()
        interval && clearInterval(interval)
    })
}

function intervalSendData(ws, chunk) {
    return setInterval(() => {
        ws.send(chunk, { binary: true }, (error) => {
            if (error) console.error(error)
        })
    }, 800)
}

function isBeginChunk(buffer) {
    if (buffer[0] == 0 && buffer[1] == 0 && buffer[2] == 0 && buffer[3] == 1) return true
    if (buffer[0] == 0 && buffer[1] == 0 && buffer[2] == 1) return true
    return false
}
