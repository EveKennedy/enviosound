import { spawn } from 'node:child_process'

const isWindows = process.platform === 'win32'
const npmCmd = isWindows ? 'npm.cmd' : 'npm'

const children = [
  spawn('node', ['server/realtime-session.js'], {
    stdio: 'inherit',
    env: process.env
  }),
  spawn(npmCmd, ['run', 'dev:client', '--', '--host', '0.0.0.0'], {
    stdio: 'inherit',
    env: process.env
  })
]

let shuttingDown = false

function shutdown(code = 0) {
  if (shuttingDown) return
  shuttingDown = true
  children.forEach((child) => {
    if (!child.killed) child.kill('SIGTERM')
  })
  process.exit(code)
}

children.forEach((child) => {
  child.on('exit', (code) => {
    if (!shuttingDown && code !== 0) shutdown(code || 1)
  })
})

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))
