import COLOR from '../../src/colors'
import Args from '../../src/args'
import BadgeResult from '../../src/badge-result'

describe('Index Unit Tests', () => {
  it('calls setBadgeResult', async () => {
    jest.spyOn(Args, 'get').mockReturnValue({
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
    expect(setBadgeResultsSpy).toHaveBeenCalled()
    expect(exitSpy.mock.calls).toEqual([])
  })
})
