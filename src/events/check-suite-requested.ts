import { Context } from 'probot';

import getFiles from '../helpers/fetch-pull-files';
import runLanguageFiles from '../runs/language-files';
import * as C from '../constants';

export default async (context: Context): Promise<void> => {
  const {id, payload: {repository, check_suite}} = context;

  // Setup base vars
  const started_at = new Date().toISOString();
  const owner = repository.owner.login;
  const repo = repository.name;
  const name = C.CHECK_NAMES.LANG_JS;
  const head_sha = check_suite.head_commit.id;
  const details_url = process.env.CHECK_DETAILS_URL_LANG;
  const pull = context.payload.check_suite.pull_requests[0];
  const {number} = pull;

  // fetch the list of files changed in this PR
  const pullFileResponse = await context.github.pullRequests.getFiles({owner, repo, number, per_page: 500, page: 1});

  // Standard params that all check api requests will use
  const baseParams = {owner, repo, name, details_url, started_at, external_id: id};

  // 1. First Create a Check run and mark as in_progress
  const createdCheck = await context.github.checks.create({
    ...baseParams,
    head_sha,
    status: C.CHECK_STATUS.IN_PROGRESS as any
  });

  try {
    const downloadFiles = await getFiles(context, pullFileResponse.data);

    // 3. Perform analysis on the files
    let annotations = await runLanguageFiles(downloadFiles);

    // 4. Update the Check Suite
    const issueCount = annotations.length;
    const conclusion: any = issueCount ? C.CHECK_CONCLUSION.FAILURE : C.CHECK_CONCLUSION.SUCCESS;
    const summary = issueCount ? `${issueCount} issues to be resolved` : 'No Problems found';

    const params = {
      ...baseParams,
      check_run_id: createdCheck.data.id as any,
      conclusion,
      completed_at: new Date().toISOString(),
      output: {
        title: summary,
        summary,
        annotations,
      }
    };

    if (issueCount > 50) {
      params.output.annotations = annotations.slice(0, 50);
    }

    await context.github.checks.update(params);

    // 6. Profit.
    // const checkUrl = `https://github.com/${owner}/${repo}/pull/${number}/checks?check_run_id=${createdCheck.data.id}`;

  } catch (e) {
    await context.github.checks.update({
      ...baseParams,
      check_run_id: createdCheck.data.id as any,
      conclusion: C.CHECK_CONCLUSION.TIMED_OUT as any,
      completed_at: new Date().toISOString(),
      output: {
        title: 'Something failed, sorry!',
        summary: 'At some point during the analysis a promise was rejected or threw an error',
        text: e.message,
        images: [
          {
            alt: 'sad',
            image_url: 'https://media.giphy.com/media/Ki9ZNTNS7aC9q/giphy.gif'
            // image_url: 'https://media.giphy.com/media/Ty9Sg8oHghPWg/giphy.gif'
          }
        ]
      }
    });
  }
}
