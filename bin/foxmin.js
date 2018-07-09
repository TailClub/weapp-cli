#!/usr/bin/env node
const program = require('commander')
const pkg = require('../package.json')
const commands = require('../src/commands')

program
    .version(pkg.version)
    .option('dev', 'Start development mode')
    .option('init', 'Start to init mimi application')
    .option('test', 'Start test mode')
    .parse(process.argv)

if (program.dev) {
    commands.startDevMode()
}

if (program.init) {
    commands.startInitMode()
}
