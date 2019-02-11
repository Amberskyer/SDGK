'use strict';

const Controller = require('../care/base_controller');

class NewsController extends Controller {
  // 高考资讯 => 高招资讯
  async index() {
    const { ctx } = this;
    const { type } = ctx.params;
    const [ result1, result2 ] = await Promise.all([ ctx.service.news.index(), ctx.service.news.index() ]);
    // super.loadCount();
    ctx.session.userId = 250;
    await ctx.render('/news/index', {
      msg: `${type}资讯`,
      result1,
      result2,
    });
  }

}

module.exports = NewsController;
