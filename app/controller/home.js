'use strict';

const Controller = require('../care/base_controller');

class HomeController extends Controller {
  // 主页 => index
  async index() {
    const { ctx } = this;
    await ctx.render('home/index', {
      msg: '主页',
    });
  }

  // 主页 => 学校搜索指数
  async schoolHeat() {
    const { ctx } = this;
    ctx.body = 'hi, 学校搜索指数';
  }

  // 主页 => 专业搜索指数
  async majorHeat() {
    const { ctx } = this;
    ctx.body = 'hi, 专业搜索指数';
  }

}

module.exports = HomeController;
