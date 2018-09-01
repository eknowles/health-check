/**
 * This is a script to find issues in the lang.js files and output in a pretty fashion, ideally give us a base and
 * something to set a target from, even assign ownership of tech debt to.
 *
 * Some Interesting Reading Material
 * - https://help.phraseapp.com/phraseapp-for-developers
 * - https://help.phraseapp.com/translate-website-and-app-content/use-icu-message-format/icu-message-format
 * - https://github.com/yahoo/react-intl/wiki/API#definemessages
 *
 * To run this script, you might need to install a few deps
 * `$ npm i -g glob chalk async`
 *
 * Usage
 * --json (-j)
 *      This returns a nice JSON stringified list of issues
 * --short (-s)
 *      When used with JSON produces a basic count of the issues (e.g.
 * {"arrayName":97,"functionName":45,"date":"2018-08-22T07:12:23.825Z"})
 */

import fs from 'fs';
import async from 'async';
import glob from 'glob';

type IssueTypes = 'booleanName' | 'functionName' | 'arrayName'

const ISSUE_TYPES: {[name: string]: IssueTypes} = {
  BOOLEANS: 'booleanName',
  FUNCTIONS: 'functionName',
  ARRAYS: 'arrayName'
};

// @ts-ignore
const ISSUE_HELP: {IssueTypes: string} = {
  [ISSUE_TYPES.BOOLEANS]: 'Remove config from translations',
  [ISSUE_TYPES.FUNCTIONS]: 'Switch to ICU message format (see https://formatjs.io/guides/message-syntax/)',
  [ISSUE_TYPES.ARRAYS]: 'Give each item a unique key (https://phraseapp.com/docs/guides/formats/simple-json/)'
};

// @ts-ignore
const ANNONTATION_LEVELS: {IssueTypes: string} = {
  [ISSUE_TYPES.BOOLEANS]: 'failure',
  [ISSUE_TYPES.FUNCTIONS]: 'failure',
  [ISSUE_TYPES.ARRAYS]: 'failure',
};

interface IBaseIssue {
  issueType: string;
  file: string;
  line: number;
  column: number;
}

function buildIssue(type: string, meta: string, file: string, line: number, column: number): IBaseIssue {
  return { issueType: type, [type]: meta, file, line, column };
}


/**
 * Get all issues in a file
 *
 * @param filePath
 */
// @ts-ignore
async function findIssuesInFilePath(filePath: string): Promise<IBaseIssue[]> {
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

/**
 * Gets contents of a file
 * @param {String} fileLocation
 * @return {Promise<String>}
 */
function getFileContents(fileLocation: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileLocation, 'utf8', (err, contents) => {
      err ? reject(err) : resolve(contents);
    });
  });
}

export default function buildReport(globPattern: string): any {
  return new Promise(((resolve) => {
    glob(`${globPattern}/**/lang.js`, {realpath: true}, (er, files) => {
      async.mapLimit(files, 5, findIssuesInFilePath, (err, fileIssues) => {
        if (err) throw err;
        console.log('y');

        // const issues = fileIssues.filter(r => r); // remove any results without issues
        return resolve(fileIssues);
      });
    });
  }));
}
