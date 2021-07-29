const fs = require('fs');
const path = require('path');

const readFiles = require('./src/readFiles');
const findData = require('./src/findData');

const dirPath = path.join(__dirname, 'moldova-schools');
const files = readFiles(dirPath);

files.forEach((file) => {
  const filePath = path.join(dirPath, `${file.id}.json`);
  const newData = findData(file);

  if (newData.idnp) {
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
  }
});
