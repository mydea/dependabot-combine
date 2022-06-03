import minimatch from 'minimatch';

export async function getDependabotBranches(git, { branchPattern }) {
  await git.fetch({ '--prune': true });
  let branchResponse = await git.branch({ '--r': true });

  return branchResponse.all.filter((branchName) => {
    return minimatch(branchName, branchPattern);
  });
}
