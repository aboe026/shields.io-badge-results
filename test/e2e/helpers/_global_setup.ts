import fs from 'fs-extra'

import E2eConfig from './e2e-config'

/**
 * Run once before all tests execute
 */

export default async (): Promise<void> => {
  if (await fs.pathExists(E2eConfig.DIRECTORY.Temp)) {
    await fs.remove(E2eConfig.DIRECTORY.Temp)
  }
  await fs.ensureDir(E2eConfig.DIRECTORY.Temp)

  try {
    await fs.access(E2eConfig.FILE.Debug)
    await fs.remove(E2eConfig.FILE.Debug)
  } catch (err) {
    // debug file does not exist, no need to delete
  }
  await fs.createFile(E2eConfig.FILE.Debug)
}
