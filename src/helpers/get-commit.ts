import { spawn } from 'child_process';

function cloneRepository(url: string, path: string) {
  return new Promise(((resolve, reject) => {
    const gitClone = spawn('git', ['clone', url, path]);

    gitClone.on('close', (code) => {
      return code === 1 ? reject('Git Clone Failed') : resolve(path);
    });
  }));
}

function checkoutCommit(commit: string, path: string) {
  return new Promise(((resolve, reject) => {
    const gitClone = spawn('git', ['checkout', commit], {cwd: path});

    gitClone.on('close', (code) => {
      return code === 1 ? reject('Git Checkout Failed') : resolve(path);
    });
  }));
}

export interface IGetCommitOptions {
  token: string;
  owner: string;
  repo: string;
  sha: string;
}

export default (options: IGetCommitOptions) => {
  const {owner, token, repo, sha} = options;
  const url = `https://${token}@github.com/${owner}/${repo}`;
  const tmpPath = `${process.cwd()}/tmp/${sha}`;

  cloneRepository(url, tmpPath)
    .then(() => checkoutCommit(sha, tmpPath))
    .then(() => {
      console.log('done');
    })
    .catch((err) => {
      console.log(err);
    })
  ;
}
