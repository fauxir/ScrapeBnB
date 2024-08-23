const { searchAll } = require('./lib/search');
const { getFromRoomId, getFromRoomUrl } = require('./lib/details')
// const fs = require('fs').promises;

async function test0() {
  const roomId = "https://www.airbnb.co.uk/rooms/20669368";
  const currency = "MXN";
  const checkIn = "2024-11-02";
  const checkOut = "2024-11-10";
  const data = await getFromRoomUrl(roomId, currency, checkIn, checkOut, "");
  // await fs.writeFile("details.json", JSON.stringify(data, null, 2));
}

async function test1() {
  const roomId = 33571268;
  const currency = "MXN";
  const checkIn = "2024-11-02";
  const checkOut = "2024-11-10";
  const data = await getFromRoomId(roomId, currency, checkIn, checkOut, "");
  // await fs.writeFile("details.json", JSON.stringify(data, null, 2));
}

async function test2() {
  const currency = "MXN";
  const checkIn = "2024-11-02";
  const checkOut = "2024-11-10";
  const neLat = -1.03866277790021;
  const neLong = -77.53091734683608;
  const swLat = -1.1225978433925647;
  const swLong = -77.59713412765507;
  const zoomValue = 2;
  const results = await searchAll(checkIn, checkOut, neLat, neLong, swLat, swLong, zoomValue, currency, "");
  // await fs.writeFile("search.json", JSON.stringify(results, null, 2));
}

async function main() {
  await test0();
}

main().catch(console.error);