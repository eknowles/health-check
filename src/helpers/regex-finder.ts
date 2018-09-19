import { ChecksUpdateParamsOutputAnnotations } from '@octokit/rest';

export interface IRegexFinderOptions {
  content: string;
  path: string;
  title: string;
  message: string;
  level: string;
  pattern: string;
}

export default (options: IRegexFinderOptions): ChecksUpdateParamsOutputAnnotations[] => {
  const {
    content,
    path,
    title,
    message,
    level,
    pattern,
  } = options;

  let matches;
  let issues = [];

  const regexIssueMethod = new RegExp(pattern, 'gi');

  while ((matches = regexIssueMethod.exec(content)) !== null) {
    const topToMatch = matches.input.substring(0, matches.index);
    const line = topToMatch.split(/\r\n|\r|\n/).length;
    const column = topToMatch.match(/([^\n].*)$/)![0].length + 1;

    const issue: ChecksUpdateParamsOutputAnnotations = {
      title,
      message,
      annotation_level: level as any,
      path,
      start_line: line + '' as any,
      end_line: line + '' as any,
      start_column: column + '' as any,
      end_column: column + '' as any
    };

    issues.push(issue);
  }

  return issues;
}
