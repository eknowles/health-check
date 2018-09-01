import fs from 'fs';
import glob from 'glob';
// import async from 'async'; // <-- need to limit the io with something like this

// import { ChecksUpdateParamsOutputAnnotations } from '@octokit/rest';

type IssueTypes = 'booleanName' | 'functionName' | 'arrayName'

const ISSUE_TYPES: { [name: string]: IssueTypes } = {
  BOOLEANS: 'booleanName',
  FUNCTIONS: 'functionName',
  ARRAYS: 'arrayName'
};

// @ts-ignore
const ISSUE_HELP: { IssueTypes: string } = {
  [ISSUE_TYPES.BOOLEANS]: 'Remove config from translations',
  [ISSUE_TYPES.FUNCTIONS]: 'Switch to ICU message format (see https://formatjs.io/guides/message-syntax/)',
  [ISSUE_TYPES.ARRAYS]: 'Give each item a unique key (https://phraseapp.com/docs/guides/formats/simple-json/)'
};

// @ts-ignore
const ANNONTATION_LEVELS: { IssueTypes: string } = {
  [ISSUE_TYPES.BOOLEANS]: 'warning',
  [ISSUE_TYPES.FUNCTIONS]: 'warning',
  [ISSUE_TYPES.ARRAYS]: 'warning',
};

interface IBaseIssue {
  issueType: string;
  file: string;
  line: number;
  column: number;
}

function buildIssue(type: string, meta: string, file: string, line: number, column: number): IBaseIssue {
  return {issueType: type, [type]: meta, file, line, column};
}

/**
 * Get all issues in a file
 *
 * @param filePath
 */
// @ts-ignore
async function findIssuesInFilePath(filePath: string): Promise<any> {
  const data = await getFileContents(filePath) as string;
  let matches;
  let issues = [];

  // find all issues of functions being used in lang files
  const regexIssueMethod = new RegExp('([a-zA-Z]*):\\s\\(', 'gi');
  while ((matches = regexIssueMethod.exec(data)) !== null) {
    const topToMatch = matches.input.substring(0, matches.index);
    const line = topToMatch.split(/\r\n|\r|\n/).length;
    // @ts-ignore
    const column = topToMatch.match(/([^\n].*)$/)[0].length + 1;
    const issue = buildIssue(ISSUE_TYPES.FUNCTIONS, matches[1], filePath, line, column);
    issues.push(issue);
  }

  // find all issues of arrays being used in lang files
  const regexIssueArray = new RegExp('([a-zA-Z]*):\\s\\[', 'gi');
  while ((matches = regexIssueArray.exec(data)) !== null) {
    const topToMatch = matches.input.substring(0, matches.index);
    const line = topToMatch.split(/\r\n|\r|\n/).length;
    // @ts-ignore
    const column = topToMatch.match(/([^\n].*)$/)[0].length + 1;
    const issue = buildIssue(ISSUE_TYPES.ARRAYS, matches[1], filePath, line, column);
    issues.push(issue);
  }

  // find all issues of booleans being used in lang files
  const regexIssueBool = new RegExp('([a-zA-Z]*):\\s(true|false)\\,', 'gi');
  while ((matches = regexIssueBool.exec(data)) !== null) {
    const topToMatch = matches.input.substring(0, matches.index);
    const line = topToMatch.split(/\r\n|\r|\n/).length;
    // @ts-ignore
    const column = topToMatch.match(/([^\n].*)$/)[0].length + 1;
    const issue = buildIssue(ISSUE_TYPES.BOOLEANS, matches[1], filePath, line, column);
    issues.push(issue);
  }

  if (issues.length) {
    return issues;
  }
}

function getFileContents(fileLocation: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(fileLocation, 'utf8', (err, contents) => {
      err ? reject(err) : resolve(contents);
    });
  });
}

export default (globPattern: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    glob(`${globPattern}/**/lang.js`, {realpath: true}, (er, files) => {
      Promise
        .all(files.map((file) => findIssuesInFilePath(file)))
        .then((issues) => {
          const annotations = issues
            .reduce((acc, curr) => [...acc, ...curr], [])
            .filter((a: any) => a)
            .map((issue: IBaseIssue) => {
              const filePath = issue.file.replace(`${globPattern}/`, '');
              return {
                path: filePath,
                start_line: issue.line,
                end_line: issue.line,
                start_column: issue.column,
                // @ts-ignore
                annotation_level: ANNONTATION_LEVELS[issue.issueType] as string,
                // @ts-ignore
                message: ISSUE_HELP[issue.issueType] as string,
                // @ts-ignore
                title: `Warning with ${issue.issueType} of ${issue[issue.issueType]}`,

                // required
                // @ts-ignore
                // warning_level: ANNONTATION_LEVELS[issue.issueType] as any,
                // blob_href: '',
                // filename: '',
              };
            })
          ;
          resolve(annotations);
        });
    });
  });
}
