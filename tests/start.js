import awilix from 'awilix'
import { expect } from 'chai'
import { run } from '../cli.js'
import fakeLogger from './injectables/logger.js'
import { setupTestContainer as setupContainer } from '../config/setup-container.js'

describe('roll command', function() {
  const err = console.error
  console.error = fakeLogger.stderr
  let container

  beforeEach(() => {
    console.error.reset()
    container = setupContainer()
    container.resolve("logger").user.reset()
  })

  after(() => {
    console.error = err
  })

  describe('happy path', function() {
    it('works great', async function() {
      await run("roll --sides 6", container)
      const output = container.resolve("logger").user.get()
      expect(console.error.get()).to.equal('')
      expect(output).to.match(/^Rolled 1d6: \d$/)
    })
  })

  describe('flag', function() {
    describe('--sides', function() {
      it('should error if sides is not provided', async function() {
        try {
          await run("roll", container)
        } catch (e) {
          expect(e.message).to.equal("Missing required argument: sides")
          const output = container.resolve("logger").user.get()
          expect(output).to.equal('')
        }
      })
    })

    describe('--remote-rng', function() {
      it('should make a network request for random numbers', async function() {
        container.resolve("fetch").next([1, 2, 3, 4])
        await run("roll --count 4 --sides 8 --remote", container)
        const output = container.resolve("logger").user.get()
        expect(output).to.equal("Rolled 4d8: 1,2,3,4")
      })
    })
  })

  describe('awilix', function() {
    it('can re-define an injectable', function() {
      container.register({ number: awilix.asValue(3) })
      expect(container.resolve("number")).to.equal(3)
      container.register({ number: awilix.asValue(6) })
      expect(container.resolve("number")).to.equal(6)
    })
  })

})
