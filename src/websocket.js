const { runShellSpawn } = require('./utils/shell')

exports.getLiveScreen = (ws, req) => {
    const deviceId = req.params.id
    // console.log('Client connected', deviceId)

    const streamProcess = runShellSpawn(`adb -s ${deviceId} exec-out screenrecord --output-format=h264 -`)
    let chunk = Buffer.from([])
    streamProcess.stdout.on('data', (data) => {
        if (isBeginChunk(data)) {
            if (chunk.length > 0) {
                ws.send(chunk, { binary: true }, (error) => {
                    if (error) console.error(error)
                })
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
    })
}

function isBeginChunk(buffer) {
    if (buffer[0] == 0 && buffer[1] == 0 && buffer[2] == 0 && buffer[3] == 1) return true
    if (buffer[0] == 0 && buffer[1] == 0 && buffer[2] == 1) return true
    return false
}
