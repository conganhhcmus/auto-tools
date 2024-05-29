const platform = process.platform

const isWindows = platform === 'win32'

const isMacOS = platform === 'darwin'

module.exports = {
    isWindows,
    isMacOS,
}
