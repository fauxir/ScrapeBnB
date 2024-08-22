# 🏠 ScrapeBnB

[![npm version](https://img.shields.io/npm/v/scrapebnb.svg)](https://www.npmjs.com/package/scrapebnb)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A powerful and easy-to-use Node.js package for scraping Airbnb data. Get detailed information about listings, prices, and search results with just a few function calls! 🚀

## 📋 Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)
- [Disclaimer](#disclaimer)

## 🔧 Installation

Install the package using npm:

bash npm install scrapebnb
## 🚀 Usage

First, import the package in your JavaScript file:

javascript const airbnbScraper = require('scrapebnb');
Now you're ready to use the scraper functions!

## 📚 API Reference

### `getFromRoomUrl(roomURL, currency, checkIn, checkOut, proxyUrl)`

Fetches detailed information about a specific Airbnb listing.

- `roomURL` (string): The full URL of the Airbnb listing.
- `currency` (string): The currency code (e.g., 'USD', 'EUR').
- `checkIn` (string): Check-in date in 'YYYY-MM-DD' format.
- `checkOut` (string): Check-out date in 'YYYY-MM-DD' format.
- `proxyUrl` (string, optional): Proxy URL if you're using one.

Returns a Promise that resolves with the listing details.

### `getFromRoomId(roomId, currency, checkIn, checkOut, proxyUrl)`

Similar to `getFromRoomUrl`, but uses the room ID instead of the full URL.

### `getPrice(productId, impressionId, apiKey, currency, cookies, checkIn, checkOut, proxyUrl)`

Fetches pricing information for a specific listing.

### `searchAll(checkIn, checkOut, neLat, neLong, swLat, swLong, zoomValue, currency, proxyUrl)`

Performs a search and returns all results for a given area and date range.

### `searchFirstPage(checkIn, checkOut, neLat, neLong, swLat, swLong, zoomValue, cursor, currency, proxyUrl)`

Performs a search and returns the first page of results.

## 💡 Examples

### Fetching listing details

javascript const airbnbScraper = require('scrapebnb');

async function getListingDetails() { try { const details = await airbnbScraper.getFromRoomUrl( 'https://www.airbnb.com/rooms/12345678', 'USD', '2023-07-01', '2023-07-07' ); console.log(details); } catch (error) { console.error('Error fetching listing details:', error); } }

getListingDetails();
### Performing a search

javascript const airbnbScraper = require('scrapebnb');

async function searchListings() { try { const results = await airbnbScraper.searchAll( '2023-07-01', '2023-07-07', 40.7128, // Northeast latitude -74.0060, // Northeast longitude 40.7000, // Southwest latitude -74.0200, // Southwest longitude 12, // Zoom value 'USD' ); console.log(results); } catch (error) { console.error('Error searching listings:', error); } }

searchListings();
## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/yourusername/scrapebnb/issues).

## 📄 License

This project is [MIT](https://opensource.org/licenses/MIT) licensed.

## ⚠️ Disclaimer

This package is for educational and personal use only. Scraping websites may violate their terms of service. Always check and comply with Airbnb's robots.txt file and terms of service before using this scraper. The authors and contributors of this package are not responsible for any misuse or any consequences arising from the use of this software. Use at your own risk and responsibility.

---

Happy scraping! 🎉 If you find this package helpful, consider giving it a star on GitHub! ⭐