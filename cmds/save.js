import { writeFileSync } from "node:fs"

import { container } from '../cli.js'

import { toDiceNotation, parseDiceNotation } from '../lib/dice.js'
import { initMiddleware, endMiddleware } from '../lib/middleware-helpers.js'

async function doSave(argv) {
  const logger = container.resolve("logger")
  const notation = toDiceNotation(argv)
  const newConfig = { ...container.resolve("config") }
  container.resolve("config").roll.savedRolls[argv.name] = notation
  writeFileSync(container.resolve("configPath"), JSON.stringify(newConfig, null, 4))
  logger.user(`Saved roll "${argv.name}" with value "${notation}" for later use. To roll these dice in the future, run "${argv.$0} roll --saved ${argv.name}".`)
}

function mapDiceNotation(argv) {
  initMiddleware('mapDiceNotation', argv)
  if (argv._.length > 1) {
    argv = { ...argv, ...parseDiceNotation(argv._[1]) }
    if (argv.offset)
      argv.aggregate = 'sum'
    argv._.pop()
  }
  endMiddleware('mapDiceNotation')
  return argv
}

function buildSaveCommand(yargs) {
  return yargs
  .middleware([mapDiceNotation], true)
  .options({
    'name': {
      type: 'string',
      description: 'the name you\'ll use to roll this set of dice in the future',
      demandOption: true
    },
    'sides': {
      demandOption: true,
      description: 'the number of sides on the die being rolling',
      type: 'number'
    },
    'count': {
      default: 1,
      description: 'the number of dice to roll',
      type: 'number'
    },
    'aggregate': {
      choices: ['none', 'sum', 'average'],
      description: 'how to aggregate the results of rolling multiple dice',
      default: 'none'
    },
    'offset': {
      type: 'number',
      description: 'an offset to apply to summed die rolls',
      default: 0
    },
  })
  .example([
    ['$0 save --name six --sides 6', 'save a roll consisting of one 6-sided die'],
    ['$0 save --name eights --count 3 --sides 8 --aggregate sum --offset 3', 'roll 3 8-sided dice, sum them, and add 3'],
    ['$0 save --name terrible d20-5', 'roll one 20-sided die, then subtract 5 from it'],
  ])
  .version(false)
  .help()
}

export default {
  builder: buildSaveCommand,
  handler: doSave
}
