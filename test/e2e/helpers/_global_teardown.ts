import fs from 'fs-extra'
import path from 'path'

/**
 * Run once after all tests execute
 */

export default async (): Promise<void> => {
  if (process.env.DEBUG !== 'true') {
    const badgeDir = path.join(__dirname, '../../../badge-results')
    const subdirs = await fs.readdir(badgeDir)
    for (const subdir of subdirs) {
      if (subdir.startsWith('.temp-e2e-test-')) {
        await fs.remove(path.join(badgeDir, subdir))
      }
    }
  }
}
