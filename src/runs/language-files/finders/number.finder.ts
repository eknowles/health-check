import { ChecksUpdateParamsOutputAnnotations } from '@octokit/rest';

import regexFinder from '../../../helpers/regex-finder';
import meta from './meta';

export default (data: string, filePath: string): ChecksUpdateParamsOutputAnnotations[] => {
  return regexFinder({
    content: data,
    path: filePath,
    ...meta.numbers,
  });
}
