let stdout = ''
let stderr = ''

function fakeStdoutLogger(text) {
  stdout += text
}
fakeStdoutLogger.get = () =>  stdout
fakeStdoutLogger.reset = () => stdout = ''

function fakeStderrLogger(text) {
  stderr += text
}
fakeStderrLogger.get = () => stderr
fakeStderrLogger.reset = () => stderr = ''

export default {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
  fatal: () => {},
  user: fakeStdoutLogger,
  stdout: fakeStdoutLogger,
  stderr: fakeStderrLogger,
}
