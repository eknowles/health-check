import { Context } from 'probot';

import getCommit from '../helpers/fetch-repo-commit';
import runLanguageFiles from '../runs/language-files';
import * as C from '../constants';

export default async (context: Context) => {
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

  // 1. First Create a Check Suite and mark as in_progress
  const createdCheck = await context.github.checks.create({
    ...baseParams,
    head_sha,
    status: C.CHECK_STATUS.QUEUED as any
  });

  try {
    // 2. Download the repository and checkout the commit.
    /**
     * This is currently how the project is setup, since this is testing the whole repository at the time of the commit
     * it's not optimised for performance, for example a project that totals 200mb and the commit diff compared with master
     * may only be 5-6 files, I could just download those changed files and compare them against master. This would reduce
     * time considerably.
     *
     * To do this there is the github repo get contents api.
     * https://developer.github.com/v3/repos/contents/#get-contents
     *
     * Alternatively instead of using git to clone/checkout, I could use the GitHub get archive link api and downland and unzip
     * https://developer.github.com/v3/repos/contents/#get-archive-link
     */
    const repoPath = await getCommit({
      repo,
      owner,
      sha: head_sha,
      token: process.env.GITHUB_ACCESS_TOKEN as string,
      id
    });

    // 3. Perform analysis on the files
    const annotations = await runLanguageFiles(repoPath); // <-- we're only analysing language files atm

    // 4. Update the Check Suite
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
        title: 'Something failed, sorry!',
        summary: e.message
      }
    });
  }
}
