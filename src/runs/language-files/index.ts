import { ChecksUpdateParamsOutputAnnotations } from '@octokit/rest';
import { IFile } from '../../helpers/fetch-pull-files';

import finder from './finders';

async function findIssuesInFilePath({filename, content}: IFile): Promise<ChecksUpdateParamsOutputAnnotations[]> {
  if (!filename.includes('/lang.js')) return [];
  return finder(content, filename);
}

export default (files: IFile[]): Promise<ChecksUpdateParamsOutputAnnotations[]> => {
  return new Promise((resolve) => {
    Promise
      .all(files.map((file) => findIssuesInFilePath(file)))
      .then((issues) => {
        const annotations = issues
          .reduce((acc, curr) => [...acc, ...curr], [])
          .filter((a: any) => a);

        resolve(annotations);
      });
  });
}
