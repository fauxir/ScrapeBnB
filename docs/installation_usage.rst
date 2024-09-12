Installation & Usage
====================

This section covers how to install and use **ScrapeBnB** in your Node.js project.

Installation
------------

To install **ScrapeBnB**, use the following command:

.. code-block:: bash

    npm install scrapebnb

Ensure you have Node.js installed. ScrapeBnB requires Node.js version 12 or higher.

Usage
-----

Once installed, you can import the ScrapeBnB package in your JavaScript file and start scraping Airbnb data.

Basic Example
-------------

.. code-block:: javascript

    const airbnbScraper = require('scrapebnb');

    async function getListingDetails() {
      try {
        const details = await airbnbScraper.getFromRoomUrl(
          'https://www.airbnb.com/rooms/12345678',
          'USD',
          '2024-09-01',
          '2024-09-07'
        );
        console.log(details);
      } catch (error) {
        console.error('Error fetching listing details:', error);
      }
    }

    getListingDetails();

Proxy Usage
-----------

If you're using a proxy to avoid rate limiting or IP blocking, you can pass the proxy URL as an argument to the scraping functions.

.. code-block:: javascript

    const proxyUrl = 'http://your-proxy-url.com';
    
    const details = await airbnbScraper.getFromRoomUrl(
      'https://www.airbnb.com/rooms/12345678',
      'USD',
      '2024-09-01',
      '2024-09-07',
      proxyUrl
    );

Note: Always comply with Airbnb's terms of service when scraping their website.
