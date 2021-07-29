const xlsx = require('node-xlsx');

const replaceRoDiacritics = require('./replaceRoDiacritics');

let parsedXlsx = xlsx.parse(`${__dirname}/../excels/Adresa_scolii_2017-2018.xlsx`)[0].data;

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
      .replace(/s\.|or\./, '');

    const name = replaceRoDiacritics(nameStr)

    const isSchool = name.search(regexp) !== -1;

    // console.log('District:', file.address.district, district, file.district === district );
    // console.log('City:', file.address.city, city, file.city === city );
    // console.log('isSchool:', isSchool,  nameStr);
    // console.log('------------------------------------------------------');

    if (
      file.address.district === district &&
      file.address.city === city &&
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
