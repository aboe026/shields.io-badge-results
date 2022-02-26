import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'

import COLOR from './colors'

export type BadgeArguments = {
  repo: string
  branch: string
  label: string
  message: string
  color: COLOR
}

export default class Args {
  static get(): BadgeArguments {
    const args = yargs(hideBin(process.argv))
      .options({
        repo: {
          alias: 'r',
          type: 'string',
          description: 'Repository the results are for.',
          demandOption: true,
        },
        branch: {
          alias: 'b',
          type: 'string',
          description: 'Branch of the repo the results are for.',
          demandOption: false,
          default: 'main',
        },
        label: {
          alias: 'l',
          type: 'string',
          description: 'Label the badge should have.',
          demandOption: true,
        },
        message: {
          alias: 'm',
          type: 'string',
          description: 'Message the badge should have.',
          demandOption: true,
        },
        color: {
          alias: 'c',
          type: 'string',
          description: 'Color the badge should have.',
          choices: Object.values(COLOR),
          demandOption: true,
        },
      })
      .parse()

    return {
      repo: args.repo,
      branch: args.branch,
      label: args.label,
      message: args.message,
      color: args.color as COLOR,
    }
  }
}
