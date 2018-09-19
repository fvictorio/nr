#!/usr/bin/env node

const fs = require('fs')
const { spawn } = require('child_process')

const inquirer = require('inquirer')
const chalk = require('chalk')

if (process.argv.length > 2) {
  runScript(...process.argv.slice(2))
} else {
  main()
}

function main() {
  const pkg = fs.readFileSync('package.json')
  const scripts = JSON.parse(pkg).scripts || {}
  const names = Object.keys(scripts)

  if (!names.length) {
    console.log('No scripts in package.json')

    return
  }

  logScripts(scripts)

  inquirer
    .prompt([
      {
        name: 'script',
        type: 'list',
        message: 'Which script do you want to run?',
        choices: names,
      },
    ])
    .then(answers => {
      runScript(answers.script)
    })
}

function runScript(script, ...args) {
  spawn(`npm`, ['run', script, ...args], { stdio: 'inherit' })
}

function logScripts(scripts = {}) {
  const entries = Object.entries(scripts)

  const longest = entries.reduce(
    (acc, [name]) => (name.length > acc ? name.length : acc),
    0,
  )

  const table = entries.reduce(
    (acc, [n, c]) => chalk`${acc}{bold ${n.padStart(longest, ' ')}} - ${c}\n`,
    '',
  )

  console.log('-----'.padStart(longest + 4, ' '))
  console.log(table.replace(/\n$/, ''))
  console.log('-----'.padStart(longest + 4, ' '))
  console.log()
}
