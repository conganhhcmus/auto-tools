const { spawn, exec } = require('child_process')
const { logErrMsg } = require('../service/log')
const Promise = require('bluebird')

function runExecAsync(command) {
    return new Promise((resolve, reject) => {
        runExec(
            command,
            (stdout) => resolve(stdout),
            (err) => {
                logErrMsg(err.message)
                reject(err)
            },
            (code, signal) => {
                if (code !== 0) {
                    reject(new Error(`process die with code ${code}, signal ${signal}`))
                }
            }
        )
    })
}

function runExec(command, outputHandler = null, errorHandler = null, exitHandler = null) {
    const childProcess = exec(command, (err, stdout, stderr) => {
        if (err) {
            errorHandler && errorHandler(err)
        }
        stderr && logErrMsg(stderr)
        outputHandler && outputHandler(stdout)
    })

    childProcess.on('close', function (code, signal) {
        exitHandler && exitHandler(code, signal)
    })

    return childProcess
}

function runSpawn(command, errorHandler = null, exitHandler = null) {
    let commandArray = command.split(' ')
    const childProcess = spawn(commandArray.shift(), commandArray)

    childProcess.stderr.on('data', function (data) {
        errorHandler ? errorHandler(data) : logErrMsg(data)
    })

    childProcess.on('close', function (code, signal) {
        exitHandler && exitHandler(code, signal)
    })

    return childProcess
}

module.exports = {
    runExec,
    runSpawn,
    runExecAsync,
}
