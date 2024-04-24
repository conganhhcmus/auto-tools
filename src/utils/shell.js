const fs = require('fs')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const path = require('path')

defaultErrorHandler = (err) => {
    fs.appendFileSync(path.resolve(__dirname, '../logs/err.txt'), err)
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
