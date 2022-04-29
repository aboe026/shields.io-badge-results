# shields.io-badge-results

![build](https://img.shields.io/endpoint?url=https://aboe026.github.io/shields.io-badge-results/badge-results/shields.io-badge-results/main/build.json)
![coverage](https://img.shields.io/endpoint?url=https://aboe026.github.io/shields.io-badge-results/badge-results/shields.io-badge-results/main/coverage.json)

Repository for [shields.io](https://shields.io/) badge results from private CI builds.

The [badge-results](badge-results) directory contains [JSON endpoint](https://shields.io/endpoint) files to be referenced by GitHub repositories for their shields.io badge definitions.

## Requirements

- [NodeJS](https://nodejs.org/)

## Install

To install [npm](https://www.npmjs.com/) dependencies, run

```sh
npm install
```

## Execute

To set the badge results for a repo, run

```sh
npm start -- --repo="<repo_name>" --branch="<branch_name>" --label="<label_name>" --message="<message_text>" --color="<color_value>"
```

Where the flags correspond to:
| Name | Required | Default | Description | Example(s) |
| ---- | -------- | ------- | ----------- | ---------- |
| repo | yes | | The name of a GitHub repository. | `data-structures` |
| branch | yes | `main` | The branch name for the GitHub repository that the results are for. | `master`, `1.0.0` |
| label | yes | | The name that the shields.io badge should have. | `build`, `coverage` |
| message | yes | | The value that the shields.io badge should have. | `passing`, `100%` |
| color | yes | | The color that the badge should have. Allowed values are `brightgreen`, `green`, `yellowgreen`, `yellow`, `orange`, `red`, `blue`, `lightgrey`. | `green`, `blue` |

## Validation

To validate badge result entries (making sure they adhere to the structure of the repository and [shields.io endpoint](https://shields.io/endpoint) specification) run

```sh
npm run validate:results
```

## Lint

To lint code for programmatic and stylistic error detection, run

```sh
npm run lint
```

_Note_: To attempt fixing errors automatically, run

```sh
npm run lint:fix
```

## Tests

To test the project for regressions, run

```sh
npm test
```

This will [lint](#lint) the project, then run [unit](#unit-tests) and [e2e](#end-to-end-tests) tests

### Unit Tests

Unit tests are for stateless logic tests on small, contained parts of the code base (ideally not reliant on/mock anything outside their scope), and can be run with

```sh
npm run test:unit
```

_Note_: To run a specific test, execute

```sh
npm run test:unit -- -t 'test name'
```

With spaces separating describe blocks and test names

### End to End Tests

End to End (E2E) Tests run against the target node script (`start`) and are meant to test the path other repos will use to update their badge results, simulating as close as possible the real interactions and use/edge cases, and can be run with

```sh
npm run test:e2e
```

_Note_: To run a specific test, execute

```sh
npm run test:e2e -- -t 'test name'
```

With spaces separating describe blocks and test names

### Code Coverage

By default, code coverage will be generated for unit tests in the `coverage/unit` directory.

There is no code coverage for [e2e](#end-to-end-tests) tests as those do not run against source code, but through the npm scripts for the repository.

To view code coverage in the browser, run

```sh
npm run coverage:view
```
