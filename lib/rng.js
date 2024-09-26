import { container } from '../cli.js'

function random(min, max) {
  return min + Math.round(Math.random()*(max-min))
}

function localRNG(min, max, count) {
  let res = []
  for(let i = 0; i < count; i++) {
    res.push(random(min, max))
  }
  return res
}

async function remoteRNG(min, max, count) {
  const logger = container.resolve("logger")
  const fetch = container.resolve("fetch")
  logger.info(`Calling random number api.`, 'fetch')
  const res = await fetch(`http://www.randomnumberapi.com/api/v1.0/random?min=${min}&max=${max}&count=${count}`)
  const json = await res.json()
  logger.info(`Received response ${JSON.stringify(json, null, 4)}.`, 'fetch')
  return json
}

export default async function rng(min, max, count=1, local=true) {
  if (local) {
    return localRNG(min, max, count)
  } else {
    return remoteRNG(min, max, count)
  }
}
