const fs = require('fs')
const path = require('path')
const config = require('../config')
const log = require('../lib/log')
const { LogType } = require('../lib/status')
const child_process = require('child_process')
const cacheFile = {}
module.exports = {
    exists(key) {
        return cacheFile[key]
    },
    add(key) {
        if (!this.exists(key)) {
            cacheFile[key] = true
        }
    },
    remove(key) {
        if (this.exists(key)) {
            if (fs.statSync(path.join(config.src, key)).isDirectory()) {
                // 删除目录
                child_process.spawnSync('rm', ['-rf', path.join(config.dest, key)])
                Object.keys(cacheFile)
                    .filter(v => {
                        return !!~v.indexOf(key)
                    })
                    .forEach(v => {
                        cacheFile[v] = false
                    })
                console.log(cacheFile)
            } else {
                // 删除文件
                fs.unlinkSync(path.join(config.dest, key))
                cacheFile[key] = false
            }

            log.msg(LogType.DELETE, 'key')
        }
    }
}
