const fs = require('fs')
const mem = require('mem-fs')
const editor = require('mem-fs-editor')
const config = require('../config')
const { getQuestion } = require('./qa/init-qa')
const log = require('../lib/log')
const { LogType } = require('../lib/status')
const glob = require('glob')
const child_process = require('child_process')

// 拷贝 脚手架模板
function copyScaffold(options) {
    const { src: proSrc, dest: prodest, scaffold } = config
    // 创建内存编辑器
    const store = mem.create()
    const fsEditor = editor.create(store)
    // 拷贝 mimi application 脚手架
    fsEditor.copyTpl(scaffold.application, proSrc, options, null, {
        globOptions: {
            dot: true
        }
    })
    return new Promise((resolve, reject) => {
        // 保存
        fsEditor.commit(() => {
            log.newline()
            log.msg(LogType.CREATE, `项目 "${options.title}" in ${proSrc}`)

            // 输入拷贝 或 新增 的日志信息
            const files = glob.sync('**', {
                cwd: proSrc
            })
            files.forEach(file => {
                log.msg(LogType.COPY, file)
            })

            child_process.spawnSync('cp', ['-r', proSrc, prodest])
            // 删除dest目录无用的文件
            child_process.spawnSync('rm', [
                '-rf',
                `./dest/${config.CONFIG_FILE_NAME}`,
                './dest/README.md',
                './dest/.gitignore'
            ])

            log.msg(LogType.CREATE, `生成dest目录成功`)

            log.msg(LogType.COMPLETE, `项目已创建完成`)
            resolve()
        })
    })
}

// 检查是否存在目录
function checkCouldInit() {
    if (fs.existsSync(config.src) && fs.existsSync(config.dest)) {
        log.msg(LogType.WARN, '该目录下已存在初始化项目')
        return false
    } else {
        return true
    }
}

async function run() {
    if (checkCouldInit()) {
        const options = await getQuestion()
        await copyScaffold(options)
    }
}

module.exports = {
    run
}
