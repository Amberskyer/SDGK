'use strict';
const qs = require('qs');

module.exports = {


  async basePost(url = '', data = {}, cookie) {
    const { app } = this;
    const apiHeader = app.config.apiHeader;
    const result = await app.curl(apiHeader + url, {
      method: 'post',
      dataType: 'json',
      contentType: 'json',
      data,
      headers: {
        // Cookie: cookie,
      },
    }).then(async res => {
      return res;
    }).catch(function() {
      return [];
    });
    return await this.initResult(this, result);
  },

  async basePostForYouzy(url = '', data = {}, cookie, referer) {
    const { app } = this;
    const apiHeader = app.config.apiHeader;
    const result = await app.curl(apiHeader + url, {
      method: 'post',
      dataType: 'json',
      contentType: 'json',
      data,
      headers: {
        Cookie: cookie,
        Referer: referer,
      },
    }).then(async res => {
      return res;
    }).catch(function() {
      return [];
    });
    return await this.initResult(this, result);
  },

  async basePostForWmzy(url = '', data = {}, cookie) {
    const { app } = this;
    const apiHeader = app.config.apiHeader;
    // const authorization = this.session.token;
    // data = this.helper.formatParamsType(data);
    // console.log(referer);
    const result = await app.curl(apiHeader + url, {
      method: 'post',
      dataType: 'json',
      contentType: 'application/json',
      // contentType: 'application/x-www-form-urlencoded',
      data,
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        Authorization: '1443207 lPtw4XYfpJ482FKFbm8dBG7wfUvdVA22XqFYEEJGFQh7M6GJFBpO+D9oNszWhAZa',
        Channel: 'www.wmzy.com pc',
        Connection: 'keep-alive',
        // 'Content-Length': '37',
        // 'Content-Type': 'application/json',
        Cookie: cookie,
        // DNT: '1',
        // Host: 'www.wmzy.com',
        // Origin: 'https://www.wmzy.com',
        // Referer: ' https://www.wmzy.com/web/school/list',
        // 'Sec-Fetch-Dest': 'empty',
        // 'Sec-Fetch-Mode': 'cors',
        // 'Sec-Fetch-Site': 'same-origin',
        // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
        // 'x-requested-with': 'XMLHttpRequest',
      },
    }).then(async res => {
      return res;
    }).catch(function(err) {
      console.log({ err });
      return err;
    });
    return result;
  },

  async basePut(url = '', data = {}) {
    const { app } = this;
    const apiHeader = app.config.apiHeader;
    const authorization = this.session.token;
    data = this.helper.formatParamsType(data);
    const result = await app.curl(apiHeader + url, {
      method: 'put',
      dataType: 'json',
      contentType: 'json',
      data,
      headers: { authorization },
    }).then(async res => {
      return res;
    }).catch(function() {
      return [];
    });
    return await this.initResult(this, result);
  },

  async baseGet(url = '', data = {}, cookie) {
    const { app } = this;
    const apiHeader = app.config.apiHeader;
    const result = await app.curl(apiHeader + url, {
      dataType: 'json',
      data,
      headers: {
        Cookie: cookie,
        // DNT: 1,
        // Host: 'kns.cnki.net',
      },
    }).then(function(res) {
      // console.log(res);
      return res;
    }).catch(function(err) {
      // console.log(err);
      return err;
    });
    return result;
  },

  async baseDelete(url = '', data = {}) {
    const { app } = this;
    const apiHeader = app.config.apiHeader;
    data = this.helper.formatParamsType(data);
    const authorization = this.session.token;
    const result = await app.curl(apiHeader + url, {
      method: 'delete',
      dataType: 'json',
      data,
      headers: { authorization },
    }).then(function(res) {
      return res;
    }).catch(function() {
      return [];
    });
    return await this.initResult(this, result);
  },


  async initResult(ctx, result) {
    if (result.status === 200) {
      return result.data;
    }
    return result;
  },


};
