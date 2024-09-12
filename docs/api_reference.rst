API Reference
=============

This section provides detailed information about the functions available in ScrapeBnB.

getFromRoomUrl
--------------

Fetches detailed information about a specific Airbnb listing.

- **Parameters**:
  - ``roomURL`` (string): The full URL of the Airbnb listing.
  - ``currency`` (string): The currency code (e.g., 'USD', 'EUR').
  - ``checkIn`` (string): Check-in date in 'YYYY-MM-DD' format.
  - ``checkOut`` (string): Check-out date in 'YYYY-MM-DD' format.
  - ``proxyUrl`` (string, optional): Proxy URL if you're using one.

- **Returns**: A Promise that resolves with the listing details.

Example:

.. code-block:: javascript

    const details = await airbnbScraper.getFromRoomUrl(
      'https://www.airbnb.com/rooms/12345678',
      'USD',
      '2024-09-01',
      '2024-09-07'
    );

getFromRoomId
-------------

Fetches detailed information about a specific Airbnb listing using the room ID.

- **Parameters**:
  - ``roomId`` (string): The Airbnb room ID.
  - ``currency`` (string): The currency code (e.g., 'USD', 'EUR').
  - ``checkIn`` (string): Check-in date in 'YYYY-MM-DD' format.
  - ``checkOut`` (string): Check-out date in 'YYYY-MM-DD' format.
  - ``proxyUrl`` (string, optional): Proxy URL if you're using one.

- **Returns**: A Promise that resolves with the listing details.

searchAll
---------

Performs a search and returns all results for a given area and date range.

- **Parameters**:
  - ``checkIn`` (string): Check-in date in 'YYYY-MM-DD' format.
  - ``checkOut`` (string): Check-out date in 'YYYY-MM-DD' format.
  - ``neLat`` (number): Northeast latitude of the area.
  - ``neLong`` (number): Northeast longitude of the area.
  - ``swLat`` (number): Southwest latitude of the area.
  - ``swLong`` (number): Southwest longitude of the area.
  - ``zoomValue`` (number): Zoom level for the search.
  - ``currency`` (string): The currency code (e.g., 'USD', 'EUR').
  - ``proxyUrl`` (string, optional): Proxy URL if you're using one.

- **Returns**: A Promise that resolves with the search results.
