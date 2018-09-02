import { spawn } from 'child_process';

export interface IGetCommitOptions {
  token: string;
  owner: string;
  repo: string;
  sha: string;
  id: string;
}

function cloneRepository(url: string, path: string): Promise<string> {
  return new Promise(((resolve, reject) => {
    const gitClone = spawn('git', ['clone', url, path]);

    gitClone.on('close', (code) => {
      return code === 1 ? reject('Git Clone Failed') : resolve(path);
    });
  }));
}

function checkoutCommit(commit: string, path: string): Promise<string> {
  return new Promise(((resolve, reject) => {
    const gitClone = spawn('git', ['checkout', commit], {cwd: path});

    gitClone.on('close', (code) => {
      return code === 1 ? reject('Git Checkout Failed') : resolve(path);
    });
  }));
}

export default (options: IGetCommitOptions): Promise<string> => {
  const {owner, token, repo, sha} = options;
  const url = `https://${token}@github.com/${owner}/${repo}`;
  const tmpPath = `${process.cwd()}/tmp/${sha}`;

  // TODO check if dir exists (in case of re-runs) and simply return the path if so.

  return cloneRepository(url, tmpPath)
    .then(() => checkoutCommit(sha, tmpPath));
}
