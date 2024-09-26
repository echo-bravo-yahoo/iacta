import { container } from '../cli.js'

const timings = {}

export function initMiddleware(name, argv) {
  const logger = container.resolve("logger")
  logger.debug(`Starting middleware ${name} with args: ${JSON.stringify(argv, null, 2)}.`, 'middleware')
  timings[name] = { start: Date.now() }
}

export function endMiddleware(name) {
  const logger = container.resolve("logger")
  timings[name].end = Date.now()
  logger.debug(`Ending middleware ${name} after ${timings[name].end - timings[name].start} ms.`, 'middleware')
}
