const regexpForSpaces = / /gi;
const regexpForRoDiacritics = new RegExp(`[ăâșşţțîе]`, 'ig');

const roToEn = {
  ă: 'a',
  â: 'a',
  ș: 's',
  ş: 's',
  ţ: 't',
  ț: 't',
  î: 'i'
};

function replaceRoDiacritics(str, removeSpaces) {
  const strWithoutRo = str
    .toLowerCase()
    .replace(regexpForRoDiacritics, (match) => roToEn[match])

  if (removeSpaces) {
    return strWithoutRo.replace(regexpForSpaces, '')
  }

  return strWithoutRo;
}

module.exports = replaceRoDiacritics;
