const fs = require('fs')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const spawn = require('child_process').spawn
const path = require('path')
const moment = require('moment')

defaultErrorHandler = (err) => {
    fs.appendFileSync(path.resolve(__dirname, '../logs/err.txt'), moment().format('LTS') + " : ")
    fs.appendFileSync(path.resolve(__dirname, '../logs/err.txt'), err)
}

defaultExitHandler = (code) => {
    // console.log('child process exited with code', code)
}

exports.runShell = async (command, errorHandler = null) => {
    try {
        const { stdout, stderr, error } = await exec(command)
        // stdout && fs.appendFileSync(path.resolve(__dirname, '../logs/out.txt'), stdout)
        stderr && (errorHandler ? errorHandler() : defaultErrorHandler(stderr))
        return stdout || ''
    } catch (e) {
        errorHandler ? errorHandler() : defaultErrorHandler(e.message)
        return ''
    }
}

exports.runShellSpawn = (command, errorHandler = null, exitHandler = null) => {
    let commandArray = command.split(' ')
    const childProcess = spawn(commandArray.shift(), commandArray)

    childProcess.stderr.on('data', function (data) {
        errorHandler ? errorHandler() : defaultErrorHandler(data)
    })

    childProcess.on('close', function (code) {
        exitHandler ? exitHandler() : defaultExitHandler(code)
    })

    return childProcess
}
