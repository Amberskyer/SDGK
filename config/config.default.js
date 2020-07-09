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


  config.ChinaUnicom = {
    productCode: [
      { type: 'TR', value: 'gk0001' },
      { type: 'U', value: 'gk0002' },
    ],
    key: 'cac07806c9cd24ecceb5204a32de27de',
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
      // sdgk: {
      //   // host
      //   host: '192.168.50.201',
      //   // 端口号
      //   port: '3306',
      //   // 用户名
      //   user: 'dev',
      //   // 密码
      //   password: 'dev',
      //   // 数据库名
      //   database: 'sdgk-dev',
      // },
      // zsgk: {
      //   // host
      //   host: '192.168.50.201',
      //   // 端口号
      //   port: '3306',
      //   // 用户名
      //   user: 'dev',
      //   // 密码
      //   password: 'dev',
      //   // 数据库名
      //   database: 'zsgk',
      // },
      // youzy: {
      //   // host
      //   host: '192.168.50.201',
      //   // 端口号
      //   port: '3306',
      //   // 用户名
      //   user: 'dev',
      //   // 密码
      //   password: 'dev',
      //   // 数据库名
      //   database: 'youzy',
      // },
      // jyrc: {
      //   // host
      //   host: '127.0.0.1',
      //   // 端口号
      //   port: '3306',
      //   // 用户名
      //   user: 'root',
      //   // 密码
      //   password: '123456789',
      //   // 数据库名
      //   database: 'zhiwang',
      // },
      wmzy: {
        // host
        host: '127.0.0.1',
        // 端口号
        port: '3306',
        // 用户名
        user: 'root',
        // 密码
        password: '123456',
        // 数据库名
        database: 'wmzy',
      },
      // bkzy: {
      //   // host
      //   host: '127.0.0.1',
      //   // 端口号
      //   port: '3306',
      //   // 用户名
      //   user: 'root',
      //   // 密码
      //   password: '123456789',
      //   // 数据库名
      //   database: 'xgk',
      // },
      // jyrc: {
      //   // host
      //   host: '122.204.161.106',
      //   // 端口号
      //   port: '3306',
      //   // 用户名
      //   user: 'dsjdev',
      //   // 密码
      //   password: 'dsjdev',
      //   // 数据库名
      //   database: 'data-center-dev2',
      // },
      // information_schema: {
      //   // host
      //   host: '122.204.161.106',
      //   // 端口号
      //   port: '3306',
      //   // 用户名
      //   user: 'dsjdev',
      //   // 密码
      //   password: 'dsjdev',
      //   // 数据库名
      //   database: 'information_schema',
      // },
      // nfsawards: {
      //   // host
      //   host: '122.204.161.106',
      //   // 端口号
      //   port: '3306',
      //   // 用户名
      //   user: 'dsjdev',
      //   // 密码
      //   password: 'dsjdev',
      //   // 数据库名
      //   database: 'nfsawards',
      // },
      // xgk: {
      //   // host
      //   host: '127.0.0.1',
      //   // 端口号
      //   port: '3306',
      //   // 用户名
      //   user: 'root',
      //   // 密码
      //   password: '123456',
      //   // 数据库名
      //   database: 'xgk',
      // },
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
    datasources: [
      // { delegate: 'zsgkModel', // load all models to app.model and ctx.model
      //   baseDir: 'model/zsgk', // load models from `app/model/*.js`
      //   dialect: 'mysql',
      //   database: 'zsgk',
      //   username: 'root',
      //   password: '123456',
      //   host: '127.0.0.1',
      //   port: 3306,
      // },
      { delegate: 'zsgkModel', // load all models to app.model and ctx.model
        baseDir: 'model/zsgk', // load models from `app/model/*.js`
        dialect: 'mysql',
        database: 'sdgk-data-dev',
        username: 'dev',
        password: 'yqdev2020??',
        host: '47.98.141.198',
        port: 3306,
      },
      { delegate: 'youzyModel', // load all models to app.model and ctx.model
        baseDir: 'model/youzy', // load models from `app/model/*.js`
        dialect: 'mysql',
        database: 'jzy',
        username: 'dev',
        password: 'yqdev2020??',
        host: '47.98.141.198',
        port: 3306,
      },
      // { delegate: 'youzyModel', // load all models to app.model and ctx.model
      //   baseDir: 'model/youzy', // load models from `app/model/*.js`
      //   dialect: 'mysql',
      //   database: 'youzy',
      //   username: 'root',
      //   password: '123456',
      //   host: '127.0.0.1',
      //   port: 3306,
      // },
      // { delegate: 'sdgkModel', // load all models to app.model and ctx.model
      //   baseDir: 'model/sdgk', // load models from `app/model/*.js`
      //   dialect: 'mysql',
      //   database: 'sdgk',
      //   username: 'root',
      //   password: '123456',
      //   host: '127.0.0.1',
      //   port: 3306,
      // },
      // { delegate: 'cSchoolMajorAdmissionModel', // load all models to app.model and ctx.model
      //   baseDir: 'model/c_school_major_admission', // load models from `app/model/*.js`
      //   dialect: 'mysql',
      //   database: 'c_school_major_admission',
      //   username: 'root',
      //   password: '123456',
      //   host: '127.0.0.1',
      //   port: 3306,
      // },
      { delegate: 'yggkModel', // load all models to app.model and ctx.model
        baseDir: 'model/yggk', // load models from `app/model/*.js`
        dialect: 'mysql',
        database: 'yggk',
        username: 'root',
        password: '123456',
        host: '127.0.0.1',
        port: 3306,
      },
      { delegate: 'phoneModel', // load all models to app.model and ctx.model
        baseDir: 'model/phone', // load models from `app/model/*.js`
        dialect: 'mysql',
        database: 'phone',
        username: 'root',
        password: '123456',
        host: '127.0.0.1',
        port: 3306,
      },
      // { delegate: 'kkModel', // load all models to app.model and ctx.model
      //   baseDir: 'model/kk', // load models from `app/model/*.js`
      //   dialect: 'mysql',
      //   database: 'kk2020',
      //   username: 'root',
      //   password: '123456',
      //   host: '127.0.0.1',
      //   port: 3306,
      // },
      { delegate: 'kkModel', // load all models to app.model and ctx.model
        baseDir: 'model/kk', // load models from `app/model/*.js`
        dialect: 'mysql',
        database: 'sdgk-data-dev',
        username: 'dev',
        password: 'yqdev2020??',
        host: '47.98.141.198',
        port: 3306,
      },
      // { delegate: 'youzyModel', // load all models to app.model and ctx.model
      //   baseDir: 'model/youzy', // load models from `app/model/*.js`
      //   dialect: 'mysql',
      //   database: 'youzy',
      //   username: 'dev',
      //   password: 'dev',
      //   host: '91130.vicp.net',
      //   port: 11306,
      // },
    ],
  };


  /*   (important:)    Cookie 中需要用到加解密和验签  */
  config.keys = 'HuaShi';


  // config/config.default.js
  config.httpclient = {
    // 是否开启本地 DNS 缓存，默认关闭，开启后有两个特性
    // 1. 所有的 DNS 查询都会默认优先使用缓存的，即使 DNS 查询错误也不影响应用
    // 2. 对同一个域名，在 dnsCacheLookupInterval 的间隔内（默认 10s）只会查询一次
    enableDNSCache: true,
    // 对同一个域名进行 DNS 查询的最小间隔时间
    dnsCacheLookupInterval: 10000,
    // DNS 同时缓存的最大域名数量，默认 1000
    dnsCacheMaxLength: 1000,

    request: {
      // 默认 request 超时时间
      timeout: 80000,
    },

    httpAgent: {
      // 默认开启 http KeepAlive 功能
      keepAlive: true,
      // 空闲的 KeepAlive socket 最长可以存活 4 秒
      freeSocketTimeout: 4000,
      // 当 socket 超过 30 秒都没有任何活动，就会被当作超时处理掉
      timeout: 30000,
      // 允许创建的最大 socket 数
      maxSockets: Number.MAX_SAFE_INTEGER,
      // 最大空闲 socket 数
      maxFreeSockets: 256,
    },

    httpsAgent: {
      // 默认开启 https KeepAlive 功能
      keepAlive: true,
      // 空闲的 KeepAlive socket 最长可以存活 4 秒
      freeSocketTimeout: 4000,
      // 当 socket 超过 30 秒都没有任何活动，就会被当作超时处理掉
      timeout: 30000,
      // 允许创建的最大 socket 数
      maxSockets: Number.MAX_SAFE_INTEGER,
      // 最大空闲 socket 数
      maxFreeSockets: 256,
    },
  };


  /*   (important:)   跨域设置  */
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    xframe: {
      enable: false,
    },
    // domainWhiteList: [ '127.0.0.3' ], // 配置白名单
  };
  //
  // /*   (important:)   跨域设置  */3
  config.cors = {
    origin: '*', // 允许所有跨域访问，注释掉则允许上面 白名单 访问
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };

  return config;
};
