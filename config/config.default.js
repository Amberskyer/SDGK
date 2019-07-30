'use strict';
const path = require('path');

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_HuaShi';
  config.apiHeader = '';

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


  config.mysql = {
    clients: {
      // clientId, 获取client实例，需要通过 app.mysql.get('clientId') 获取
      sdgk: {
        // host
        host: '192.168.50.201',
        // 端口号
        port: '3306',
        // 用户名
        user: 'dev',
        // 密码
        password: 'dev',
        // 数据库名
        database: 'sdgk-dev',
      },
      zsgk: {
        // host
        host: '192.168.50.201',
        // 端口号
        port: '3306',
        // 用户名
        user: 'dev',
        // 密码
        password: 'dev',
        // 数据库名
        database: 'zsgk',
      },
      youzy: {
        // host
        host: '192.168.50.201',
        // 端口号
        port: '3306',
        // 用户名
        user: 'dev',
        // 密码
        password: 'dev',
        // 数据库名
        database: 'youzy',
      },
      // ...
    },
    // 所有数据库配置的默认值
    default: {

    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };
  /*   (important:)   数据库链接信息  */
  config.sequelize = {
    dialect: 'mysql',
    database: 'zsgk',
    username: 'root',
    password: '123456',
    host: '127.0.0.1',
    port: 3306,
  };


  /*   (important:)    Cookie 中需要用到加解密和验签  */
  config.keys = 'HuaShi';


  return config;
};
