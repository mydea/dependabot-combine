import chalk from 'chalk';
import { dependabotCombine } from './dependabot-combine.js';
import { Command } from 'commander';

async function run() {
  const program = new Command();

  program
    .usage('[options]')
    .option(
      '-n, --branch-name',
      'The name of the branch to use for the combined commits.',
      'dependabot-combine'
    )
    .option(
      '-p, --branch-pattern <value>',
      'The branch pattern to filter by.',
      '**/dependabot/**'
    )
    .option(
      '-d, --delete-branch-if-exists',
      'If set, the combined branch will be deleted if it exists.',
      false
    )
    .parse(process.argv);

  let { branchPattern, deleteBranchIfExists, branchName } = program.opts();

  await dependabotCombine({ branchPattern, deleteBranchIfExists, branchName });
}

export default async function () {
  try {
    await run();
  } catch (error) {
    // eslint-disable-next-line
    console.error(chalk.red(error));
  }
}
