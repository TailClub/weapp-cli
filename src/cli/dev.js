const { LogType } = require('../lib/status')
const chokidar = require('chokidar')
const config = require('../config')
// const cache = require('../lib/cache')
const log = require('../lib/log')
const path = require('path')
const fs = require('fs')
const os = require('os')

let configData = {}

// 获取用户配置
function getUserConfig() {
    const src = path.join(config.src, config.CONFIG_FILE_NAME)
    if (fs.existsSync(src)) {
        const { alias = {} } = JSON.parse(fs.readFileSync(src, 'utf8'))
        const aliasKeys = Object.keys(alias)
        if (aliasKeys.length) {
            configData.alias = []
            aliasKeys.forEach(v => {
                configData.alias.push({
                    scope: alias[v].scope,
                    dir: path.join(config.src, alias[v].dir)
                })
            })
        }
    }
}

// 监测文件入口
function watchFile() {
    let watcher = chokidar.watch([config.src], {
        cwd: config.cwd,
        ignored: /node_modules|\.git|\.txt|\.log|\.DS_Store|\.npmignore|package\.json|typings|\.gitignore|\.md|foxtail\.config\.json/i,
        persistent: true,
        ignoreInitial: true
    })

    watcher
        .on('add', watchAddFile)
        .on('addDir', watchAddDir)
        .on('change', watchChangeFile)
        .on('unlink', watchDeleteFile)
        .on('unlinkDir', watchDeleteDir)
        .on('error', err => {
            log.fatal(err)
        })
        .on('ready', () => {
            if (!this.isWatched) {
                this.isWatched = true
                log.msg(LogType.WATCH, '开始监听文件改动。')
            }
        })

    return watcher
}

// 监测添加文件
function watchAddFile(file) {
    file = file.slice(4)
    const src = path.join(config.src, file)
    const dest = path.join(config.dest, file)
    if (!fs.existsSync(dest)) {
        log.newline()
        log.msg(LogType.CREATE, file)
        fs.copyFileSync(src, dest)
    }
}

// 监测添加目录
function watchAddDir(dir) {
    dir = dir.slice(4)
    const dest = path.join(config.dest, dir)
    if (!fs.existsSync(dest)) {
        log.newline()
        log.msg(LogType.CREATE, dir)
        fs.mkdirSync(dest)
    }
}

// 监测删除文件
function watchDeleteFile(file) {
    file = file.slice(4)
    const dest = path.join(config.dest, file)
    if (fs.existsSync(dest)) {
        log.newline()
        log.msg(LogType.DELETE, file)
        fs.unlinkSync(dest)
    }
}

// 监测删除目录
function watchDeleteDir(dir) {
    dir = dir.slice(4)
    const dest = path.join(config.dest, dir)
    if (fs.existsSync(dest)) {
        log.newline()
        log.msg(LogType.DELETE, dir)
        fs.rmdirSync(dest)
    }
}

// 监测文件变动
function watchChangeFile(file) {
    file = file.slice(4)
    const src = path.join(config.src, file)
    const dest = path.join(config.dest, file)
    const extname = path.extname(src)
    log.newline()
    log.msg(LogType.CHANGE, file)
    if (~['.js', '.json'].indexOf(extname) && configData.alias) {
        let fileData = fs.readFileSync(src, 'utf8')
        configData.alias.forEach(v => {
            const relative = path.relative(src, v.dir)
            const regexp = new RegExp(`${v.scope}`, 'g')
            fileData = fileData.replace(regexp, relative)
        })
        fs.writeFileSync(dest, fileData)
    } else {
        fs.copyFileSync(src, dest)
    }
}

function run() {
    if (fs.existsSync(config.src) || fs.existsSync(config.dest)) {
        watchFile()
        getUserConfig()
    } else {
        log.msg(LogType.WARN, '该目录下暂无初始化项目，请使用foxtail init初始化项目。')
    }
}

module.exports = {
    run
}
