import { Context } from 'probot';
import { ChecksCreateParams } from '@octokit/rest';

import * as C from '../constants';

export default async (context: Context) => {
  const started_at = new Date().toISOString();
  const owner = context.payload.repository.owner.login;
  const repo = context.payload.repository.name;
  const name = C.CHECK_NAMES.LANG_JS;
  const head_sha = context.payload.check_suite.head_commit.id;
  const status = C.CHECK_STATUS.COMPLETED as any;
  const conclusion = C.CHECK_CONCLUSION.NEUTRAL as any;
  const details_url = process.env.CHECK_DETAILS_URL_LANG;

  console.log(JSON.stringify(context));

  const params: ChecksCreateParams = {
    owner,
    repo,
    name,
    head_sha,
    details_url,
    status,
    conclusion,
    started_at,
    completed_at: new Date().toISOString(),
  };

  const result = await context.github.checks.create(params);

  context.log(result);
}
