import fs from 'fs';
import path from 'path';

export function parseType(branchName) {
  if (branchName.includes('/npm_and_yarn/')) {
    let yarnPath = path.join(process.cwd(), 'yarn.lock');

    if (fs.existsSync(yarnPath)) {
      return 'YARN';
    }

    return 'NPM';
  }

  return undefined;
}

export function parseMessage(message) {
  let regex = /bump (\S*) from (\S*) to (\S*)$/;

  let matches = message.match(regex);

  if (matches) {
    let packageName = matches[1];
    let version = matches[3];

    return { packageName, version };
  }
}
