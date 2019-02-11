'use strict';
const Service = require('egg').Service;


class BaseService extends Service {

  constructor(ctx) {
    super(ctx);
    this.apiHeader = ctx.app.config.apiHeader;
  }

}


module.exports = BaseService;
