import fs from 'fs-extra'
import path from 'path'
;(async () => {
  const resultsDir = path.join(__dirname, '../badge-results')
  if (!(await fs.pathExists(resultsDir))) {
    throw Error(`Results directory "${resultsDir}" does not exist.`)
  }
  const repos = await fs.readdir(resultsDir)
  for (const repo of repos) {
    const repoDir = path.join(resultsDir, repo)
    const stat = await fs.lstat(repoDir)
    if (!stat.isDirectory()) {
      throw Error(
        `Invalid file "${repo}" within results directory "${resultsDir}": Must only contain directories with repository names.`
      )
    }
    const branches = await fs.readdir(repoDir)
    for (const branch of branches) {
      const branchDir = path.join(resultsDir, repo, branch)
      const stat = await fs.lstat(branchDir)
      if (!stat.isDirectory()) {
        throw Error(
          `Invalid file "${branch}" within repository directory "${repoDir}": Must only contain directories with branch names.`
        )
      }
      const badges = await fs.readdir(branchDir)
      for (const badge of badges) {
        const badgePath = path.join(resultsDir, repo, branch, badge)
        const stat = await fs.lstat(badgePath)
        if (!stat.isFile()) {
          throw Error(
            `Invalid file "${badge}" within branch directory "${branchDir}": Must only contain files with badge results.`
          )
        }
        const extension = path.extname(badgePath)
        if (extension !== '.json') {
          throw Error(
            `Invalid extension "${extension}" for file "${badge}" within branch directory "${branchDir}": Must only contain JSON files with ".json" extensions.`
          )
        }
        const contents = await fs.readFile(badgePath, {
          encoding: 'utf-8',
        })
        let badgeJson
        try {
          badgeJson = JSON.parse(contents)
        } catch (err) {
          throw Error(`Invalid JSON in file "${badgePath}": ${err}.`)
        }
        if (Array.isArray(badgeJson)) {
          throw Error(`Invalid JSON in file "${badgePath}": Must be JSON object, found JSON array.`)
        }
        if (!Object.keys(badgeJson).includes('schemaVersion')) {
          throw Error(`Invalid badge JSON in file "${badgePath}": Must have key "schemaVersion".`)
        }
        if (!Object.keys(badgeJson).includes('label')) {
          throw Error(`Invalid badge JSON in file "${badgePath}": Must have key "label".`)
        }
        if (!Object.keys(badgeJson).includes('message')) {
          throw Error(`Invalid badge JSON in file "${badgePath}": Must have key "message".`)
        }
        if (!Object.keys(badgeJson).includes('color')) {
          throw Error(`Invalid badge JSON in file "${badgePath}": Must have key "color".`)
        }
        const expectedKeys = ['schemaVersion', 'label', 'message', 'color']
        const extraKeys = Object.keys(badgeJson).filter((key) => !expectedKeys.includes(key))
        if (extraKeys.length > 0) {
          throw Error(
            `Invalid badge JSON in file "${badgePath}": Keys ${JSON.stringify(extraKeys)} not valid badge elements.`
          )
        }
      }
    }
  }
  console.log('All results valid :)')
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
