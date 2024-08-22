const puppeteer = require('puppeteer');
const { parseBodyDetailsWrapper } = require('./parse');
const { getPrice } = require('./price');
const { CheckPropertyLink } = require('./check');

async function getFromRoomUrl(roomURL, currency, checkIn, checkOut, proxyUrl) {

  const { data, priceInput, cookies } = await fetchFromRoomUrl(roomURL, proxyUrl);

  if (!checkIn || !checkOut) {
    return data;
  }

  const dataFullPrice = await getPrice(
    priceInput.product_id,
    priceInput.impression_id,
    priceInput.api_key,
    currency,
    cookies,
    checkIn,
    checkOut,
    proxyUrl
  );

  data.price = dataFullPrice;
  return data;
}

async function getFromRoomId(roomId, currency, checkIn, checkOut, proxyUrl) {
  const roomUrl = `https://www.airbnb.com/rooms/${roomId}`;
  return getFromRoomUrl(roomUrl, currency, checkIn, checkOut, proxyUrl);
}

async function getFromRoomIdAndDomain(roomId, domain, currency, checkIn, checkOut, proxyUrl) {
  const roomUrl = `https://${domain}/rooms/${roomId}`;
  return getFromRoomUrl(roomUrl, currency, checkIn, checkOut, proxyUrl);
}

async function getPriceByUrl(roomURL, currency, checkIn, checkOut, proxyUrl) {
  const { data, priceInput, cookies } = await fetchFromRoomUrl(roomURL, proxyUrl);
  const dataFullPrice = await getPrice(
    priceInput.product_id,
    priceInput.impression_id,
    priceInput.api_key,
    currency,
    cookies,
    checkIn,
    checkOut,
    proxyUrl
  );
  data.price = dataFullPrice;
  return data;
}
async function fetchFromRoomUrl(roomUrl, proxyUrl) {
  CheckPropertyLink(roomUrl);
  let browser;
  try {
    const launchOptions = {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080',
      ]
    };

    if (proxyUrl) {
      launchOptions.args.push(`--proxy-server=${proxyUrl}`);
    }

    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    // Set a realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Set extra HTTP headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
    });

    // Navigate to the URL
    await page.goto(roomUrl, { waitUntil: 'networkidle0' });

    // Get the page content
    const content = await page.content();

    // Parse the content
    const { dataFormatted, priceDependencyInput } = parseBodyDetailsWrapper(content);

    // Get cookies
    const cookies = await page.cookies();

    return { data: dataFormatted, priceInput: priceDependencyInput, cookies };
  } catch (error) {
    console.error('Error fetching room data:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

async function getFromRoomUrl(roomURL, currency, checkIn, checkOut, proxyUrl) {
  const { data, priceInput, cookies } = await fetchFromRoomUrl(roomURL, proxyUrl);
  
  if (!checkIn || !checkOut) {
    return data;
  }

  // You'll need to implement getPrice function
  const dataFullPrice = await getPrice(
    priceInput.product_id,
    priceInput.impression_id,
    priceInput.api_key,
    currency,
    cookies,
    checkIn,
    checkOut,
    proxyUrl
  );

  data.price = dataFullPrice;
  return data;
}

module.exports = {
  getFromRoomUrl,
  getFromRoomId,
  getFromRoomIdAndDomain,
  getPriceByUrl
};