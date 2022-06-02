import chalk from 'chalk';
import yarnUpdateDependency from 'yarn-update-dependency/lib/update-dependency.js';

export async function updateYarnDependency({ version, packageName }) {
  // eslint-disable-next-line
  console.log(
    `Updating yarn dependency ${chalk.bold(packageName)} to ${chalk.bold(
      version
    )}`
  );

  await yarnUpdateDependency({
    version,
    package: packageName,
    yarn: true,
    silent: true,
  });
}
