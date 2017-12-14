#! /usr/bin/env node

const fs = require('fs-extra')
const { spawn } = require('child_process')
const package = require('./template/package')

function performYarnInstall() {
  const child = spawn('yarn')
  child.stdout.on('data', (data) => console.log(`${data}`))
  child.stderr.on('data', (data) => console.error(`${data}`))
  child.on('exit', () => {
    notifyYarnSuccess()
  })
}

if (!fs.existsSync('.git')) {

  // If dir is not under VC, just do a straight copy
  fs.copy(process.mainModule.filename.replace('index.js', '') + 'template', process.env.PWD + '/')
    .catch(err => console.error(err))  
    .then(() => {
      notifyCopySuccess()
      performYarnInstall()
    })

} else {

  notifyPackageMerge()

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

      notifyCopySuccess()

      // Overwrite package.json, retaining previous data
      fs.writeFileSync('package.json', JSON.stringify(newPackage))

      performYarnInstall()

    })

}

function notifyPackageMerge() {
  console.log('')
  console.log('------------------------ WARNING -------------------------')
  console.log('------- Current directory is under version control -------')
  console.log('------------ Your package.json will be merged ------------')
  console.log('----------- Anything else will be overwritten ------------')
  console.log('------------------------ WARNING -------------------------')
  console.log('')
}
function notifyCopySuccess() {
  console.log('')
  console.log('---------- Template copied to current directory ----------')
  console.log('')
}
function notifyYarnSuccess() {
  console.log('----------------- Yarn install complete ------------------')
  console.log('')
}
