import rimraf from 'rimraf'
import path from 'path'

/**
 * Run once after all tests execute
 */

export default async (): Promise<void> => {
  if (process.env.DEBUG !== 'true') {
    await removeTempResults()
  }
}

async function removeTempResults(): Promise<void> {
  await new Promise((resolve, reject) => {
    rimraf(path.join(__dirname, '../../../badge-results/.temp-e2e-test-*'), (error) => {
      if (error) {
        reject(error)
      } else {
        resolve(true)
      }
    })
  })
}
