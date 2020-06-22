const { readFileSync } = require('fs');
const chalk = require('chalk');

const msgPath = process.env.GIT_PARAMS;
const msg = readFileSync(msgPath, 'utf-8').trim();

const commitRegex = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|wip|release)(\(.+\))?: .{1,50}/;

if (!commitRegex.test(msg)) {
  console.log();
  console.error(
    `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red('invalid commit message format.')}\n\n` +
      chalk.red('  Proper commit message format is required for automated changelog generation. Examples:\n\n') +
      `    ${chalk.green('feat(search): add algolia search option')}\n` +
      `    ${chalk.green('fix(model): handle pagination correctly (close #28)')}\n\n` +
      chalk.red('  See .github/commit-convention.md for more details.\n'),
  );
  process.exit(1);
}
