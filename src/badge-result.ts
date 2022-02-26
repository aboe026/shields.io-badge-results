import fs from 'fs-extra'
import path from 'path'

import { BadgeArguments } from './args'

export default class BadgeResult {
  static async set(args: BadgeArguments): Promise<void> {
    const repoDir = path.join(__dirname, '../badge-results', args.repo, args.branch)
    await fs.ensureDir(repoDir)
    await fs.writeFile(
      path.join(repoDir, `${args.label.toLowerCase()}.json`),
      `${JSON.stringify(
        {
          schemaVersion: 1,
          label: args.label,
          message: args.message,
          color: args.color,
        },
        null,
        2
      )}\n`
    )
  }
}
