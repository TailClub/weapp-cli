const os = require('os')
const path = require('path')
const cwd = process.cwd()
module.exports = {
    cwd,
    src: `${cwd}/src`,
    dest: `${cwd}/dest`,
    title: 'Foxtail',
    CONFIG_FILE_NAME: 'foxtail.config.json',
    MINI_CONFIG_FILE_NAME: 'project.config.json',
    scaffold: {
        application: path.join(__dirname, '../scaffold/application')
    }
}
