import awilix from 'awilix'
import logger from '../lib/logger.js'
import fakeLogger from '../tests/injectables/logger.js'
import fakeFetch from '../tests/injectables/fetch.js'

import { findUpSync } from 'find-up'
import fs from 'node:fs'
const __dirname = import.meta.dirname;
export const configPath = findUpSync(['dice.json'], { cwd: __dirname })
export const config = configPath ? JSON.parse(fs.readFileSync(configPath)) : {}

export function setupTestContainer() {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY,
    strict: true
  })

  container.register({
    logger: awilix.asValue(fakeLogger),
    fetch: awilix.asValue(fakeFetch),
    config: awilix.asValue(config),
    configPath: awilix.asValue(configPath),
  })

  return container
}

export function setupRealContainer() {
  const container = awilix.createContainer({
    injectionMode: awilix.InjectionMode.PROXY,
    strict: true
  })

  container.register({
    logger: awilix.asValue(logger),
    fetch: awilix.asValue(fetch),
    config: awilix.asValue(config),
    configPath: awilix.asValue(configPath),
  })

  return container
}
