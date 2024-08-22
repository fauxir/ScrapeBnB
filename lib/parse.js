const cheerio = require('cheerio');
const { standardizeDetails } = require('./standardize');
const { removeSpace } = require('./utils');

const regxApiKey = /"key":".+?"/;
const regexLanguage = /"language":".+?"/;

function parseBodyDetailsWrapper(body) {
  const { dataRaw, language, apiKey } = parseBodyDetails(body);
  const dataFormatted = standardizeDetails(dataRaw);
  dataFormatted.language = language;

  const priceDependencyInput = {
    product_id: dataRaw.variables.id,
    impression_id: dataRaw.variables.pdpSectionsRequest.p3ImpressionId,
    api_key: apiKey
  };

  return { dataFormatted, priceDependencyInput };
}

function parseBodyDetails(body) {
  const $ = cheerio.load(body);
  const dataDeferredState = $('#data-deferred-state-0').text();
  const htmlData = removeSpace(dataDeferredState);

  const languageMatch = body.match(regexLanguage);
  const language = languageMatch ? languageMatch[0].replace('"language":"', '').replace('"', '') : '';

  const apiKeyMatch = body.match(regxApiKey);
  const apiKey = apiKeyMatch ? apiKeyMatch[0].replace('"key":"', '').replace('"', '') : '';

  const data = JSON.parse(htmlData);
  const detailsData = data.niobeMinimalClientData[0][1];

  return { dataRaw: detailsData, language, apiKey };
}

module.exports = {
  parseBodyDetailsWrapper,
  parseBodyDetails
};