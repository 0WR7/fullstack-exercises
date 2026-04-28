import { spawn } from 'node:child_process'

const children = [
  spawn('pnpm', ['--dir', 'server', 'dev'], {
    shell: true,
    stdio: 'inherit',
  }),
  spawn('pnpm', ['--dir', 'client', 'dev'], {
    shell: true,
    stdio: 'inherit',
  }),
]

let shuttingDown = false

const stop = (code = 0) => {
  if (shuttingDown) return

  shuttingDown = true

  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGINT')
    }
  }

  process.exit(code)
}

for (const child of children) {
  child.on('exit', (code, signal) => {
    if (shuttingDown) return

    stop(code ?? (signal ? 1 : 0))
  })
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => stop(0))
}
