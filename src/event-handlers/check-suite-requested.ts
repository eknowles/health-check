import { Context } from 'probot';

import getCommit from '../helpers/get-commit';
import checkLanguageFiles from '../helpers/check-language-files';
import * as C from '../constants';

export default async (context: Context) => {
  context.log('New Event ' + context.name);
  const {id, payload: {repository, check_suite}} = context;

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
  const createdCheck = await context.github.checks.create({
    ...baseParams,
    head_sha,
    status: C.CHECK_STATUS.QUEUED as any
  });

  try {
    // 2. Fetch the commit
    const repoPath = await getCommit({
      repo,
      owner,
      sha: head_sha,
      token: process.env.GITHUB_ACCESS_TOKEN as string,
      id
    });

    // 3. Perform analysis on the files
    const annotations = await checkLanguageFiles(repoPath);

    // 4. Update the Check
    const issueCount = annotations.length;
    const conclusion: any = issueCount ? C.CHECK_CONCLUSION.FAILURE : C.CHECK_CONCLUSION.SUCCESS;
    const summary = issueCount ? `Looks like there are ${issueCount} issues to be resolved` : 'I hope we get to see this message';

    await context.github.checks.update({
      ...baseParams,
      check_run_id: createdCheck.data.id as string, // <-- this appears to be a number, @types are wrong here
      conclusion,
      completed_at: new Date().toISOString(),
      output: {
        title: `${C.CHECK_NAMES.LANG_JS} Results`,
        summary,
        annotations,
      }
    });

    // 5. Remove the tmp files

    // 6. Profit.
  } catch (e) {
    await context.github.checks.update({
      ...baseParams,
      check_run_id: createdCheck.data.id as string, // <-- this appears to be a number, @types are wrong here
      conclusion: C.CHECK_CONCLUSION.TIMED_OUT as any,
      completed_at: new Date().toISOString(),
      output: {
        title: 'Something failed with on the bot, sorry!',
        summary: e.message
      }
    });
  }
}
