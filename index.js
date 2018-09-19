#!/usr/bin/env node

const inquirer = require('inquirer')
const fs = require('fs')
const shell = require('shelljs')

const scripts = Object.keys(JSON.parse(fs.readFileSync('package.json')).scripts)

inquirer.prompt([
  {
    name: 'script',
    type: 'list',
    message: 'Which script do you want to run?',
    choices: scripts
  }
])
  .then(answers => {
    shell.exec(`npm run ${answers.script}`, {stdio: 'inherit'})
  })
