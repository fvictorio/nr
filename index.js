#!/usr/bin/env node

const inquirer = require('inquirer')
const fs = require('fs')
const { spawn } = require('child_process')

if (process.argv.length > 2) {
  runScript(process.argv[2])
} else {
  const scripts = Object.keys(JSON.parse(fs.readFileSync('package.json')).scripts)

  inquirer
    .prompt([
      {
        name: 'script',
        type: 'list',
        message: 'Which script do you want to run?',
        choices: scripts
      }
    ])
    .then(answers => {
      runScript(answers.script)
    })
}

function runScript(script) {
  spawn(`npm`, ['run', script], { stdio: 'inherit' })
}
