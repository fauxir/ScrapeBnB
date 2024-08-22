const axios = require('axios');

const ep = "https://www.airbnb.com";
const regxApiKey = /"api_config":{"key":".+?"/;

async function get(proxyUrl) {
  const headers = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en",
    "Cache-Control": "no-cache",
    "Pragma": "no-cache",
    "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  };

  const axiosConfig = {
    headers: headers,
    timeout: 60000
  };

  if (proxyUrl) {
    axiosConfig.proxy = {
      protocol: 'http',
      host: proxyUrl.split(':')[0],
      port: parseInt(proxyUrl.split(':')[1])
    };
  }

  try {
    const response = await axios.get(ep, axiosConfig);
    const body = response.data;
    const apiKeyMatch = body.match(regxApiKey);
    if (apiKeyMatch) {
      const apiKey = apiKeyMatch[0].replace('"api_config":{"key":"', '').replace('"', '');
      return apiKey;
    }
    throw new Error('API key not found in response');
  } catch (error) {
    console.error('Error fetching API key:', error);
    throw error;
  }
}

module.exports = { get };