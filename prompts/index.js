const colors = require('colors/safe')

const existingRepo = {
  name: 'confirm',
  message: colors.white('Current directory is under version control. Your package.json will be merged. Anything else will be overwritten if necessary (eg src directory). Do you want to proceed?'),
  validator: /y[es]*|n[o]?/i,
  warning: 'Must respond yes or no.',
  default: 'no'
}

const noPackageJSON = {
  name: 'confirm',
  message: colors.red('You are running javascript-project-boilerplate in a git repository that does not yet have a package.json. You should probably do `yarn init` before running this util. Do you want to proceed?'),
  validator: /y[es]*|n[o]?/i,
  warning: 'Must respond yes or no.',
  default: 'no'
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

module.exports = {
  existingRepo: existingRepo,
  noPackageJSON: noPackageJSON,
  notifyCopySuccess: notifyCopySuccess,
  notifyYarnSuccess: notifyYarnSuccess,
}
