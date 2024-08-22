const api = require('./api');
const { standardizeSearch } = require('./standardize');
const axios = require('axios');
const { URLSearchParams } = require('url');

const treatment = [
  "feed_map_decouple_m11_treatment",
  "stays_search_rehydration_treatment_desktop",
  "stays_search_rehydration_treatment_moweb",
  "selective_query_feed_map_homepage_desktop_treatment",
  "selective_query_feed_map_homepage_moweb_treatment",
];

async function searchAll(checkIn, checkOut, neLat, neLong, swLat, swLong, zoomValue, currency, proxyUrl) {
  const apiKey = await api.get(proxyUrl);
  let allResults = [];
  let cursor = "";

  while (true) {
    const resultsRaw = await search(checkIn, checkOut, neLat, neLong, swLat, swLong, zoomValue, cursor, currency, apiKey, proxyUrl);
    const results = standardizeSearch(resultsRaw.searchResults || []);
    allResults = allResults.concat(results);

    if (results.length === 0 || !resultsRaw.paginationInfo.nextPageCursor) {
      break;
    }
    cursor = resultsRaw.paginationInfo.nextPageCursor;
  }

  return allResults;
}

async function searchFirstPage(checkIn, checkOut, neLat, neLong, swLat, swLong, zoomValue, cursor, currency, proxyUrl) {
  const apiKey = await api.get(proxyUrl);
  const results = await search(checkIn, checkOut, neLat, neLong, swLat, swLong, zoomValue, "", currency, apiKey, proxyUrl);
  return standardizeSearch(results);
}

async function search(checkIn, checkOut, neLat, neLong, swLat, swLong, zoomValue, cursor, currency, apiKey, proxyUrl) {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const days = Math.floor((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

  const baseUrl = "https://www.airbnb.com/api/v3/StaysSearch/d4d9503616dc72ab220ed8dcf17f16681";
  const queryParams = new URLSearchParams({
    operationName: "StaysSearch",
    locale: "en",
    currency: currency,
  });

  const urlParsed = `${baseUrl}?${queryParams.toString()}`;

  const rawParams = [
    { filterName: "cdnCacheSafe", filterValues: ["false"] },
    { filterName: "channel", filterValues: ["EXPLORE"] },
    { filterName: "checkin", filterValues: [checkIn] },
    { filterName: "checkout", filterValues: [checkOut] },
    { filterName: "datePickerType", filterValues: ["calendar"] },
    { filterName: "flexibleTripLengths", filterValues: ["one_week"] },
    { filterName: "itemsPerGrid", filterValues: ["50"] },
    { filterName: "monthlyLength", filterValues: ["3"] },
    { filterName: "monthlyStartDate", filterValues: ["2024-02-01"] },
    { filterName: "neLat", filterValues: [neLat.toString()] },
    { filterName: "neLng", filterValues: [neLong.toString()] },
    { filterName: "placeId", filterValues: ["ChIJpTeBx6wjq5oROJeXkPCSSSo"] },
    { filterName: "priceFilterInputType", filterValues: ["0"] },
    { filterName: "priceFilterNumNights", filterValues: [days.toString()] },
    { filterName: "query", filterValues: ["Galapagos Island, Ecuador"] },
    { filterName: "screenSize", filterValues: ["large"] },
    { filterName: "refinementPaths", filterValues: ["/homes"] },
    { filterName: "searchByMap", filterValues: ["true"] },
    { filterName: "swLat", filterValues: [swLat.toString()] },
    { filterName: "swLng", filterValues: [swLong.toString()] },
    { filterName: "tabId", filterValues: ["home_tab"] },
    { filterName: "version", filterValues: ["1.8.3"] },
    { filterName: "zoomLevel", filterValues: [zoomValue.toString()] },
  ];

  const inputData = {
    operationName: "StaysSearch",
    extensions: {
      persistedQuery: {
        version: 1,
        sha256Hash: "d4d9503616dc72ab220ed8dcf17f166816dccb2593e7b4625c91c3fce3a3b3d6",
      },
    },
    variables: {
      includeMapResults: true,
      isLeanTreatment: false,
      staysMapSearchRequestV2: {
        cursor: cursor,
        requestedPageType: "STAYS_SEARCH",
        metadataOnly: false,
        source: "structured_search_input_header",
        searchType: "user_map_move",
        treatmentFlags: treatment,
        rawParams: rawParams,
      },
      staysSearchRequest: {
        cursor: cursor,
        maxMapItems: 9999,
        requestedPageType: "STAYS_SEARCH",
        metadataOnly: false,
        source: "structured_search_input_header",
        searchType: "user_map_move",
        treatmentFlags: treatment,
        rawParams: rawParams,
      },
    },
  };

  const headers = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en",
    "Cache-Control": "no-cache",
    "Connection": "close",
    "Pragma": "no-cache",
    "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    "Sec-Ch-Ua-Mobile": "?0",
    "X-Airbnb-Api-Key": apiKey,
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  };

  const axiosConfig = {
    method: 'post',
    url: urlParsed,
    headers: headers,
    data: inputData,
  };

  if (proxyUrl) {
    axiosConfig.proxy = {
      protocol: 'http',
      host: proxyUrl.split(':')[0],
      port: parseInt(proxyUrl.split(':')[1]),
    };
  }

  try {
    const response = await axios(axiosConfig);
    const data = response.data;
    return data.data.presentation.staysSearch.results || {};
  } catch (error) {
    console.error('Error in search:', error);
    return {};
  }
}

module.exports = {
  searchAll,
  searchFirstPage,
  search,
};