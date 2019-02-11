'use strict';

const Controller = require('../care/base_controller');

class InfoQueryController extends Controller {

  // 信息查询 => 查位次
  async rank() {
    const { ctx } = this;
    await ctx.render('/infoQuery/rank', {
      msg: '查位次',
    });
  }


  // 信息查询 => 批次线查询
  async batchLine() {
    const { ctx } = this;
    await ctx.render('/infoQuery/batchLine', {
      msg: '批次线',
    });
  }


  // 信息查询 => 院校榜
  async collegeBang() {
    const { ctx } = this;
    await ctx.render('/infoQuery/collegeBang', {
      msg: '院校榜',
    });
  }


}

module.exports = InfoQueryController;
