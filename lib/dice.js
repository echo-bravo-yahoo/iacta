import { container } from '../cli.js'

export function toDiceNotation(obj) {
  let offsetString = ''
  if (obj.offset > 0) {
    offsetString = `+${obj.offset}`
  } else if (obj.offset < 0) {
    offsetString = `-${obj.offset}`
  }

  return `${obj.count || ''}d${obj.sides}${offsetString}`
}

export function parseDiceNotation(notation) {
  const logger = container.resolve("logger")
  const regex = /^(\d+)*d(\d+)([+-]+\d+)*$/
  const results = regex.exec(notation)
  if (results === null) {
    logger.fatal(`Could not parse dice notation string "${notation}"! The string must match the regex "${regex.toString()}".`, 'command')
    process.exit(1)
  }

  return {
    count: results[1],
    sides: results[2],
    offset: results[3]
  }
}

