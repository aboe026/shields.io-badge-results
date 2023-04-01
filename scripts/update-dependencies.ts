/* eslint-disable @typescript-eslint/no-explicit-any */
import { exec } from 'child_process'
import fs from 'fs/promises'
import path from 'path'
import { promisify } from 'util'

import packageJson from '../package.json'

const execa = promisify(exec)
const DENY_LIST: string[] = []

//
;(async () => {
  const outdated = await getOutdatedDependencies()
  for (const key in outdated) {
    if (DENY_LIST.includes(key)) {
      console.log(`Skipping "${key}" due to deny list`)
    } else {
      const info: OutdatedDependency = outdated[key]
      const currentFirstDigit = info.current.split('.')[0]
      const latestFirstDigit = info.latest.split('.')[0]
      if (latestFirstDigit > currentFirstDigit) {
        console.warn(`Major version bump for "${key}" - "${info.current}" to "${info.latest}"`)
      }
      if (key in packageJson.dependencies) {
        ;(packageJson.dependencies as any)[key] = info.latest
      } else if (key in packageJson.devDependencies) {
        ;(packageJson.devDependencies as any)[key] = info.latest
      }
    }
  }
  await fs.writeFile(path.join(__dirname, '../package.json'), `${JSON.stringify(packageJson, null, 2)}\n`)
})()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .then(() => {
    console.log('Dependencies updated! Run "npm install" to install new dependencies.')
    process.exit(0)
  })

async function getOutdatedDependencies(): Promise<OutdatedDependenciesList> {
  let response: any
  try {
    response = await execa('npm outdated --json')
  } catch (err: any) {
    if (err && err.stderr === '' && err.stdout) {
      response = err
    } else {
      throw err
    }
  }
  if (response.stderr) {
    throw new Error(`Error executing 'npm outdated --json' command: ${JSON.stringify(response, null, 2)}`)
  }
  let outdatedJson
  try {
    outdatedJson = JSON.parse(response.stdout)
  } catch (err: any) {
    throw new Error(`Error parsing outdated as JSON: ${err.message || err}`)
  }
  return outdatedJson
}

interface OutdatedDependenciesList {
  [key: string]: OutdatedDependency
}

interface OutdatedDependency {
  current: string
  wanted: string
  latest: string
  location: string
}
