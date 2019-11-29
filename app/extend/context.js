'use strict';
const qs = require('qs');

module.exports = {


  async basePost(url = '', data = {}, cookie, referer) {
    const { app } = this;
    const apiHeader = app.config.apiHeader;
    // const authorization = this.session.token;
    // data = this.helper.formatParamsType(data);
    // console.log(referer);
    const result = await app.curl(apiHeader + url, {
      method: 'post',
      dataType: 'json',
      contentType: 'application/x-www-form-urlencoded',
      data,
      headers: {
        Cookie: cookie,
        DNT: 1,
        Host: 'kns.cnki.net',
        Origin: 'https://kns.cnki.net',
        Referer: referer,
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

  async baseGet(url = '', data = {}, cookie, referer) {
    const { app } = this;
    const apiHeader = app.config.apiHeader;
    const result = await app.curl(apiHeader + url, {
      dataType: 'json',
      data,
      headers: {
        Cookie: cookie,
        DNT: 1,
        Host: 'kns.cnki.net',
      },
    }).then(function(res) {
      console.log(res);
      return res;
    }).catch(function(err) {
      console.log(err);
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
