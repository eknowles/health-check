import fs from "fs";

export default (fileLocation: string): Promise<string> => new Promise((resolve, reject) => {
  fs.readFile(fileLocation, 'utf8', (err, contents) => err ? reject(err) : resolve(contents));
})
