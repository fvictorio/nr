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
  const entries = Object.entries(scripts)

  if (!entries.length) {
    console.log('No scripts in package.json')

    return
  }

  inquirer
    .prompt([
      {
        name: 'script',
        type: 'list',
        message: 'Which script do you want to run?',
        choices: choices(entries),
      },
    ])
    .then(answers => {
      runScript(answers.script)
    })
}

function runScript(script, ...args) {
  spawn(`npm`, ['run', script, ...args], { stdio: 'inherit' })
}

function choices(pairs) {
  return pairs.map(([script, content]) => ({
    value: script,
    short: script,
    name: chalk`{bold ${script}}: ${content}`,
  }))
}
