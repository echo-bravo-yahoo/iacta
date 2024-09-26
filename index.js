#!/usr/bin/env node

import { hideBin } from 'yargs/helpers'
import { run } from './cli.js'
import { setupRealContainer as setupContainer } from './config/setup-container.js'

run(hideBin(process.argv), setupContainer())
