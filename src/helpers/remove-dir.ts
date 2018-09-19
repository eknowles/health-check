import rimraf from 'rimraf';

export default (path: string) => {
  return new Promise((resolve, reject) => {
    rimraf(path, (err) => {
      if (err) reject(err);
      resolve();
    })
  });
}
