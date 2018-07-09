const { prompt, Question } = require('inquirer')
const config = require('../../config')
async function getQuestion() {
    const QUESTIONS = [
        {
            type: 'input',
            message: '请设置项目名',
            name: 'title',
            default: config.title,
            filter(input) {
                return input.trim()
            }
        },
        {
            type: 'input',
            message: '请输入appid',
            name: 'appId',
            default: '',
            filter(input) {
                return input.trim()
            }
        }
    ]
    return await prompt(QUESTIONS)
}

module.exports = { getQuestion }
