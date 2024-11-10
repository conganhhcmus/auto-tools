const { getLogData, clearLogData } = require('../service/data')

function getLogs(req, res, next) {
    let device = req.query.device
    let logs = getLogData()
    let result = logs.find((log) => log.device === device)
    res.json(result)
}

function clearLogs(req, res, next) {
    clearLogData()
    res.end()
}

module.exports = {
    getLogs,
    clearLogs,
}
