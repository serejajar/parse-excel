const fs = require('fs');
const path = require('path');

const readFiles = require('./src/readFiles');
const { findData, getParsedXlsx } = require('./src/findData');
const replaceRoDiacritics = require('./src/replaceRoDiacritics');

const dirPath = path.join(__dirname, 'moldova-schools');
const files = readFiles(dirPath);

// files.forEach((file) => {
//   const filePath = path.join(dirPath, `${file.id}.json`);
//   const newData = findData(file);
//
//   // if (newData.idnp) {
//   //   fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
//   // }
// });

const parsedXlsx = getParsedXlsx();
parsedXlsx.forEach((school, i) => {
  if (i === 0) {
    return;
  }

  const [
    districtStr,
    cityStr,
    name,
    idnp,
    street,
    phone,
    type,
  ] = school;

  const district = replaceRoDiacritics(districtStr).toLowerCase().replace(/\s/gi, '');
  const city = replaceRoDiacritics(cityStr).toLowerCase().replace(/s\.|or\.|mun\.|-|\s/gi, '');

  const newData = {
    id: `${district}-${city}-none`,
    search: '',
    address: {
      district,
      city,
      street,
      building: '',
    },
    name: {
      ro: name,
      ru: ''
    },
    bac: [],
    langs: [],
    profiles: [],
    phones: [
      phone
    ],
    type,
    idnp,
  };

  const filePath = path.join(dirPath, `${newData.id}.json`);
  console.log(filePath);

  fs.writeFileSync(filePath, JSON.stringify(newData, null, 2));
});

// console.log(parsedXlsx);
