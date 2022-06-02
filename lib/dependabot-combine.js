import chalk from 'chalk';
import simpleGit from 'simple-git';
import { getDependabotBranches } from './get-dependabot-branches.js';
import { parseMessage, parseType } from './parse-dependabot-commit.js';
import { updateNpmDependency } from './update-npm.js';
import { updateYarnDependency } from './update-yarn.js';

const BRANCH_NAME = 'dependabot-combine';

export async function dependabotCombine({
  branchPattern,
  deleteBranchIfExists = false,
}) {
  let options = {};
  let git = simpleGit(options);

  let status = await git.status();

  if (!status.isClean()) {
    throw new Error('The working directory is not clean, aborting...');
  }

  let currentBranch = status.current;

  try {
    let branches = await getDependabotBranches(git, {
      branchPattern,
    });

    if (branches.length === 0) {
      log('No dependabot branches found!');
      return;
    }

    await setupTempBranch(git, { deleteBranchIfExists });

    log(
      `Found ${branches.length} dependabot branches, picking them one by one...`
    );

    await mergeBranches(git, branches);
  } finally {
    await cleanup(git, currentBranch);
  }
}

async function cleanup(git, currentBranch) {
  git.checkout(currentBranch);
}

async function setupTempBranch(git, { deleteBranchIfExists }) {
  if (deleteBranchIfExists) {
    try {
      await git.deleteLocalBranch(BRANCH_NAME, true);
    } catch (error) {
      // ignore..
    }
  }

  try {
    await git.checkoutLocalBranch(BRANCH_NAME);
  } catch (error) {
    if (
      error.message.includes(`A branch named '${BRANCH_NAME}' already exists`)
    ) {
      throw new Error(
        `There is already a branch named ${BRANCH_NAME}. Please delete it, and try again.`
      );
    }

    throw error;
  }
}

async function mergeBranches(git, branches) {
  for (let branch of branches) {
    let branchLog = await git.log(['-n 1', branch]);

    let { message, body } = branchLog.latest;

    await updateDependency(git, { branch, message, body });
  }
}

async function updateDependency(git, { branch, message, body }) {
  let parsed = parseMessage(message);
  let packageType = parseType(branch);

  if (!packageType) {
    log(
      chalk.yellow(`Package type of ${branch} is not supported, skipping it...`)
    );
  }

  if (!parsed) {
    log(chalk.orange(`Could not parse ${branch}`));
    return;
  }

  let { version, packageName } = parsed;

  if (packageType === 'YARN') {
    await updateYarnDependency({
      version,
      packageName,
    });

    await git.add(['package.json', 'yarn.lock']);
  }

  if (packageType === 'NPM') {
    await updateNpmDependency({ version, packageName });

    await git.add(['package.json', 'package-lock.json']);
  }

  await createCommit(git, { message, body });
}

async function createCommit(git, { message, body }) {
  await git.commit(`${message}

${body}`);
}

function log(message) {
  // eslint-disable-next-line
  console.log(message);
}
