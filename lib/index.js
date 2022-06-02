import chalk from 'chalk';
import { dependabotCombine } from './dependabot-combine.js';
import program from 'commander';
import { version as packageVersion } from './../package.json';

async function run() {
  program
    .version(packageVersion, '--version')
    .usage('[options]')
    .option(
      '-b, --branch-pattern <value>',
      'The branch pattern to filter by.',
      '**/dependabot/**'
    )
    .option(
      '-d, --delete-branch-if-exists',
      'If set, the combined branch will be deleted if it exists.',
      false
    )
    .parse(process.argv);

  let { branchPattern, deleteBranchIfExists } = program.opts();

  // eslint-disable-next-line
  console.log({ branchPattern, deleteBranchIfExists });

  await dependabotCombine({ branchPattern, deleteBranchIfExists });
}

export default async function () {
  try {
    await run();
  } catch (error) {
    // eslint-disable-next-line
    console.error(chalk.red(error));
  }
}
