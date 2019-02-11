'use strict';
const path = require('path');

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_HuaShi';
  config.apiHeader = 'http://122.204.161.106:9898/api/v1';

  // add your config here
  config.middleware = [ 'errorHandler', 'auth' ];

  // 错误请求中间件
  config.errorHandler = {
    match: '/api',
  };
  // 登录验证中间件
  config.auth = {
    match: '/api/v2',
    // ignore: `/api/v1/captcha`
  };


  /*   (important:)   模板位置  */
  config.view = {
    root: [
      path.join(appInfo.baseDir, '/app/view'),
      // path.join(appInfo.baseDir, 'path/to/another'),
    ].join(','),

    mapping: {
      '.njk': 'nunjucks',
    },
    defaultViewEngine: 'nunjucks',
    defaultExtension: '.njk',
  };

  /*   (important:)   jwt秘钥设置  */
  config.jwt = {
    secret: 'HuaShi',
  };

  /*   (important:)   数据库链接信息  */
  config.sequelize = {
    dialect: 'mysql',
    database: 'koa2',
    username: 'root',
    password: '12345678',
    host: '47.74.128.254',
    port: 3306,
  };


  /*   (important:)    Cookie 中需要用到加解密和验签  */
  config.keys = 'HuaShi';


  return config;
};
