import { container } from '../cli.js'

import { initMiddleware, endMiddleware } from '../lib/middleware-helpers.js'
import rng from '../lib/rng.js'
import { parseDiceNotation } from '../lib/dice.js'

async function doRoll(argv) {
  const logger = container.resolve("logger")
  let roll = await rng(1, argv.sides, argv.count, !argv.remote)
  logger.info(`Raw roll: ${roll.join(', ')}.`, 'command')
  if (argv.aggregate === 'sum') {
    roll = roll.reduce((next, sum) => next + sum, 0) + argv.offset
  } else if (argv.aggregate === 'average') {
    roll = roll.reduce((next, sum) => next + sum, 0) / roll.length
  } else if (argv.aggregate === 'none') {
    roll = roll
  }

  logger.user(`Rolled ${argv.count}d${argv.sides}: ${roll}`)
}

function checkArgCompatibility(argv) {
  const logger = container.resolve("logger")
  initMiddleware('checkArgCompatibility', argv)
  if (argv.offset && argv.aggregate !== 'sum') {
    logger.fatal(`Offsets ("--offset=${argv.offset}") is only applicable to sums. Please remove the offset or aggregate the roll as a sum ("--aggregate=sum").`, 'command')
    process.exit(2)
  }

  endMiddleware('checkArgCompatibility')
  return argv
}

function readSavedRoll(argv, yargs) {
  initMiddleware('readSavedRoll', argv)
  if (argv.savedRoll) {
    argv._.push(argv.savedRolls[argv.savedRoll])
  }

  yargs.options({ 'saved-roll': { choices: Object.keys(argv.savedRolls) } })

  delete argv.savedRolls
  endMiddleware('readSavedRoll')
  return argv
}

export function mapDiceNotation(argv) {
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

function buildRollCommand(yargs) {
  return yargs
    .middleware([readSavedRoll, mapDiceNotation, checkArgCompatibility], true)
    .options({
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
      'saved-roll': {
        alias: 'saved',
        description: 'roll a previously saved die roll',
        type: 'string'
      },
      'remote-rng': {
        alias: 'remote',
        description: 'use a remote API as the source of random die rolls',
        default: false,
        type: 'boolean'
      },
    })
    .example([
      ['$0 roll --sides 6', 'roll one 6-sided die'],
      ['$0 roll --count 3 --sides 8 --aggregate sum --offset 3', 'roll 3 8-sided dice, sum them, and add 3'],
      ['$0 roll d20-5 --remote-rng', 'roll one 20-sided die using a remote RNG, then subtract 5 from it'],
    ])
    .config(container.resolve("config").roll)
    .version(false)
    .help()
}

export default {
  builder: buildRollCommand,
  handler: doRoll
}
