import fs from 'fs-extra'
import path from 'path'

import COLOR from '../../src/colors'
import execa from './helpers/execute-async'

describe('Set Badge Result E2E Tests', () => {
  describe('invalid', () => {
    it('throws error if missing all parameters', async () => {
      await expect(runSetBadge('')).rejects.toThrow(/Missing required arguments: repo, label, message, color/)
    })
    it('throws error if missing required parameters except repo', async () => {
      await expect(runSetBadge('--repo="test"')).rejects.toThrow(/Missing required arguments: label, message, color/)
    })
    it('throws error if missing required parameters except label', async () => {
      await expect(runSetBadge('--label="test"')).rejects.toThrow(/Missing required arguments: repo, message, color/)
    })
    it('throws error if missing required parameters except message', async () => {
      await expect(runSetBadge('--message="test"')).rejects.toThrow(/Missing required arguments: repo, label, color/)
    })
    it('throws error if missing required parameters except color', async () => {
      await expect(runSetBadge('--color="test"')).rejects.toThrow(/Missing required arguments: repo, label, message/)
    })
  })
  describe('valid', () => {
    it('creates new badge for new repo', async () => {
      await testSetBadge({
        label: 'onlybadge',
        message: 'set badge result for repo that does not yet exist',
        color: COLOR.BrightGreen,
      })
    })
    it('creates new badge for existing repo', async () => {
      const repo = await testSetBadge({
        label: 'first-badge',
        message: 'first badge to create repo',
        color: COLOR.Blue,
      })
      await testSetBadge({
        repo,
        label: 'second-badge',
        message: 'second badge to add to existing repo',
        color: COLOR.LightGrey,
      })
    })
    it('overwrites existing repo file', async () => {
      const label = 'badge to be overwritten'
      const repo = await testSetBadge({
        label,
        message: 'original message to be overwritten',
        color: COLOR.Red,
      })
      await testSetBadge({
        repo,
        label,
        message: 'new message',
        color: COLOR.Yellow,
      })
    })
    it('specify branch that is not main', async () => {
      await testSetBadge({
        branch: '1.0.0',
        label: 'non-main-branch',
        message: 'overriding the default main branch name',
        color: COLOR.Orange,
      })
    })
    it('no branch specified defaults to main', async () => {
      const repo = getDynamicRepoName()
      const label = 'no-branch-specified'
      const message = 'defaults branch name to main if not specified'
      const color = COLOR.YellowGreen
      await runSetBadge(`--repo="${repo}" --label="${label}" --message="${message}" --color="${color}"`)
      await validateBadgeResult({
        repo,
        branch: 'main',
        label,
        message,
        color,
      })
    })
  })
})

async function runSetBadge(flags: string): Promise<unknown> {
  return execa({
    command: `npm start -- ${flags}`,
    options: {
      cwd: path.join(__dirname, '../../'),
    },
  })
}

function getDynamicRepoName(): string {
  return `.temp-e2e-test-${Date.now()}`
}

async function testSetBadge({
  repo,
  branch = 'main',
  label,
  message,
  color,
  validate = true,
}: {
  repo?: string
  branch?: string
  label: string
  message: string
  color: COLOR
  validate?: boolean
}): Promise<string> {
  if (!repo) {
    repo = getDynamicRepoName()
  }
  await runSetBadge(
    `--repo="${repo}" --branch="${branch}" --label="${label}" --message="${message}" --color="${color}"`
  )
  if (validate) {
    await validateBadgeResult({
      repo,
      branch,
      label,
      message,
      color,
    })
  }
  return repo
}

async function validateBadgeResult({
  repo,
  branch = 'main',
  label,
  message,
  color,
}: {
  repo: string
  branch?: string
  label: string
  message: string
  color: COLOR
}) {
  const directory = path.join(__dirname, '../../badge-results/', repo, branch)
  const file = path.join(directory, `${label.toLowerCase()}.json`)
  await expect(fs.pathExists(directory))
  await expect(fs.access(file)).resolves.toEqual(undefined)
  const json = await fs.readJSON(file)
  expect(json).toStrictEqual({
    schemaVersion: 1,
    label,
    message,
    color,
  })
}
