import fs from 'fs-extra'
import path from 'path'

import COLOR from '../../src/colors'
import Args from '../../src/args'
import BadgeResult from '../../src/badge-result'

describe('Badge Result Unit Tests', () => {
  describe('set', () => {
    it('converts uppercase to lowercase in badge file name', async () => {
      const repo = 'test-case-repo'
      const branch = 'test-case-branch'
      const label = 'Test-Case-Label'
      const message = 'test case message'
      const color = COLOR.Green
      jest.spyOn(Args, 'get').mockReturnValue({
        repo,
        branch,
        label,
        message,
        color,
      })
      jest.spyOn(fs, 'ensureDir').mockImplementation(() => Promise.resolve())
      const writeFileSpy = jest.spyOn(fs, 'writeFile').mockImplementation(() => Promise.resolve())
      await BadgeResult.set(Args.get())
      expect(writeFileSpy.mock.calls).toEqual([
        [
          path.join(__dirname, '../../badge-results', repo, branch, 'test-case-label.json'),
          `${JSON.stringify(
            {
              schemaVersion: 1,
              label,
              message,
              color,
            },
            null,
            2
          )}\n`,
        ],
      ])
    })
  })
})
