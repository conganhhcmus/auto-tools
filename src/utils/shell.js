const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const { spawn } = require('child_process')
const { logErrMsg } = require('./log')

async function runExec(command, errorHandler = null) {
    try {
        const { stdout, stderr, error } = await exec(command)
        stderr && (errorHandler ? errorHandler() : logErrMsg(stderr))
        return stdout || ''
    } catch (err) {
        errorHandler ? errorHandler(err) : logErrMsg(err.message)
        return ''
    }
}

function runSpawn(command, errorHandler = null, exitHandler = null) {
    let commandArray = command.split(' ')
    const childProcess = spawn(commandArray.shift(), commandArray)

    childProcess.stderr.on('data', function (data) {
        errorHandler ? errorHandler(data) : logErrMsg(data)
    })

    childProcess.on('close', function (code) {
        exitHandler && exitHandler(code)
    })

    return childProcess
}

module.exports = {
    runExec,
    runSpawn,
}
