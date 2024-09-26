export function prefix(prefix, candidates) {
  return candidates.filter((candidate => candidate.startsWith(prefix)))
}
