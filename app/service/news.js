'use strict';
const Service = require('../care/base_service');


class TopicService extends Service {
  constructor(ctx) {
    super(ctx);
  }

  async index() {
    const { ctx } = this;
    const result = await ctx.curl(`${this.apiHeader}/diqu/list?page=1&pageSize=20`, {
      method: 'get',
      dataType: 'json',
      contentType: 'json',
    });
    return result.data.list;
  }


}


module.exports = TopicService;
