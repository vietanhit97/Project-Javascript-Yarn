#! /usr/bin/env node

const fs = require('fs-extra')
const { spawn } = require('child_process')
const package = require('./template/package')
const prompt = require('prompt')
const prompts = require('./prompts')

function swapGitIgnore() {
  // Npm tampers with "special" files
  // Have to copy gitignore and then rename
  // https://github.com/npm/npm/issues/3763
  fs.moveSync('gitignore', '.gitignore')
}

function doMerge() {
  const dependencies = package.dependencies
  const devDependencies = package.devDependencies
  let newPackage = {}

  if (fs.existsSync('package.json')) {
    newPackage = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
  } else {
    newPackage = {}
  }

  // Merge package.jsons
  Object.keys(package).map(key => {
    if (typeof package[key] === 'object') {
      newPackage[key] = Object.assign({}, newPackage[key], package[key])
    }
  })

  // Copy template over
  fs.copy(process.mainModule.filename.replace('index.js', '') + 'template', process.env.PWD + '/')
    .catch(err => console.error(err))
    .then(() => {

      swapGitIgnore()
      prompts.notifyCopySuccess()

      // Overwrite package.json, retaining previous data
      fs.writeFileSync('package.json', JSON.stringify(newPackage))

      performYarnInstall()

    })
}

function performYarnInstall() {
  const child = spawn('yarn')
  child.stdout.on('data', (data) => console.log(`${data}`))
  child.stderr.on('data', (data) => console.error(`${data}`))
  child.on('exit', () => {
    prompts.notifyYarnSuccess()
  })
}

if (!fs.existsSync('.git')) {

  // If dir is not under VC, just do a straight copy
  fs.copy(process.mainModule.filename.replace('index.js', '') + 'template', process.env.PWD + '/')
    .catch(err => console.error(err))
    .then(() => {
      swapGitIgnore()
      prompts.notifyCopySuccess()
      performYarnInstall()
    })

} else {

  prompt.start()
  prompt.get(prompts.existingRepo, function (error, result) {

    if (!error && result && (/y/i).test(result.confirm)) {

      if (!fs.existsSync('package.json')) {

        prompt.get(prompts.noPackageJSON, function (error, result) {

          if (!error && result && (/y/i).test(result.confirm)) {

            doMerge()

          } else {
            process.exit()
          }

        })

      } else {
        doMerge()
      }

    } else {
      process.exit()
    }
  })
}
