import COLOR from '../../src/colors'
import Args from '../../src/args'
import BadgeResult from '../../src/badge-result'

describe('Index Unit Tests', () => {
  it('calls setBadgeResult', async () => {
    jest.spyOn(Args, 'get').mockResolvedValue({
      repo: 'test-call-repo',
      branch: 'test-call-branch',
      label: 'test-call-label',
      message: 'test-call-message',
      color: COLOR.Green,
    })
    const setBadgeResultsSpy = jest.spyOn(BadgeResult, 'set').mockResolvedValue()
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation()
    await jest.isolateModules(async () => {
      await import('../../src/index')
    })
    await new Promise((resolve) => setTimeout(resolve, 0)) // need explicit sleep here because isolateModules does not properly await :/
    expect(setBadgeResultsSpy).toHaveBeenCalled()
    expect(exitSpy.mock.calls).toEqual([])
  })
})
