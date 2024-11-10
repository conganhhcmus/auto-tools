const fs = require('fs')
const { resolve } = require('path')

const filePath = {
    log: resolve(__dirname, '../../data/log.json'),
    device: resolve(__dirname, '../../data/device.json'),
    game: resolve(__dirname, '../../data/game.json'),
    auto: resolve(__dirname, '../../data/auto.json'),
}

function getLogData() {
    return JSON.parse(fs.readFileSync(filePath.log, 'utf8'))
}

function clearLogData() {
    fs.writeFileSync(filePath.log, '[]')
}

function getDeviceData() {
    return JSON.parse(fs.readFileSync(filePath.device, 'utf8'))
}

function getGamesData() {
    return JSON.parse(fs.readFileSync(filePath.game, 'utf8'))
}

function getAutoData() {
    return JSON.parse(fs.readFileSync(filePath.auto, 'utf8'))
}

function readFileData(path) {
    return fs.readFileSync(path, 'binary')
}

function writeLogData(object) {
    fs.writeFileSync(filePath.log, JSON.stringify(object))
}

function writeDeviceData(object) {
    fs.writeFileSync(filePath.device, JSON.stringify(object))
}

module.exports = {
    getLogData,
    clearLogData,
    getDeviceData,
    getGamesData,
    getAutoData,
    readFileData,
    writeLogData,
    writeDeviceData,
}
