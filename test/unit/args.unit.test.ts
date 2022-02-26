import path from 'path'

import Args from '../../src/args'
import COLOR from '../../src/colors'

describe('Args Unit Tests', () => {
  describe('get', () => {
    describe('invalid', () => {
      it('throws error if no required parameters specified', () => {
        const ogArgs = process.argv
        try {
          process.argv = []
          const exitSpy = jest.spyOn(process, 'exit').mockImplementation()
          const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
          Args.get()
          expect(exitSpy).toHaveBeenCalledWith(1)
          expect(consoleErrorSpy).toHaveBeenCalledTimes(3)
          expect(consoleErrorSpy).toHaveBeenLastCalledWith('Missing required arguments: repo, label, message, color')
        } finally {
          process.argv = ogArgs
        }
      })
      it('throws error if all required parameters specified except repo', () => {
        const ogArgs = process.argv
        try {
          process.argv = [
            path.join(__dirname, '../../node_modules/ts-node/dist/bin.js'),
            path.join(__dirname, '../../src/index.ts'),
            '--label="test-label"',
            '--message="test-message"',
            '--color="green"',
          ]
          const exitSpy = jest.spyOn(process, 'exit').mockImplementation()
          const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
          Args.get()
          expect(exitSpy).toHaveBeenCalledWith(1)
          expect(consoleErrorSpy).toHaveBeenCalledTimes(3)
          expect(consoleErrorSpy).toHaveBeenLastCalledWith('Missing required argument: repo')
        } finally {
          process.argv = ogArgs
        }
      })
      it('throws error if all required parameters specified except label', () => {
        const ogArgs = process.argv
        try {
          process.argv = [
            path.join(__dirname, '../../node_modules/ts-node/dist/bin.js'),
            path.join(__dirname, '../../src/index.ts'),
            '--repo="test-repo"',
            '--message="test-message"',
            '--color="green"',
          ]
          const exitSpy = jest.spyOn(process, 'exit').mockImplementation()
          const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
          Args.get()
          expect(exitSpy).toHaveBeenCalledWith(1)
          expect(consoleErrorSpy).toHaveBeenCalledTimes(3)
          expect(consoleErrorSpy).toHaveBeenLastCalledWith('Missing required argument: label')
        } finally {
          process.argv = ogArgs
        }
      })
      it('throws error if all required parameters specified except message', () => {
        const ogArgs = process.argv
        try {
          process.argv = [
            path.join(__dirname, '../../node_modules/ts-node/dist/bin.js'),
            path.join(__dirname, '../../src/index.ts'),
            '--repo="test-repo"',
            '--label="test-label"',
            '--color="green"',
          ]
          const exitSpy = jest.spyOn(process, 'exit').mockImplementation()
          const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
          Args.get()
          expect(exitSpy).toHaveBeenCalledWith(1)
          expect(consoleErrorSpy).toHaveBeenCalledTimes(3)
          expect(consoleErrorSpy).toHaveBeenLastCalledWith('Missing required argument: message')
        } finally {
          process.argv = ogArgs
        }
      })
      it('throws error if all required parameters specified except color', () => {
        const ogArgs = process.argv
        try {
          process.argv = [
            path.join(__dirname, '../../node_modules/ts-node/dist/bin.js'),
            path.join(__dirname, '../../src/index.ts'),
            '--repo="test-repo"',
            '--label="test-label"',
            '--message="test-message"',
          ]
          const exitSpy = jest.spyOn(process, 'exit').mockImplementation()
          const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
          Args.get()
          expect(exitSpy).toHaveBeenCalledWith(1)
          expect(consoleErrorSpy).toHaveBeenCalledTimes(3)
          expect(consoleErrorSpy).toHaveBeenLastCalledWith('Missing required argument: color')
        } finally {
          process.argv = ogArgs
        }
      })
    })
    describe('valid', () => {
      it('returns arguments without branch specified', () => {
        const ogArgs = process.argv
        try {
          const repo = 'test-repo'
          const label = 'test-label'
          const message = 'test message'
          const color = COLOR.Green
          process.argv = [
            path.join(__dirname, '../../node_modules/ts-node/dist/bin.js'),
            path.join(__dirname, '../../src/index.ts'),
            `--repo="${repo}"`,
            `--label="${label}"`,
            `--message="${message}"`,
            `--color="${color}"`,
          ]
          const exitSpy = jest.spyOn(process, 'exit').mockImplementation()
          const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
          expect(Args.get()).toEqual({
            repo,
            branch: 'main',
            label,
            message,
            color,
          })
          expect(exitSpy).not.toHaveBeenCalled()
          expect(consoleErrorSpy).not.toHaveBeenCalled()
        } finally {
          process.argv = ogArgs
        }
      })
      it('returns arguments with branch specified', () => {
        const ogArgs = process.argv
        try {
          const repo = 'test-repo'
          const branch = 'test-branch'
          const label = 'test-label'
          const message = 'test message'
          const color = COLOR.Green
          process.argv = [
            path.join(__dirname, '../../node_modules/ts-node/dist/bin.js'),
            path.join(__dirname, '../../src/index.ts'),
            `--repo="${repo}"`,
            `--branch="${branch}"`,
            `--label="${label}"`,
            `--message="${message}"`,
            `--color="${color}"`,
          ]
          const exitSpy = jest.spyOn(process, 'exit').mockImplementation()
          const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
          expect(Args.get()).toEqual({
            repo,
            branch,
            label,
            message,
            color,
          })
          expect(exitSpy).not.toHaveBeenCalled()
          expect(consoleErrorSpy).not.toHaveBeenCalled()
        } finally {
          process.argv = ogArgs
        }
      })
    })
  })
})
