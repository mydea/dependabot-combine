import util from 'util';
import childProcess from 'child_process';
import chalk from 'chalk';

const exec = util.promisify(childProcess.exec);

export async function updateNpmDependency({ version, packageName }) {
  // eslint-disable-next-line
  console.log(
    `Updating npm dependency ${chalk.bold(packageName)} to ${chalk.bold(
      version
    )}`
  );

  await exec(`npm install ${packageName}@${version}`);
}
