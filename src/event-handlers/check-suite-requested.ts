import { Context } from 'probot';

import getCommit from '../helpers/get-commit';
import checkLanguageFiles from './check-language-files';
import * as C from '../constants';

export default async (context: Context) => {
  context.log('New Event ' + context.name);
  const {id, payload: { repository, check_suite} } = context;

  // Setup base vars
  const started_at = new Date().toISOString();
  const owner = repository.owner.login;
  const repo = repository.name;
  const name = C.CHECK_NAMES.LANG_JS;
  const head_sha = check_suite.head_commit.id;
  const details_url = process.env.CHECK_DETAILS_URL_LANG;

  // Standard params that all check api requests will use
  const baseParams = {owner, repo, name, details_url, started_at, external_id: id};

  // 1. First Create a Check and mark as in_progress
  const createdCheck = await context.github.checks.create({...baseParams, head_sha, status: C.CHECK_STATUS.QUEUED as any});

  try {
    // 2. Fetch the commit
    const repoPath = await getCommit({repo, owner, sha: head_sha, token: process.env.GITHUB_ACCESS_TOKEN as string, id});

    console.log(repoPath);

    // 3. Perform analysis on the files
    const errors = await checkLanguageFiles(repoPath);
    console.log(JSON.stringify(errors));

    // 4. Update the Check

    // 5. Remove the tmp files

    // 6. Profit.
  } catch (e) {
    console.error('woops');
    console.error(e);
    await context.github.checks.update({
      ...baseParams,
      check_run_id: createdCheck.data.id as string, // <-- this appears to be a number, @types are wrong here
      conclusion: C.CHECK_CONCLUSION.CANCELLED as any,
      completed_at: new Date().toISOString(),
      output: {
        title: 'woops',
        summary: 'something went wrong'
      }
    });
  }
}
