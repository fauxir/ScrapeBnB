const { searchAll, searchFirstPage } = require('./lib/search');
const { 
  getFromRoomUrl, 
  getFromRoomId, 
  getFromRoomIdAndDomain, 
  getPriceByUrl 
} = require('./lib/details');

module.exports = {
  searchAll,
  searchFirstPage,
  getFromRoomUrl,
  getFromRoomId,
  getFromRoomIdAndDomain,
  getPriceByUrl
};