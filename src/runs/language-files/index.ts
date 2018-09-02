import { ChecksUpdateParamsOutputAnnotations } from '@octokit/rest';
import glob from 'glob';

import getFileContents from '../../helpers/get-file-contents';
import finder from './finders';

async function findIssuesInFilePath(filePath: string): Promise<ChecksUpdateParamsOutputAnnotations[]> {
  const data = await getFileContents(filePath);

  return finder(data, filePath);
}

export default (repoPath: string): Promise<ChecksUpdateParamsOutputAnnotations[]> => {
  return new Promise((resolve) => {
    glob(`${repoPath}/**/lang.js`, {realpath: true}, (er, files) => {
      Promise
        .all(files.map((file) => findIssuesInFilePath(file)))
        .then((issues) => {

          const annotations = issues
            .reduce((acc, curr) => [...acc, ...curr], [])
            .filter((a: any) => a)
            .map((issue: any) => ({...issue, path: issue.path.replace(`${repoPath}/`, '')}));

          resolve(annotations);
        });
    });
  });
}
