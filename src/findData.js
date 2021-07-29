const xlsx = require('node-xlsx');

const replaceRoDiacritics = require('./replaceRoDiacritics');

let parsedXlsx = xlsx.parse(`${__dirname}/../excels/Adresa_scolii_2017-2018.xlsx`)[0].data;

// const test = parsedXlsx.map(([
//   districtStr,
//   cityStr,
//   nameStr,
//   idnp,
//   street = '',
//   phonesStr,
//   type
// ]) => replaceRoDiacritics(districtStr, true).toLowerCase().replace(/s\.|or\.|mun\.|-/gi, ''))
//
// console.log(test.join('\n'));

function findData(file) {
  const regexp = new RegExp(file.search, 'gi');

  let newData = {};

  parsedXls = parsedXlsx.filter((dataItem, i) => {
    const [
      districtStr,
      cityStr,
      nameStr,
      idnp,
      street = '',
      phonesStr,
      type
    ] = dataItem;

    const district = replaceRoDiacritics(districtStr, true)
      .toLowerCase();

    const city = replaceRoDiacritics(cityStr, true)
      .toLowerCase()
      .replace(/s\.|or\.|mun\.|-/gi, '');

    const name = replaceRoDiacritics(nameStr)

    const isSchool = name.search(regexp) !== -1;

    if (
      file.address.district === district &&
      (file.address.district === 'chisinau' || file.address.city === city) &&
      isSchool
    ) {
      newData = {
        address: {
          ...file.address,
          street: replaceRoDiacritics(street).toLowerCase(),
          building: '',
        },
        phones: [ phonesStr ],
        type,
        idnp
      }

      return false;
    } else {
      return true;
    }
  });

  return {
    ...file,
    ...newData,
  }
}

module.exports = findData;
