const LogLevel = {
    ALL: 0,
    TRACE: 1,
    DEBUG: 2,
    INFO: 3,
    TIP: 4,
    WARN: 5,
    ERROR: 6,
    FATAL: 7,
    OFF: 8
}

const LogType = {
    FATAL: {
        color: 'red',
        desc: 'FATAL',
        level: LogLevel.FATAL
    },
    ERROR: {
        color: 'red',
        desc: 'ERROR',
        level: LogLevel.ERROR
    },
    WARN: {
        color: 'bgYellow',
        desc: 'WARN',
        level: LogLevel.WARN
    },
    CHANGE: {
        color: 'yellow',
        desc: '变更',
        level: LogLevel.TIP
    },
    DELETE: {
        color: 'bgMagenta',
        desc: '删除',
        level: LogLevel.WARN
    },
    TIP: {
        color: 'magenta',
        desc: '提示',
        level: LogLevel.TIP
    },
    CREATE: {
        color: 'green',
        desc: '创建',
        level: LogLevel.TIP
    },
    WATCH: {
        color: 'magenta',
        desc: '监听',
        level: LogLevel.TIP
    },
    BUILD: {
        color: 'blue',
        desc: '编译',
        level: LogLevel.TIP
    },
    INFO: {
        color: 'grey',
        desc: '信息',
        level: LogLevel.INFO
    },
    RUN: {
        color: 'blue',
        desc: '执行',
        level: LogLevel.INFO
    },
    COMPRESS: {
        color: 'blue',
        desc: '压缩',
        level: LogLevel.INFO
    },
    COMPLETE: {
        color: 'green',
        desc: '完成',
        level: LogLevel.INFO
    },
    WRITE: {
        color: 'green',
        desc: '写入',
        level: LogLevel.INFO
    },
    GENERATE: {
        color: 'green',
        desc: '生成',
        level: LogLevel.INFO
    },
    COPY: {
        color: 'yellow',
        desc: '拷贝',
        level: LogLevel.INFO
    },
    DEBUG: {
        color: 'red',
        desc: '调试',
        level: LogLevel.DEBUG
    },
    TRACE: {
        color: 'red',
        desc: '跟踪',
        level: LogLevel.TRACE
    }
}

module.exports = {
    LogType,
    LogLevel
}
