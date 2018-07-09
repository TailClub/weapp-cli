const devService = require('./cli/dev')
const initService = require('./cli/init')

module.exports = {
    startDevMode() {
        devService.run()
    },
    startInitMode() {
        initService.run()
    }
}
