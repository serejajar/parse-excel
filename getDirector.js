const fs = require('fs');
const path = require('path');
const xlsx = require('node-xlsx');

const replaceRoDiacritics = require('./src/replaceRoDiacritics');
const readFiles = require('./src/readFiles');

const dirPath = path.join(__dirname, 'moldova-schools');

const files = readFiles(dirPath);

let parsedXlsx = xlsx.parse(`${__dirname}/excels/director_2017-18.xlsx`)[0].data;

const noUniqueIdnps = [
  '1007601008373', '1009601000131', '184542',
  '1015601000259', '1012601000018', '1014601000034',
  '31942389',      '1007601009417', '17993',
  '1007601009716', '1007601009967', '1007601010600',
  '1005602004895', '1002600026438', '1007601009565',
  '1007601010448', '02168123',      '20437510',
  '1012620010243', '1007601010068', '1010601000162',
  '1008601000950', '1007601010954', '1009601000142',
  '1008601000097', '1009601000094', '1009601000212',
  '1007601011331', '35087712',      '33781740',
  '1013601000440', '1007601010998', '1007601011098',
  '1016601000201', '1007601011342', '10076010111342',
  '1013601000015', '3879866',       '33879866',
  '1011601000192', '1013601000093', '187509'
];

const noUniqueIdnps2 = [];


const newFiles = {};

parsedXlsx.forEach((school, i) => {
  if (i === 0) {
    return;
  }

  const [
    districtStr,
    cityStr,
    nameStr,
    idno,
    owner,
    addressStr,
    phonesStr,
    category,
    type,
    lang,
    numSchimburi,
    students,
    director,
    salaDeSport,
    library,
    pc,
    notebook,
    netbook,
    tabletPC,
    proector,
    interactiveTable,
    mediumNote,
    mediumNoteBAC,
    succsessBAC,
    teachers,
  ] = school;

  let file = files.find(({ idnp = '' }) => idnp == idno);

  if (!file) {
    const district = replaceRoDiacritics(districtStr, true)
      .toLowerCase();

    const city = replaceRoDiacritics(cityStr, true)
      .toLowerCase()
      .replace(/s\.|or\.|mun\.|-/gi, '');

    const random = Math.floor(Math.random() * 1000000000);
    const id = `${district}-${city}-${random}`

    file = {
      id,
      search: '',
      address: {
        district,
        city,
        street: addressStr,
        building: ""
      },
      name: {
        ro: nameStr,
        ru: ""
      },
      bac: [],
      profiles: [],
      phones: [ phonesStr ],
      type,
      idnp: noUniqueIdnps.includes(idno) ? `${idno}___(${id})` : idno
    }
  }

  const newData = {
    ...file,
    directors: [
      {
        name: director,
        year: '2017'
      }
    ],
    teachers: [
      {
        number: teachers,
        year: '2017'
      }
    ],
    students: [
      {
        number: students,
        year: '2017'
      }
    ],
    langs: [ replaceRoDiacritics(lang || '').toLowerCase() ],
    equipment: [
      {
        pc,
        notebook,
        netbook,
        tabletPC,
        proector,
        interactiveTable,
        year: '2017'
      }
    ]
  }

  const filePath = path.join(dirPath, `${newData.id}.json`);

  fs.writeFileSync(filePath, JSON.stringify(newData, null, 2))
});
