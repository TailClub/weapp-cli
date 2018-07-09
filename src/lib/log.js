const _ = require('lodash')
const path = require('path')
const colors = require('colors')
const { getDateTime } = require('./util')
const { LogLevel, LogType } = require('./status')

colors.setTheme(LogType)

module.exports = {
    type: LogType,
    fatal(msg) {
        this.msg(LogType.FATAL, msg)
    },
    error(msg) {
        this.msg(LogType.ERROR, msg)
    },
    warn(msg) {
        this.msg(LogType.WARN, msg)
    },
    tip(msg) {
        this.msg(LogType.TIP, msg)
    },
    info(msg) {
        this.msg(LogType.INFO, msg)
    },
    debug(msg) {
        this.msg(LogType.DEBUG, msg)
    },
    msg(LogType, msg) {
        let dateTime = colors.gray(`[${getDateTime()}] `)

        if (_.isError(msg)) {
            msg = msg.message
        } else if (_.isPlainObject(msg) || _.isArray(msg)) {
            msg = JSON.stringify(msg)
        }

        if (this.cb) {
            this.cb(msg, LogType, dateTime)
        } else {
            let color = colors[LogType.color]
            msg = dateTime + color(`[${LogType.desc}]`) + ' ' + msg

            if (LogType.level >= LogLevel.WARN) {
                console.error(msg)
            } else {
                console.log(msg)
            }
        }
    },
    output(LogType, msg, file) {
        this.msg(LogType, msg + ' in ' + path.relative(config.cwd, file))
    },
    newline() {
        console.log('')
    },
    register(cb) {
        this.cb = cb
    },
    unRegister() {
        this.cb = null
    }
}
