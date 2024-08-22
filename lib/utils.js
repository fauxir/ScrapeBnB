const regexSpace = /[\s]+/;
const regexPrice = /\d+/;

function removeSpace(value) {
  return value.trim().replace(regexSpace, ' ');
}

function getNestedValue(obj, keyPath, defaultValue = null) {
  const keys = keyPath.split('.');
  let current = obj;

  for (const key of keys) {
    if (current == null || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[key];
  }

  return current === undefined ? defaultValue : current;
}

function parsePriceSymbol(priceRaw) {
  priceRaw = priceRaw.replace(',', '');
  const priceNumberMatch = priceRaw.match(regexPrice);

  if (!priceNumberMatch) {
    return [0, ''];
  }

  const priceNumber = priceNumberMatch[0];
  const priceCurrency = priceRaw.replace(priceNumber, '').replace(' ', '').replace('-', '');
  let priceConverted = parseFloat(priceNumber);

  if (priceRaw.startsWith('-')) {
    priceConverted *= -1;
  }

  return [priceConverted, priceCurrency];
}

module.exports = {
  removeSpace,
  getNestedValue,
  parsePriceSymbol,
};