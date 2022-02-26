import { exec, ExecOptions } from 'child_process'

import E2eConfig from './e2e-config'

export default function execa({
  command,
  options,
  verboseToFile = true,
}: {
  command: string
  options?: ExecOptions
  verboseToFile?: boolean
}) {
  return new Promise(async (resolve, reject) => {
    if (verboseToFile) {
      await E2eConfig.appendToDebugLog(`Command: "${command}"`)
      await E2eConfig.appendToDebugLog(`Options: "${JSON.stringify(options, null, 2)}"`)
      await E2eConfig.appendToDebugLog('Output:')
    }
    const proc = exec(command, options, (error, stdout, stderr) => {
      if (error || stderr) {
        reject(error || stderr)
      } else {
        resolve(stdout)
      }
    })
    if (proc?.stdout) {
      proc.stdout.on('data', (chunk: Buffer) => {
        recordAndReply(chunk.toString(), 'stdout', verboseToFile)
      })
    }
    if (proc?.stderr) {
      proc.stderr.on('data', (chunk: Buffer) => {
        recordAndReply(chunk.toString(), 'stderr', verboseToFile)
      })
    }
  })
}

function recordAndReply(chunk: string, prefix: string, shouldWrite: boolean) {
  if (shouldWrite) {
    E2eConfig.appendToDebugLog(`${prefix}: ${JSON.stringify(chunk.toString())}`) // for some reason if this is awaited, chunks get read in incorrect order (stdout vs stderr)
  }
}
