import yargs from 'yargs'

import rollCommand from './cmds/roll.js'
import saveCommand from './cmds/save.js'
import { prefix } from './lib/completion.js'

export let container

export function run(argvInput, _container) {
  container = _container
  return yargs(argvInput)
    .scriptName("iacta")
    // .config(config)
    .option('verbosity')
    .command('roll', 'roll some dice', rollCommand)
    .command('save', 'remember a die roll for later', saveCommand)
    .demandCommand()
    .strict()
    .completion('completion', function(currentWord, argv, defaultCompletions, done) {
      const logger = container.resolve("logger")
      logger.debug(`Attempting auto-complete for current word ${currentWord} with argv ${JSON.stringify(argv, null, 4)}.`, 'completion')
      const completions = {
        'saved': () => Object.keys(argv.savedRolls) || []
      }

      for (const [key, completionGetter] of Object.entries(completions)) {
        if (currentWord === argv[key])
          done(prefix(currentWord, completionGetter()))
      }
      defaultCompletions()
    })
    .wrap(yargs.terminalWidth)
    .help()
    .exitProcess(false)
    .parse()
}
