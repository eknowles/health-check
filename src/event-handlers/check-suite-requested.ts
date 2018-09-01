import { Context } from 'probot';
import { ChecksCreateParams } from '@octokit/rest';

import getCommit from '../helpers/get-commit';

import * as C from '../constants';

export default async (context: Context) => {
  const started_at = new Date().toISOString();
  const owner = context.payload.repository.owner.login;
  const repo = context.payload.repository.name;
  const name = C.CHECK_NAMES.LANG_JS;
  const head_sha = context.payload.check_suite.head_commit.id;
  const status = C.CHECK_STATUS.QUEUED as any;
  // const conclusion = C.CHECK_CONCLUSION.NEUTRAL as any;
  const details_url = process.env.CHECK_DETAILS_URL_LANG;

  // console.log(JSON.stringify(context));
  getCommit({repo, owner, sha: head_sha, token: process.env.GITHUB_ACCESS_TOKEN as string});

  const params: ChecksCreateParams = {
    owner,
    repo,
    name,
    head_sha,
    details_url,
    status,
    // conclusion,
    started_at,
    // completed_at: new Date().toISOString(),
  };

  const result = await context.github.checks.create(params);

  context.log(result);
}
