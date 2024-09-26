import fs from 'node:fs'

import { findUpSync } from 'find-up'
import chalk from 'chalk'

const configPath = findUpSync(['dice.json'])
const config = configPath ? JSON.parse(fs.readFileSync(configPath)) : {}

let maxVerbosity = config.verbosity || 2

export function configureLogging(argv) {
  maxVerbosity = argv.verbosity || config.verbosity || 2
}

function log(text, verbosity, stream, component="unknown") {
  if (maxVerbosity >= verbosity)
    stream(`[${component}]: ${text}`)
}

export default {
  // verbosity: maxVerbosity,
  debug: (text, component) => log(chalk.blue(text), 5, console.log, component),
  info: (text, component) => log(chalk.green(text), 4, console.log, component),
  warn: (text, component) => log(chalk.yellow(text), 3, console.warn, component),
  error: (text, component) => log(chalk.red(text), 2, console.error, component),
  fatal: (text, component) => log(chalk.redBright(text), 1, console.error, component),
  user: console.log
}
