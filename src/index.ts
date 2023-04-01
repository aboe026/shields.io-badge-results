import Args from './args'
import BadgeResult from './badge-result'

//
;(async () => {
  try {
    await BadgeResult.set(await Args.get())
  } catch (err: unknown) {
    console.error(err)
    process.exit(1)
  }
})()
