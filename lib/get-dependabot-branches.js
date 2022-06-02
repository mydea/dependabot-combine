import simpleGit from "simple-git";

export async function getDependabotBranches() {
  let options = {};

  let git = simpleGit(options);

  console.log("WHAT");

  let branches = await git.fetch();

  console.log(branches);

  return [];
}
