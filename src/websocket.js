const { runSpawn } = require('./utils/shell')

function getLiveScreen(ws, req) {
    const deviceId = req.params.id

    const streamProcess = runSpawn(`adb -s ${deviceId} exec-out screenrecord --output-format=h264 -`)
    let chunk = Buffer.from([])
    streamProcess.stdout.on('data', (data) => {
        if (isBeginChunk(data)) {
            if (chunk.length > 0) {
                if (ws.readyState == 2 || ws.readyState == 3) {
                    return
                }
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
        streamProcess.stdin.pause()
        streamProcess.kill()
    })
}

function isBeginChunk(buffer) {
    if (buffer[0] == 0 && buffer[1] == 0 && buffer[2] == 0 && buffer[3] == 1) return true
    if (buffer[0] == 0 && buffer[1] == 0 && buffer[2] == 1) return true
    return false
}

module.exports = {
    getLiveScreen,
}
