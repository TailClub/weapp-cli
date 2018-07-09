#!/usr/bin/env node
const program = require('commander')
const pkg = require('../package.json')
const commands = require('../src/commands')
const config = require('../src/config')

const { getQuestion } = require('../src/cli/qa/init-qa')

program
    .version('0.1.0')
    .option('dev', 'Start development mode')
    .option('init', 'Start to init mimi application')
    .option('test', 'Start test mode')
    .parse(process.argv)

if (program.test) {
}

if (program.dev) {
    commands.startDevMode()
}

if (program.init) {
    commands.startInitMode()
}
