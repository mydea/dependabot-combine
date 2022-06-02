import chalk from "chalk";
import { getDependabotBranches } from "./get-dependabot-branches.js";

export default async function run() {
  try {
    let branches = await getDependabotBranches();
    console.log(branches);
  } catch (error) {
    console.error(chalk.red(error));
  }
}
