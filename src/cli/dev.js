const child_process = require('child_process')
const { LogType } = require('../lib/status')
const chokidar = require('chokidar')
const config = require('../config')
const log = require('../lib/log')
const glob = require('glob')
const path = require('path')
const less = require('less')
const fs = require('fs')

let configData = {}

const isWin32 = process.platform === 'win32'

// 编译less
function compileLess(srcPath, destPath) {
    const content = fs.readFileSync(srcPath, 'utf8')
    less.render(content, {
        rootFileInfo: {
            currentDirectory: path.dirname(srcPath)
        }
    })
        .then(res => {
            destPath = destPath.replace('.less', '.wxss')
            if (res.css.length) {
                fs.writeFileSync(destPath, res.css)
            }
        })
        .catch(e => {
            log.msg(LogType.ERROR, srcPath)
        })
}

// 编译js
function compileJavascript(srcPath, destPath) {
    let fileData = fs.readFileSync(srcPath, 'utf8')
    const extname = path.extname(srcPath)
    if (extname === '.js' && configData.useAsync.active) {
        if (/\basync\b/.test(fileData)) {
            fileData = `import regeneratorRuntime from '${configData.useAsync.path}'\n` + fileData
        }
    }
    configData.alias.forEach(v => {
        const relative = path.relative(path.dirname(srcPath), v.dir)
        const relativePath = isWin32 ? relative.replace(/\\/g, '/') : relative
        const regexp = new RegExp(`${v.scope}`, 'g')
        fileData = fileData.replace(regexp, relativePath)
    })

    fs.writeFileSync(destPath, fileData)
}

// 获取用户配置
function getUserConfig() {
    const src = path.join(config.cwd, config.CONFIG_FILE_NAME)
    if (fs.existsSync(src)) {
        const { alias = {}, useAsync = {} } = JSON.parse(fs.readFileSync(src, 'utf8'))
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
        configData.useAsync = useAsync
    }
}

// 编译全文件
function buildFiles() {
    child_process.spawnSync('rm', ['-r', config.dest])
    child_process.spawnSync('cp', ['-r', config.src, config.dest])
    // 删除dest目录无用的文件
    // child_process.spawnSync('rm', ['-rf', `./dest/${config.CONFIG_FILE_NAME}`, './dest/README.md', './dest/.gitignore'])
    log.msg(LogType.CREATE, `生成dest目录成功`)

    const files = glob.sync('**/*.{js,json,less}', {
        cwd: config.src,
        ignore: '{{project,foxtail}.config,jsconfig}.json'
    })
    files.forEach(file => {
        const src = path.join(config.src, file)
        const dest = path.join(config.dest, file)
        if (path.extname(src) === '.less') {
            compileLess(src, dest, true)
        } else {
            compileJavascript(src, dest)
        }
        log.msg(LogType.BUILD, file)
    })

    cleanFiles()
}

function cleanFiles() {
    const files = glob.sync('**/*.less', {
        cwd: config.dest,
        ignore: '{{project,foxtail}.config,jsconfig}.json'
    })
    files.forEach(file => {
        fs.unlink(path.join(config.dest, file), e => {})
    })
}

// 监测文件入口
function watchFile() {
    let watcher = chokidar.watch([config.src], {
        cwd: config.cwd,
        ignored: /node_modules|\.DS_Store/i,
        persistent: true,
        ignoreInitial: true
    })

    watcher
        .on('addDir', watchAddDir)
        .on('add', watchAddFile)
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
    const dest = path.join(config.dest, file).replace('.less', '.wxss')
    const destDir = path.dirname(dest)
    if (!fs.existsSync(destDir)) {
        log.msg(LogType.CREATE, destDir.slice(destDir.lastIndexOf('/')))
        fs.mkdirSync(destDir)
    }
    if (!fs.existsSync(dest)) {
        log.msg(LogType.CREATE, file)
        fs.copyFileSync(src, dest)
    }
}

// 监测添加目录
function watchAddDir(dir) {
    dir = dir.slice(4)
    const dest = path.join(config.dest, dir)
    if (!fs.existsSync(dest)) {
        log.msg(LogType.CREATE, dir)
        fs.mkdirSync(dest)
    }
}

// 监测删除文件
function watchDeleteFile(file) {
    file = file.slice(4).replace('.less', '.wxss')
    const dest = path.join(config.dest, file)

    if (fs.existsSync(dest)) {
        log.msg(LogType.DELETE, file)
        fs.unlinkSync(dest)
    }
}

// 监测删除目录
function watchDeleteDir(dir) {
    dir = dir.slice(4)
    const dest = path.join(config.dest, dir)
    if (fs.existsSync(dest)) {
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
    log.msg(LogType.CHANGE, file)
    if (~['.js', '.json'].indexOf(extname) && configData.alias) {
        compileJavascript(src, dest)
    } else if (extname === '.less') {
        compileLess(src, dest)
    } else {
        fs.copyFileSync(src, dest)
    }
}

function run() {
    if (fs.existsSync(config.src)) {
        getUserConfig()
        buildFiles()
        watchFile()
    } else {
        log.msg(LogType.WARN, '该目录下暂无初始化项目，请使用foxtail init初始化项目。')
    }
}

module.exports = {
    run
}
