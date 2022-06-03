# dependabot-combine

A utility to automatically combine dependabot PRs into a single branch.

## Supported package managers

Currently, yarn & npm are supported, and will be auto-detected.
Dependabot branches for other package managers will be ignored.

## Usage

```
npx dependabot-combine
```

To see all available options:

```
npx dependabot-combine --help
```

### Options:

- `--branch-name`: The name of the branch to create, where the dependabot PRs will be combined
- `--branch-pattern`: The glob pattern to filter branches by. Default: `**/dependabot/**`
- `--delete-branch-if-exists` (or `-d`): If set, the `--branch-name` branch will be deleted if it exists

## How it works

Note that this will not actually combine the commits of the dependabot PRs themselves.
The reason for this is that you'll often get merge conflicts when combining many PRs, which can be quite tiresome.

Instead, this utility will try to determine the package name & version from the commit message, and update it itself via `yarn` or `npm`.
It will the use the nice commit message & body from the dependabot PR, including the changelog etc, and make a new commit.

Note that this means that certain special cases like e.g. PRs that update multiple packages at once will be skipped for now.