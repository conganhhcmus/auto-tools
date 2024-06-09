const defaultSize = [800, 450]
const { logErrMsg } = require('../utils/log')
const Promise = require('bluebird')

class MonkeyRunner {
    constructor(monkey, vmSize) {
        this.monkey = monkey
        this.vmSize = vmSize
        this.client = undefined
    }

    _getX = (x) => {
        if (this.vmSize.width <= defaultSize[0]) {
            return x
        }
        return Math.floor(x * (this.vmSize.width / defaultSize[0]))
    }

    _getY = (y) => {
        if (this.vmSize.height <= defaultSize[1]) {
            return y
        }
        return Math.floor(y * (this.vmSize.height / defaultSize[1]))
    }

    multi = () => {
        this.client = this.monkey.multi()
        return this
    }

    execute = () =>
        new Promise((resolve, reject) =>
            this.client.sleep(5).execute((err, val) => {
                if (err) {
                    logErrMsg(err.toString())
                    reject(err)
                }
                resolve(val)
            })
        )

    sleep = (ms) => {
        this.client.sleep(ms)
        return this
    }

    press = (key) => {
        this.client.press(key)
        return this
    }

    tap = (x, y) => {
        this.client.tap(this._getX(x), this._getY(y))
        return this
    }

    touchMove = (x, y) => {
        this.client.touchMove(this._getX(x), this._getY(y))
        return this
    }

    touchDown = (x, y) => {
        this.client.touchDown(this._getX(x), this._getY(y))
        return this
    }

    touchUp = (x, y) => {
        this.client.touchUp(this._getX(x), this._getY(y))
        return this
    }

    close = () =>
        new Promise((resolve, reject) => {
            this.monkey.quit((err) => {
                if (err) {
                    logErrMsg(err.toString())
                    reject(err)
                }
                this.monkey.end()
                this.client = undefined
                this.monkey = undefined
                this.vmSize = undefined
                resolve()
            })
        })
}

module.exports = {
    MonkeyRunner,
}
