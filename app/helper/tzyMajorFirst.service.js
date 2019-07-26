/**
 * 智能推荐-专业优先
 */
'use strict';
const tzyManualFill = require('./tzyManualFill.service');

const service = {};

service.aesKeyMon = function() {
  const key = [ 46, 67, 9, 9, 10, 11 ];
  return key.concat(tzyManualFill.aesKeyMon());
};

service.aesKey = function() {
  const key = [ 46, 67, 8, 9, 10, 11 ];
  return key.concat(tzyManualFill.aesKeySat());
};

service.aesKeyTus = function() {
  const key = [ 46, 67, 8, 11, 10, 11 ];
  return key.concat(tzyManualFill.aesKeyTus());
};

return service;

