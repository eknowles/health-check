import { PullRequestsGetFilesResponse } from '@octokit/rest';
import { Context } from 'probot';

export interface IFile {
  content: string;
  filename: string;
}

export default function(
  {payload: {repository}, github}: Context,
  files: PullRequestsGetFilesResponse
): Promise<IFile[]> {
  const owner = repository.owner.login;
  const repo = repository.name;

  const filePromises = files
    .filter((file) => file.status !== 'removed')
    .map(async ({sha, filename}) => {
      const {data: {content, encoding}} = await github.gitdata.getBlob({owner, repo, file_sha: sha});

      return {
        filename,
        content: encoding === 'base64' ? Buffer.from(content, 'base64').toString('utf8') : content
      };
    });

  return Promise.all(filePromises);
}
