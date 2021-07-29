const fs = require('fs');
const path = require('path');

function readFiles(dirPath) {
  const files = fs.readdirSync(dirPath).map((fileName) => {
    const filePath = path.join(dirPath, fileName);
    const options = {
      encoding: 'utf8'
    }
    const data = fs.readFileSync(filePath, options);

    return JSON.parse(data);
  });

  return files;
}

module.exports = readFiles;
