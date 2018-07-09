const child_process = require('child_process')
const { LogType } = require('../lib/status')
const chokidar = require('chokidar')
const config = require('../config')
const log = require('../lib/log')
const glob = require('glob')
const path = require('path')
const fs = require('fs')

let configData = {}

// 获取用户配置
function getUserConfig() {
    const src = path.join(config.cwd, config.CONFIG_FILE_NAME)
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

// 编译全文件
function buildFiles() {
    child_process.spawnSync('cp', ['-r', config.src, config.dest])
    // 删除dest目录无用的文件
    // child_process.spawnSync('rm', ['-rf', `./dest/${config.CONFIG_FILE_NAME}`, './dest/README.md', './dest/.gitignore'])
    log.msg(LogType.CREATE, `生成dest目录成功`)

    const files = glob.sync('**/*.{js,json}', {
        cwd: config.src,
        ignore: '{{project,foxtail}.config,jsconfig}.json'
    })
    files.forEach(file => {
        const src = path.join(config.src, file)
        const dest = path.join(config.dest, file)

        let fileData = fs.readFileSync(src, 'utf8')
        configData.alias.forEach(v => {
            const relative = path.relative(src, v.dir)
            const regexp = new RegExp(`${v.scope}`, 'g')
            fileData = fileData.replace(regexp, relative)
        })
        fs.writeFileSync(dest, fileData)
        log.msg(LogType.BUILD, file)
    })
}

// 监测文件入口
function watchFile() {
    let watcher = chokidar.watch([config.src], {
        cwd: config.cwd,
        ignored: /node_modules|\.\w+/i,
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
                if (!fs.existsSync(config.dest)) {
                    buildFiles()
                }
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
    if (fs.existsSync(config.src)) {
        getUserConfig()
        if (!fs.existsSync(config.dest)) {
            buildFiles()
        }
        watchFile()
    } else {
        log.msg(LogType.WARN, '该目录下暂无初始化项目，请使用foxtail init初始化项目。')
    }
}

module.exports = {
    run
}
